import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UsuarioService } from '@/app/core/services/usuario-service';
import { AuthService } from '@/app/core/services/auth-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { PermisosService } from '@/app/core/services/permisos-service';
import { UsuarioDTO } from '@/app/core/models/usuario';
import { UsuarioForm } from './usuario-form/usuario-form';
import { UsuarioPasswordForm } from './usuario-password-form/usuario-password-form';

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.html',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, TagModule, TooltipModule, InputIconModule, IconFieldModule, InputTextModule]
})
export class Usuarios implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    private usuarioService = inject(UsuarioService);
    private authService = inject(AuthService);
    private notificacion = inject(NotificacionService);
    private cdr = inject(ChangeDetectorRef);
    private dialogService = inject(DialogService);
    protected permisosService = inject(PermisosService);

    usuarios: UsuarioDTO[] = [];
    modalRef: DynamicDialogRef | null = null;

    ngOnInit() {
        this.listar();
    }

    listar() {
        this.usuarioService.listar().subscribe({
            next: (respuesta) => {
                if (respuesta.error) {
                    return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                }
                this.usuarios = respuesta.data ?? [];
                this.cdr.detectChanges();
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar los usuarios.')
        });
    }

    /** El usuario no puede eliminar su propia cuenta (el backend ya lo bloquea; esto solo evita el viaje al servidor). */
    esUsuarioActual(idUsuario?: number): boolean {
        return idUsuario != null && idUsuario === this.authService.usuarioActual()?.idUsuario;
    }

    onClicAbrirDialogoEliminar(idUsuario?: number) {
        if (!idUsuario) return;
        this.notificacion.mostrarDialog('¿Eliminar usuario?', 'El usuario dejará de poder iniciar sesión.', 'warning', '#d33', '#3085d6', 'Sí', 'No').then((r) => {
            if (r.isConfirmed) {
                this.usuarioService.eliminar({ idUsuario }).subscribe({
                    next: (respuesta) => {
                        if (respuesta.error) {
                            return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                        }
                        this.notificacion.mostrarMensaje(1, respuesta.mensaje);
                        this.listar();
                    },
                    error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al eliminar el usuario.')
                });
            }
        });
    }

    openModal(data?: UsuarioDTO) {
        const titulo = !data ? 'NUEVO USUARIO' : 'EDITAR USUARIO';
        this.modalRef = this.dialogService.open(UsuarioForm, {
            header: titulo,
            width: '520px',
            baseZIndex: 10000,
            closable: true,
            focusOnShow: true,
            draggable: true,
            keepInViewport: true,
            closeOnEscape: false,
            data
        });

        this.modalRef?.onClose.subscribe((r: any) => {
            if (r) this.listar();
        });
    }

    onClicReiniciarMfa(usuario: UsuarioDTO) {
        this.notificacion
            .mostrarDialog(
                '¿Reiniciar verificación en dos pasos?',
                `${usuario.nombreUsuario} deberá configurarla de nuevo (escanear un nuevo código QR) en su próximo inicio de sesión. Use esto solo si la persona perdió el acceso a su app de autenticación.`,
                'warning',
                '#d33',
                '#3085d6',
                'Sí, reiniciar',
                'No'
            )
            .then((r) => {
                if (r.isConfirmed) {
                    this.usuarioService.resetearMfaDeUsuario({ idUsuario: usuario.idUsuario }).subscribe({
                        next: (respuesta) => {
                            if (respuesta.error) {
                                return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                            }
                            this.notificacion.mostrarMensaje(1, respuesta.mensaje);
                        },
                        error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al reiniciar la verificación en dos pasos.')
                    });
                }
            });
    }

    openPasswordModal(data: UsuarioDTO) {
        this.modalRef = this.dialogService.open(UsuarioPasswordForm, {
            header: `CAMBIAR CONTRASEÑA — ${data.nombreUsuario}`,
            width: '420px',
            baseZIndex: 10000,
            closable: true,
            focusOnShow: true,
            draggable: true,
            keepInViewport: true,
            closeOnEscape: false,
            data
        });
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
