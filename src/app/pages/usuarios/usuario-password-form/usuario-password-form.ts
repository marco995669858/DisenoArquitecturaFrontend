import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { UsuarioDTO } from '@/app/core/models/usuario';
import { UsuarioService } from '@/app/core/services/usuario-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';

@Component({
    selector: 'app-usuario-password-form',
    templateUrl: './usuario-password-form.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, PasswordModule, ButtonModule]
})
export class UsuarioPasswordForm implements OnInit {
    private usuarioService = inject(UsuarioService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);

    formGroup!: FormGroup;
    submite = false;

    ngOnInit() {
        const data: UsuarioDTO = this.config.data;
        this.formGroup = this.fb.group({
            idUsuario: [data?.idUsuario ?? null],
            passwordNueva: ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    get f() {
        return this.formGroup.controls;
    }

    onClickGuardar() {
        if (this.formGroup.valid) {
            this.usuarioService.cambiarPassword(this.formGroup.getRawValue()).subscribe({
                next: (respuesta) => {
                    if (respuesta.error) {
                        return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                    }
                    this.notificacion.mostrarMensaje(1, respuesta.mensaje);
                    this.cerrarModal();
                },
                error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cambiar la contraseña.')
            });
        } else {
            this.submite = true;
            setTimeout(() => (this.submite = false), 9000);
        }
    }

    cerrarModal() {
        this.ref.close(true);
    }
}
