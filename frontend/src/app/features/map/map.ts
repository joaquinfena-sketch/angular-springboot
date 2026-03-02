import { AfterViewInit, Component, Injector, effect, signal } from '@angular/core';
import * as L from 'leaflet';
import { SelectionStore } from '../../core/state/selection.store';
import { GetAccidentPointsUseCase } from '../../core/use-case/get-accident-points.use-case';
import type { AccidentPoint } from '../../core/domain/accident.model';
import { firstValueFrom } from 'rxjs';

// leaflet.heat añade L.heatLayer en runtime
// ✅ Fix iconos Leaflet en Angular (para que no salgan rotos)
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
});


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
  private heatLayer: any = null;
  private lastAccidents: AccidentPoint[] = [];

  showHeatmap = signal(false);
  density = signal(3);

  constructor(
    private selection: SelectionStore,
    private injector: Injector,
    private getAccidentPoints: GetAccidentPointsUseCase
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
        this.getAccidentPoints.getByProvinces(provinces)
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

        // Si no hay provincias seleccionadas, limpiamos markers, datos y capa de calor
        if (provinces.length === 0) {
          this.markersLayer.clearLayers();
          this.lastAccidents = [];
          this.updateHeatLayer();
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
      const accidents: AccidentPoint[] = await firstValueFrom(this.getAccidentPoints.getByProvinces(provinces));

      console.log('[Mapa] Accidentes recibidos:', accidents.length, accidents.length ? accidents[0] : null);

      this.markersLayer.clearLayers();

      let added = 0;
      for (const a of accidents) {
        if (provinces.length && !provinces.includes(a.province)) continue;

        const marker = L.marker([a.lat, a.lng]).bindPopup(
          `<b>${a.name || a.province}</b><br/>${a.province}`
        );
        marker.addTo(this.markersLayer);
        added++;
      }
      console.log('[Mapa] Marcadores añadidos a la capa:', added);

      this.lastAccidents = accidents;
      this.updateHeatLayer();
    } catch (e) {
      console.error('[Mapa] Error cargando accidentes', e);
      this.markersLayer.clearLayers();
      this.lastAccidents = [];
      this.updateHeatLayer();
    }
  }

  toggleHeatmap(e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    this.showHeatmap.set(checked);
    this.updateHeatLayer();
  }

  onDensityChange(e: Event): void {
    const v = parseInt((e.target as HTMLInputElement).value, 10);
    this.density.set(v);
    this.updateHeatLayer();
  }

  private updateHeatLayer(): void {
    if (!this.map) return;

    if (!this.showHeatmap()) {
      if (this.heatLayer) {
        this.map.removeLayer(this.heatLayer);
        this.heatLayer = null;
      }
      return;
    }

    // Aceptar lng tanto en minúscula como del API (p. ej. Lng)
    const latlngs: [number, number, number][] = this.lastAccidents
      .filter((a) => typeof (a as any).lat === 'number' && (typeof (a as any).lng === 'number' || typeof (a as any).Lng === 'number'))
      .map((a) => [(a as any).lat, (a as any).lng ?? (a as any).Lng, 0.7] as [number, number, number]);

    const d = this.density();
    const radius = 20 + (d - 1) * 12;
    const blur = 15 + (d - 1) * 5;
    const opts = { radius, blur, maxZoom: 16, minOpacity: 0.35 };

    if (latlngs.length === 0) {
      if (this.heatLayer) {
        this.map.removeLayer(this.heatLayer);
        this.heatLayer = null;
      }
      return;
    }

    if (this.heatLayer) {
      this.heatLayer.setOptions(opts);
      this.heatLayer.setLatLngs(latlngs);
      return;
    }

    const Lg = (window as unknown as { L: typeof L }).L;
    const heatLayerFn = (Lg?.heatLayer ?? (L as any).heatLayer) as (latlngs: [number, number, number][], o: object) => L.Layer;
    if (!heatLayerFn) return;
    this.heatLayer = heatLayerFn(latlngs, opts).addTo(this.map) as any;
  }
}
