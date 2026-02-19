import { AfterViewInit, Component, Injector, effect } from '@angular/core';
import * as L from 'leaflet';
import { SelectionStore } from '../../core/state/selection.store';
import { AccidentApi, AccidentDto } from '../../core/api/accident.api';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private provinceLayer!: L.GeoJSON;
  private markersLayer = L.layerGroup();

  constructor(
    private selection: SelectionStore,
    private injector: Injector,
    private api: AccidentApi
  ) { }

  async ngAfterViewInit(): Promise<void> {
    // 1) Mapa base
    this.map = L.map('map').setView([37.3, -4.8], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Capa para markers
    this.markersLayer.addTo(this.map);
    let accidentLayer = L.layerGroup().addTo(this.map);

    effect(async () => {
      const provinces = Array.from(this.selection.selected());

      accidentLayer.clearLayers();

      if (provinces.length === 0) return;

      const accidents = await firstValueFrom(
        this.api.getByProvinces(provinces)
      );

      accidents.forEach(acc => {
        L.marker([acc.lat, acc.lng])
          .bindPopup(`${acc.province}`)
          .addTo(accidentLayer);
      });
    }, { injector: this.injector });


    // 2) Cargar provincias (GeoJSON)
    const res = await fetch('/geo/provincias_spain.geojson');
    const geojson = await res.json();

    const andalucia = new Set([
      'Almería',
      'Cádiz',
      'Córdoba',
      'Granada',
      'Huelva',
      'Jaén',
      'Málaga',
      'Sevilla',
    ]);

    const filtered = {
      ...geojson,
      features: geojson.features.filter((f: any) => andalucia.has(f?.properties?.Texto ?? '')),
    };

    // 3) Pintar capa de provincias (con estilo que depende de selección)
    this.provinceLayer = L.geoJSON(filtered as any, {
      style: (feature: any) => {
        const name = feature?.properties?.Texto ?? '';
        const isSelected = this.selection.isSelected(name);

        return {
          weight: 2,
          opacity: 1,
          color: isSelected ? '#ffd54f' : '#1976d2',
          fillOpacity: isSelected ? 0.4 : 0.08,
        };
      },
    }).addTo(this.map);

    // Zoom a Andalucía
    const bounds = this.provinceLayer.getBounds();
    if (bounds.isValid()) this.map.fitBounds(bounds, { padding: [20, 20] });

    // 4) Reactivo: cuando cambie selección -> repintar provincias + cargar accidentes y pintar markers
    effect(
      () => {
        const selectedSet = this.selection.selected();
        const provinces = Array.from(selectedSet);

        // Repintar estilos de provincias
        this.provinceLayer.setStyle((feature: any) => {
          const name = feature?.properties?.Texto ?? '';
          const isSelected = this.selection.isSelected(name);

          return {
            weight: 2,
            opacity: 1,
            color: isSelected ? '#ffd54f' : '#1976d2',
            fillOpacity: isSelected ? 0.4 : 0.08,
          };
        });

        // Si no hay provincias seleccionadas, limpiamos markers y no llamamos API
        if (provinces.length === 0) {
          this.markersLayer.clearLayers();
          return;
        }

        // Llamada al backend y pintado (async sin liarnos con RxJS todavía)
        void this.loadAndPaintAccidents(provinces);
      },
      { injector: this.injector }
    );
  }

  private async loadAndPaintAccidents(provinces: string[]): Promise<void> {
    try {
      const accidents: AccidentDto[] = await firstValueFrom(this.api.getByProvinces(provinces));

      this.markersLayer.clearLayers();

      for (const a of accidents) {
        // Si el backend no filtra aún por provincias (mock), filtramos aquí por seguridad
        if (provinces.length && !provinces.includes(a.province)) continue;

        const marker = L.marker([a.lat, a.lng]).bindPopup(
          `<b>${a.province}</b><br/>Accidente #${a.id}`
        );
        marker.addTo(this.markersLayer);
      }
    } catch (e) {
      console.error('Error cargando accidentes', e);
      this.markersLayer.clearLayers();
    }
  }
}
