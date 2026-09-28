import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ParametroSistemaService } from '@/app/core/services/parametro-sistema-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { PermisosService } from '@/app/core/services/permisos-service';
import { ParametroSistemaDTO } from '@/app/core/models/parametro-sistema';
import { ParametroForm } from './parametro-form/parametro-form';

@Component({
    selector: 'app-parametros',
    templateUrl: './parametros.html',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, InputIconModule, IconFieldModule, InputTextModule]
})
export class Parametros implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    private parametroService = inject(ParametroSistemaService);
    private notificacion = inject(NotificacionService);
    private cdr = inject(ChangeDetectorRef);
    private dialogService = inject(DialogService);
    protected permisosService = inject(PermisosService);

    parametros: ParametroSistemaDTO[] = [];
    modalRef: DynamicDialogRef | null = null;

    ngOnInit() {
        this.listar();
    }

    listar() {
        this.parametroService.listar().subscribe({
            next: (respuesta) => {
                if (respuesta.error) {
                    return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                }
                this.parametros = respuesta.data ?? [];
                this.cdr.detectChanges();
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar los parámetros.')
        });
    }

    onClicAbrirDialogoEliminar(idParametro?: number) {
        if (!idParametro) return;
        this.notificacion.mostrarDialog('¿Eliminar parámetro?', 'El parámetro dejará de aparecer en los listados.', 'warning', '#d33', '#3085d6', 'Sí', 'No').then((r) => {
            if (r.isConfirmed) {
                this.parametroService.eliminar({ idParametro }).subscribe({
                    next: (respuesta) => {
                        if (respuesta.error) {
                            return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                        }
                        this.notificacion.mostrarMensaje(1, respuesta.mensaje);
                        this.listar();
                    },
                    error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al eliminar el parámetro.')
                });
            }
        });
    }

    openModal(data?: ParametroSistemaDTO) {
        const titulo = !data ? 'NUEVO PARÁMETRO' : 'EDITAR PARÁMETRO';
        this.modalRef = this.dialogService.open(ParametroForm, {
            header: titulo,
            width: '480px',
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

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
