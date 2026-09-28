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
import { PeriodoFacturacionService } from '@/app/core/services/periodo-facturacion-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { PermisosService } from '@/app/core/services/permisos-service';
import { PeriodoFacturacionDTO } from '@/app/core/models/periodo-facturacion';
import { PeriodoForm } from './periodo-form/periodo-form';

@Component({
    selector: 'app-periodos',
    templateUrl: './periodos.html',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, TagModule, InputIconModule, IconFieldModule, InputTextModule]
})
export class Periodos implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    private periodoService = inject(PeriodoFacturacionService);
    private notificacion = inject(NotificacionService);
    private cdr = inject(ChangeDetectorRef);
    private dialogService = inject(DialogService);
    protected permisosService = inject(PermisosService);

    periodos: PeriodoFacturacionDTO[] = [];
    modalRef: DynamicDialogRef | null = null;

    ngOnInit() {
        this.listar();
    }

    listar() {
        this.periodoService.listar().subscribe({
            next: (respuesta) => {
                if (respuesta.error) {
                    return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                }
                this.periodos = respuesta.data ?? [];
                this.cdr.detectChanges();
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar los periodos.')
        });
    }

    severidadEstado(estado?: string) {
        switch (estado) {
            case 'LIQUIDADO': return 'success';
            case 'COMPLETO': return 'info';
            case 'EN_PROGRESO': return 'warn';
            default: return 'secondary';
        }
    }

    // No hay borrado: un periodo solo se puede editar (por ejemplo, para
    // forzar su estado a mano); se crea solo cuando algo lo referencia.
    openModal(data?: PeriodoFacturacionDTO) {
        const titulo = !data ? 'NUEVO PERIODO' : 'EDITAR PERIODO';
        this.modalRef = this.dialogService.open(PeriodoForm, {
            header: titulo,
            width: '440px',
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
