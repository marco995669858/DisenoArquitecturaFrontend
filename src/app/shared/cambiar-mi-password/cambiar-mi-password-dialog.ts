import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { UsuarioService } from '@/app/core/services/usuario-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';

/**
 * Cambio de la propia contraseña, disponible para cualquier usuario
 * autenticado (no solo el administrador) desde el menú "Perfil" del topbar.
 * A diferencia del cambio que hace el administrador sobre otro usuario,
 * este exige la contraseña actual.
 */
@Component({
    selector: 'app-cambiar-mi-password-dialog',
    templateUrl: './cambiar-mi-password-dialog.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, PasswordModule, ButtonModule]
})
export class CambiarMiPasswordDialog implements OnInit {
    private usuarioService = inject(UsuarioService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private fb = inject(FormBuilder);
    private cdr = inject(ChangeDetectorRef);

    formGroup!: FormGroup;
    submite = false;
    guardando = false;

    ngOnInit() {
        this.formGroup = this.fb.group({
            passwordActual: ['', Validators.required],
            passwordNueva: ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    get f() {
        return this.formGroup.controls;
    }

    onClickGuardar() {
        if (this.formGroup.valid) {
            this.guardando = true;
            this.usuarioService.cambiarMiPassword(this.formGroup.getRawValue()).subscribe({
                next: (respuesta) => {
                    this.guardando = false;
                    if (respuesta.error) {
                        this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                        this.cdr.detectChanges();
                        return;
                    }
                    this.notificacion.mostrarMensaje(1, respuesta.mensaje);
                    this.ref.close(true);
                },
                error: () => {
                    this.guardando = false;
                    this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cambiar la contraseña.');
                    this.cdr.detectChanges();
                }
            });
        } else {
            this.submite = true;
            setTimeout(() => (this.submite = false), 9000);
        }
    }

    cerrarModal() {
        this.ref.close(false);
    }
}
