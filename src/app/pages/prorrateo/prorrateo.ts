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
import { ProrrateoService } from '@/app/core/services/prorrateo-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { PermisosService } from '@/app/core/services/permisos-service';
import { ProrrateoDTO } from '@/app/core/models/prorrateo';
import { ProrrateoForm } from './prorrateo-form/prorrateo-form';
import { CalcularProrrateoDialog } from './calcular-prorrateo-dialog/calcular-prorrateo-dialog';

@Component({
    selector: 'app-prorrateo',
    templateUrl: './prorrateo.html',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, TagModule, InputIconModule, IconFieldModule, InputTextModule]
})
export class Prorrateo implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    private prorrateoService = inject(ProrrateoService);
    private notificacion = inject(NotificacionService);
    private cdr = inject(ChangeDetectorRef);
    private dialogService = inject(DialogService);
    protected permisosService = inject(PermisosService);

    prorrateos: ProrrateoDTO[] = [];
    modalRef: DynamicDialogRef | null = null;

    ngOnInit() {
        this.listar();
    }

    listar() {
        this.prorrateoService.listar().subscribe({
            next: (respuesta) => {
                if (respuesta.error) {
                    return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                }
                this.prorrateos = respuesta.data ?? [];
                this.cdr.detectChanges();
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar el prorrateo.')
        });
    }

    onClicAbrirDialogoEliminar(idProrrateo?: number) {
        if (!idProrrateo) return;
        this.notificacion.mostrarDialog('¿Eliminar prorrateo?', 'El registro dejará de aparecer en los listados.', 'warning', '#d33', '#3085d6', 'Sí', 'No').then((r) => {
            if (r.isConfirmed) {
                this.prorrateoService.eliminar({ idProrrateo }).subscribe({
                    next: (respuesta) => {
                        if (respuesta.error) {
                            return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                        }
                        this.notificacion.mostrarMensaje(1, respuesta.mensaje);
                        this.listar();
                    },
                    error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al eliminar el prorrateo.')
                });
            }
        });
    }

    openCalcularModal() {
        this.modalRef = this.dialogService.open(CalcularProrrateoDialog, {
            header: 'CALCULAR PRORRATEO',
            width: '460px',
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

    openModal(data?: ProrrateoDTO) {
        const titulo = !data ? 'NUEVO PRORRATEO' : 'EDITAR PRORRATEO';
        this.modalRef = this.dialogService.open(ProrrateoForm, {
            header: titulo,
            width: '540px',
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
