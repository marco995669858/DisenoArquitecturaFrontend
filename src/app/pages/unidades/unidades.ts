import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UnidadService } from '@/app/core/services/unidad-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { PermisosService } from '@/app/core/services/permisos-service';
import { UnidadDTO } from '@/app/core/models/unidad';
import { UnidadForm } from './unidad-form/unidad-form';

@Component({
    selector: 'app-unidades',
    templateUrl: './unidades.html',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, TagModule, InputIconModule, IconFieldModule, InputTextModule]
})
export class Unidades implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    private unidadService = inject(UnidadService);
    private notificacion = inject(NotificacionService);
    private cdr = inject(ChangeDetectorRef);
    private dialogService = inject(DialogService);
    protected permisosService = inject(PermisosService);

    unidades: UnidadDTO[] = [];
    modalRef: DynamicDialogRef | null = null;

    ngOnInit() {
        this.listar();
    }

    listar() {
        this.unidadService.listar().subscribe({
            next: (respuesta) => {
                if (respuesta.error) {
                    return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                }
                this.unidades = respuesta.data ?? [];
                this.cdr.detectChanges();
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar las unidades.')
        });
    }

    severidadEstado(estado?: string) {
        switch (estado) {
            case 'DISPONIBLE': return 'success';
            case 'OCUPADO': return 'info';
            case 'MANTENIMIENTO': return 'warn';
            default: return 'secondary';
        }
    }

    onClicAbrirDialogoEliminar(idUnidad?: number) {
        if (!idUnidad) return;
        this.notificacion.mostrarDialog('¿Eliminar unidad?', 'La unidad dejará de aparecer en los listados.', 'warning', '#d33', '#3085d6', 'Sí', 'No').then((r) => {
            if (r.isConfirmed) {
                this.unidadService.eliminar({ idUnidad }).subscribe({
                    next: (respuesta) => {
                        if (respuesta.error) {
                            return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                        }
                        this.notificacion.mostrarMensaje(1, respuesta.mensaje);
                        this.listar();
                    },
                    error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al eliminar la unidad.')
                });
            }
        });
    }

    openModal(data?: UnidadDTO) {
        const titulo = !data ? 'NUEVA UNIDAD' : 'EDITAR UNIDAD';
        this.modalRef = this.dialogService.open(UnidadForm, {
            header: titulo,
            width: '500px',
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
