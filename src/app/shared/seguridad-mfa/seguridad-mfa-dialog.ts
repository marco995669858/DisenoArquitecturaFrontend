import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import * as QRCode from 'qrcode';
import { UsuarioService } from '@/app/core/services/usuario-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';

/**
 * Activar/desactivar la verificacion en dos pasos (MFA) de la propia cuenta,
 * disponible para cualquier usuario desde el menu Perfil. Es obligatoria por
 * defecto (se pide la primera vez en el login), pero cada quien puede
 * desactivarla aca si no la quiere seguir usando -- y volver a activarla
 * cuando quiera.
 */
@Component({
    selector: 'app-seguridad-mfa-dialog',
    templateUrl: './seguridad-mfa-dialog.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TagModule]
})
export class SeguridadMfaDialog implements OnInit {
    private usuarioService = inject(UsuarioService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private cdr = inject(ChangeDetectorRef);

    cargando = true;
    procesando = false;

    mfaHabilitado = false;

    // Estado transitorio mientras se activa (mostrando el QR) o se desactiva
    // (pidiendo el codigo actual como prueba).
    mostrandoActivacion = false;
    mostrandoDesactivacion = false;
    qrDataUrl: string | null = null;
    secretoManual = '';
    codigo = '';

    ngOnInit() {
        this.cargarEstado();
    }

    private cargarEstado() {
        this.cargando = true;
        this.usuarioService.obtenerEstadoMiMfa().subscribe({
            next: (r) => {
                this.cargando = false;
                if (r.error) {
                    this.notificacion.mostrarMensaje(0, r.mensaje);
                } else {
                    this.mfaHabilitado = r.data.mfaHabilitado;
                }
                this.cdr.detectChanges();
            },
            error: () => {
                this.cargando = false;
                this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al obtener el estado de MFA.');
                this.cdr.detectChanges();
            }
        });
    }

    onClickActivar() {
        this.procesando = true;
        this.usuarioService.activarMiMfa().subscribe({
            next: (r) => {
                this.procesando = false;
                if (r.error) {
                    this.notificacion.mostrarMensaje(0, r.mensaje);
                    this.cdr.detectChanges();
                    return;
                }
                this.secretoManual = r.data.secretoManual;
                this.mostrandoActivacion = true;
                this.qrDataUrl = null;
                this.cdr.detectChanges();
                QRCode.toDataURL(r.data.otpAuthUri).then((url) => {
                    this.qrDataUrl = url;
                    this.cdr.detectChanges();
                });
            },
            error: () => {
                this.procesando = false;
                this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al iniciar la activación.');
                this.cdr.detectChanges();
            }
        });
    }

    onClickConfirmarActivacion() {
        if (!this.codigo || this.codigo.length !== 6) {
            return this.notificacion.mostrarMensaje(0, 'Ingrese el código de 6 dígitos.');
        }
        this.procesando = true;
        this.usuarioService.confirmarMiMfa({ codigo: this.codigo }).subscribe({
            next: (r) => {
                this.procesando = false;
                if (r.error) {
                    this.notificacion.mostrarMensaje(0, r.mensaje);
                    this.cdr.detectChanges();
                    return;
                }
                this.notificacion.mostrarMensaje(1, r.mensaje);
                this.mostrandoActivacion = false;
                this.codigo = '';
                this.mfaHabilitado = true;
                this.cdr.detectChanges();
            },
            error: () => {
                this.procesando = false;
                this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al confirmar la activación.');
                this.cdr.detectChanges();
            }
        });
    }

    onClickPedirDesactivar() {
        this.mostrandoDesactivacion = true;
        this.codigo = '';
    }

    onClickConfirmarDesactivacion() {
        if (!this.codigo || this.codigo.length !== 6) {
            return this.notificacion.mostrarMensaje(0, 'Ingrese el código de 6 dígitos.');
        }
        this.procesando = true;
        this.usuarioService.desactivarMiMfa({ codigo: this.codigo }).subscribe({
            next: (r) => {
                this.procesando = false;
                if (r.error) {
                    this.notificacion.mostrarMensaje(0, r.mensaje);
                    this.cdr.detectChanges();
                    return;
                }
                this.notificacion.mostrarMensaje(1, r.mensaje);
                this.mostrandoDesactivacion = false;
                this.codigo = '';
                this.mfaHabilitado = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.procesando = false;
                this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al desactivar la verificación en dos pasos.');
                this.cdr.detectChanges();
            }
        });
    }

    cancelarPaso() {
        this.mostrandoActivacion = false;
        this.mostrandoDesactivacion = false;
        this.codigo = '';
    }

    cerrarModal() {
        this.ref.close();
    }
}
