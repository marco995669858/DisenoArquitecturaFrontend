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
import { ReciboServicioService } from '@/app/core/services/recibo-servicio-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { PermisosService } from '@/app/core/services/permisos-service';
import { ReciboServicioDTO } from '@/app/core/models/recibo-servicio';
import { ReciboForm } from './recibo-form/recibo-form';

@Component({
    selector: 'app-recibos',
    templateUrl: './recibos.html',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, TagModule, InputIconModule, IconFieldModule, InputTextModule]
})
export class Recibos implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    private reciboService = inject(ReciboServicioService);
    private notificacion = inject(NotificacionService);
    private cdr = inject(ChangeDetectorRef);
    private dialogService = inject(DialogService);
    protected permisosService = inject(PermisosService);

    recibos: ReciboServicioDTO[] = [];
    modalRef: DynamicDialogRef | null = null;

    ngOnInit() {
        this.listar();
    }

    listar() {
        this.reciboService.listar().subscribe({
            next: (respuesta) => {
                if (respuesta.error) {
                    return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                }
                this.recibos = respuesta.data ?? [];
                this.cdr.detectChanges();
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar los recibos.')
        });
    }

    onClicAbrirDialogoEliminar(idRecibo?: number) {
        if (!idRecibo) return;
        this.notificacion.mostrarDialog('¿Eliminar recibo?', 'El recibo dejará de aparecer en los listados.', 'warning', '#d33', '#3085d6', 'Sí', 'No').then((r) => {
            if (r.isConfirmed) {
                this.reciboService.eliminar({ idRecibo }).subscribe({
                    next: (respuesta) => {
                        if (respuesta.error) {
                            return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                        }
                        this.notificacion.mostrarMensaje(1, respuesta.mensaje);
                        this.listar();
                    },
                    error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al eliminar el recibo.')
                });
            }
        });
    }

    openModal(data?: ReciboServicioDTO) {
        const titulo = !data ? 'NUEVO RECIBO' : 'EDITAR RECIBO';
        this.modalRef = this.dialogService.open(ReciboForm, {
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

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
