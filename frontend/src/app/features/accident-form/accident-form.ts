import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { jsPDF } from 'jspdf';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { GetAccidentPointsUseCase } from '../../core/use-case/get-accident-points.use-case';
import type { AccidentPoint } from '../../core/domain/accident.model';

@Component({
  selector: 'app-accident-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './accident-form.html',
  styleUrl: './accident-form.scss',
})
export class AccidentFormComponent {
  readonly provinces = [
    'Almería',
    'Cádiz',
    'Córdoba',
    'Granada',
    'Huelva',
    'Jaén',
    'Málaga',
    'Sevilla',
  ];

  /** Los 4 puntos de la provincia seleccionada (se cargan al elegir provincia). */
  readonly locationPoints = signal<AccidentPoint[]>([]);
  readonly loadingLocations = signal(false);

  readonly form;

  /** Punto seleccionado (para resumen bajo el formulario). */
  readonly selectedPoint = signal<AccidentPoint | null>(null);

  constructor(
    private fb: FormBuilder,
    private getAccidentPoints: GetAccidentPointsUseCase
  ) {
    this.form = this.fb.group({
      province: ['', [Validators.required]],
      locationId: [null as number | null, [Validators.required]],
    });
  }

  onProvinceChange(): void {
    const province = this.form.get('province')?.value;
    this.form.patchValue({ locationId: null });
    this.locationPoints.set([]);
    this.selectedPoint.set(null);
    if (!province) return;

    this.loadingLocations.set(true);
    firstValueFrom(this.getAccidentPoints.getByProvinces([province])).then((points) => {
      this.locationPoints.set(points);
      this.loadingLocations.set(false);
    }).catch(() => this.loadingLocations.set(false));
  }

  onLocationSelect(locationId: number): void {
    const p = this.locationPoints().find((x) => x.id === locationId) ?? null;
    this.selectedPoint.set(p);
  }

  hasError(name: 'province' | 'locationId'): boolean {
    const c = this.form.get(name);
    return !!c && c.touched && c.invalid;
  }

  errorText(name: 'province' | 'locationId'): string {
    const c = this.form.get(name);
    if (!c) return 'Campo inválido';
    if (c.hasError('required')) return 'Campo obligatorio';
    return 'Campo inválido';
  }

  downloadPdf(): void {
    const p = this.selectedPoint();
    if (!p) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Punto seleccionado', 14, 20);
    doc.setFontSize(11);
    doc.text(`Localidad: ${p.name}`, 14, 32);
    doc.text(`Provincia: ${p.province}`, 14, 40);
    doc.text(`Latitud: ${p.lat.toFixed(4)}`, 14, 48);
    doc.text(`Longitud: ${p.lng.toFixed(4)}`, 14, 56);
    doc.save(`punto-${p.name.replace(/\s+/g, '-')}.pdf`);
  }
}
