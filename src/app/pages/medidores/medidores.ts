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
import { MedidorService } from '@/app/core/services/medidor-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { PermisosService } from '@/app/core/services/permisos-service';
import { MedidorDTO } from '@/app/core/models/medidor';
import { MedidorForm } from './medidor-form/medidor-form';

@Component({
    selector: 'app-medidores',
    templateUrl: './medidores.html',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, TagModule, InputIconModule, IconFieldModule, InputTextModule]
})
export class Medidores implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    private medidorService = inject(MedidorService);
    private notificacion = inject(NotificacionService);
    private cdr = inject(ChangeDetectorRef);
    private dialogService = inject(DialogService);
    protected permisosService = inject(PermisosService);

    medidores: MedidorDTO[] = [];
    modalRef: DynamicDialogRef | null = null;

    ngOnInit() {
        this.listar();
    }

    listar() {
        this.medidorService.listar().subscribe({
            next: (respuesta) => {
                if (respuesta.error) {
                    return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                }
                this.medidores = respuesta.data ?? [];
                this.cdr.detectChanges();
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar los medidores.')
        });
    }

    onClicAbrirDialogoEliminar(idMedidor?: number) {
        if (!idMedidor) return;
        this.notificacion.mostrarDialog('¿Eliminar medidor?', 'El medidor dejará de aparecer en los listados.', 'warning', '#d33', '#3085d6', 'Sí', 'No').then((r) => {
            if (r.isConfirmed) {
                this.medidorService.eliminar({ idMedidor }).subscribe({
                    next: (respuesta) => {
                        if (respuesta.error) {
                            return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                        }
                        this.notificacion.mostrarMensaje(1, respuesta.mensaje);
                        this.listar();
                    },
                    error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al eliminar el medidor.')
                });
            }
        });
    }

    openModal(data?: MedidorDTO) {
        const titulo = !data ? 'NUEVO MEDIDOR' : 'EDITAR MEDIDOR';
        this.modalRef = this.dialogService.open(MedidorForm, {
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
