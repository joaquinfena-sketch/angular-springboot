import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Header } from '../../shared/header/header';
import { AuthService } from '../../core/auth/auth.service';
import { LoadingService } from '../../core/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Header,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  readonly form;
  readonly submitting = signal(false);

  constructor(
    fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private overlay: LoadingService
  ) {
    this.form = fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.submitting.set(true);
    const { username, password } = this.form.getRawValue();

    this.auth.login(username!, password!).subscribe({
      next: (ok) => {
        this.submitting.set(false);
        if (!ok) {
          this.overlay.showMessage(
            {
              title: 'Usuario o contraseña incorrectos',
              subtitle: 'Revisa los datos e inténtalo de nuevo',
              variant: 'error',
              tone: 'pink',
            },
            3500
          );
          return;
        }
        void this.router.navigateByUrl('/home');
      },
      error: () => {
        this.submitting.set(false);
        this.overlay.showMessage(
          {
            title: 'Error de conexión',
            subtitle: 'No se pudo conectar con el servidor',
            variant: 'error',
            tone: 'pink',
          },
          3500
        );
      },
    });
  }
}

