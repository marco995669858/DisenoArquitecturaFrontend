import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InquilinoService } from '@/app/core/services/inquilino-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { PermisosService } from '@/app/core/services/permisos-service';
import { InquilinoDTO } from '@/app/core/models/inquilino';
import { InquilinoForm } from './inquilino-form/inquilino-form';

@Component({
    selector: 'app-inquilinos',
    templateUrl: './inquilinos.html',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, InputIconModule, IconFieldModule, InputTextModule]
})
export class Inquilinos implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    private inquilinoService = inject(InquilinoService);
    private notificacion = inject(NotificacionService);
    private cdr = inject(ChangeDetectorRef);
    private dialogService = inject(DialogService);
    protected permisosService = inject(PermisosService);

    inquilinos: InquilinoDTO[] = [];
    modalRef: DynamicDialogRef | null = null;

    ngOnInit() {
        this.listar();
    }

    listar() {
        this.inquilinoService.listar().subscribe({
            next: (respuesta) => {
                if (respuesta.error) {
                    return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                }
                this.inquilinos = respuesta.data ?? [];
                this.cdr.detectChanges();
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar los inquilinos.')
        });
    }

    onClicAbrirDialogoEliminar(idInquilino?: number) {
        if (!idInquilino) return;
        this.notificacion.mostrarDialog('¿Eliminar inquilino?', 'El inquilino dejará de aparecer en los listados.', 'warning', '#d33', '#3085d6', 'Sí', 'No').then((r) => {
            if (r.isConfirmed) {
                this.inquilinoService.eliminar({ idInquilino }).subscribe({
                    next: (respuesta) => {
                        if (respuesta.error) {
                            return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                        }
                        this.notificacion.mostrarMensaje(1, respuesta.mensaje);
                        this.listar();
                    },
                    error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al eliminar el inquilino.')
                });
            }
        });
    }

    openModal(data?: InquilinoDTO) {
        const titulo = !data ? 'NUEVO INQUILINO' : 'EDITAR INQUILINO';
        this.modalRef = this.dialogService.open(InquilinoForm, {
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
