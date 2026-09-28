import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ContratoService } from '@/app/core/services/contrato-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { PermisosService } from '@/app/core/services/permisos-service';
import { ContratoDTO } from '@/app/core/models/contrato';
import { ContratoForm } from './contrato-form/contrato-form';
import { RenovarContratoDialog } from './renovar-contrato-dialog/renovar-contrato-dialog';

@Component({
    selector: 'app-contratos',
    templateUrl: './contratos.html',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, TagModule, TooltipModule, InputIconModule, IconFieldModule, InputTextModule]
})
export class Contratos implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    private contratoService = inject(ContratoService);
    private notificacion = inject(NotificacionService);
    private cdr = inject(ChangeDetectorRef);
    private dialogService = inject(DialogService);
    protected permisosService = inject(PermisosService);

    contratos: ContratoDTO[] = [];
    modalRef: DynamicDialogRef | null = null;

    ngOnInit() {
        this.listar();
    }

    listar() {
        this.contratoService.listar().subscribe({
            next: (respuesta) => {
                if (respuesta.error) {
                    return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                }
                this.contratos = respuesta.data ?? [];
                this.cdr.detectChanges();
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar los contratos.')
        });
    }

    severidadEstado(estado?: string) {
        switch (estado) {
            case 'VIGENTE': return 'success';
            case 'RENOVADO': return 'info';
            case 'VENCIDO': return 'danger';
            default: return 'secondary';
        }
    }

    puedeRenovar(contrato: ContratoDTO) {
        return contrato.estado === 'VIGENTE' || contrato.estado === 'VENCIDO';
    }

    openRenovarModal(contrato: ContratoDTO) {
        this.modalRef = this.dialogService.open(RenovarContratoDialog, {
            header: 'RENOVAR CONTRATO',
            width: '480px',
            baseZIndex: 10000,
            closable: true,
            focusOnShow: true,
            draggable: true,
            keepInViewport: true,
            closeOnEscape: false,
            data: contrato
        });

        this.modalRef?.onClose.subscribe((r: any) => {
            if (r) this.listar();
        });
    }

    onClicAbrirDialogoEliminar(idContrato?: number) {
        if (!idContrato) return;
        this.notificacion.mostrarDialog('¿Eliminar contrato?', 'El contrato dejará de aparecer en los listados.', 'warning', '#d33', '#3085d6', 'Sí', 'No').then((r) => {
            if (r.isConfirmed) {
                this.contratoService.eliminar({ idContrato }).subscribe({
                    next: (respuesta) => {
                        if (respuesta.error) {
                            return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                        }
                        this.notificacion.mostrarMensaje(1, respuesta.mensaje);
                        this.listar();
                    },
                    error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al eliminar el contrato.')
                });
            }
        });
    }

    openModal(data?: ContratoDTO) {
        const titulo = !data ? 'NUEVO CONTRATO' : 'EDITAR CONTRATO';
        this.modalRef = this.dialogService.open(ContratoForm, {
            header: titulo,
            width: '560px',
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
