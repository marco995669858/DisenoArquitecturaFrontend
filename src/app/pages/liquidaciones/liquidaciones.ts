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
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { LiquidacionService } from '@/app/core/services/liquidacion-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { ReporteService } from '@/app/core/services/reporte-service';
import { PermisosService } from '@/app/core/services/permisos-service';
import { LiquidacionDTO } from '@/app/core/models/liquidacion';
import { descargarBlob } from '@/app/core/utils/file-download-utils';
import { LiquidacionForm } from './liquidacion-form/liquidacion-form';
import { GenerarLiquidacionDialog } from './generar-liquidacion-dialog/generar-liquidacion-dialog';

@Component({
    selector: 'app-liquidaciones',
    templateUrl: './liquidaciones.html',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, TagModule, InputIconModule, IconFieldModule, InputTextModule, MenuModule]
})
export class Liquidaciones implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    private liquidacionService = inject(LiquidacionService);
    private notificacion = inject(NotificacionService);
    private reporteService = inject(ReporteService);
    private cdr = inject(ChangeDetectorRef);
    private dialogService = inject(DialogService);
    protected permisosService = inject(PermisosService);

    itemsExportar: MenuItem[] = [
        { label: 'Excel (.xlsx)', icon: 'pi pi-file-excel', command: () => this.exportar('excel') },
        { label: 'PDF', icon: 'pi pi-file-pdf', command: () => this.exportar('pdf') }
    ];

    liquidaciones: LiquidacionDTO[] = [];
    modalRef: DynamicDialogRef | null = null;

    ngOnInit() {
        this.listar();
    }

    listar() {
        this.liquidacionService.listar().subscribe({
            next: (respuesta) => {
                if (respuesta.error) {
                    return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                }
                this.liquidaciones = respuesta.data ?? [];
                this.cdr.detectChanges();
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar las liquidaciones.')
        });
    }

    severidadEstado(estado?: string) {
        switch (estado) {
            case 'PAGADO': return 'success';
            case 'PARCIAL': return 'info';
            case 'PENDIENTE': return 'warn';
            case 'VENCIDO': return 'danger';
            default: return 'secondary';
        }
    }

    onClicAbrirDialogoEliminar(idLiquidacion?: number) {
        if (!idLiquidacion) return;
        this.notificacion.mostrarDialog('¿Eliminar liquidación?', 'La liquidación dejará de aparecer en los listados.', 'warning', '#d33', '#3085d6', 'Sí', 'No').then((r) => {
            if (r.isConfirmed) {
                this.liquidacionService.eliminar({ idLiquidacion }).subscribe({
                    next: (respuesta) => {
                        if (respuesta.error) {
                            return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                        }
                        this.notificacion.mostrarMensaje(1, respuesta.mensaje);
                        this.listar();
                    },
                    error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al eliminar la liquidación.')
                });
            }
        });
    }

    exportar(formato: 'excel' | 'pdf') {
        const descarga$ = formato === 'excel' ? this.reporteService.liquidacionesExcel() : this.reporteService.liquidacionesPdf();
        const nombreArchivo = formato === 'excel' ? 'liquidaciones.xlsx' : 'liquidaciones.pdf';
        descarga$.subscribe({
            next: (blob) => descargarBlob(blob, nombreArchivo),
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al exportar las liquidaciones.')
        });
    }

    openGenerarModal() {
        this.modalRef = this.dialogService.open(GenerarLiquidacionDialog, {
            header: 'GENERAR LIQUIDACIONES',
            width: '480px',
            baseZIndex: 10000,
            closable: true,
            focusOnShow: true,
            draggable: true,
            keepInViewport: true,
            closeOnEscape: false
        });

        this.modalRef?.onClose.subscribe((r: any) => {
            if (r) this.listar();
        });
    }

    openModal(data?: LiquidacionDTO) {
        const titulo = !data ? 'NUEVA LIQUIDACIÓN' : 'EDITAR LIQUIDACIÓN';
        this.modalRef = this.dialogService.open(LiquidacionForm, {
            header: titulo,
            width: '580px',
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
