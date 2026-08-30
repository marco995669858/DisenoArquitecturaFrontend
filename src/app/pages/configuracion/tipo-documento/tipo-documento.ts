import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TipoDocumentoForm } from './tipo-documento-form/tipo-documento-form';
import { TipoDocumentoDTO } from '@/app/core/models/tipoDocumento';
import { TipoDocumentoService } from '@/app/core/services/tipo-documento-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-tipo-documento',
    templateUrl: './tipo-documento.html',
    styleUrl: './tipo-documento.scss',
    standalone: true,
    imports: [ConfirmDialogModule, FormsModule, CommonModule, ReactiveFormsModule, TableModule, InputIconModule, ButtonModule, IconFieldModule, InputTextModule, DialogModule, ToolbarModule, ColorPickerModule]
})
export class TipoDocumento implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    private tipoDocumentoService = inject(TipoDocumentoService);
    private notificacion = inject(NotificacionService);
    private cdr = inject(ChangeDetectorRef);
    private fb = inject(FormBuilder);
    private dialogService = inject(DialogService);

    formGroup!: FormGroup;
    tipoDocumento: TipoDocumentoDTO[] = [];
    modalRef: DynamicDialogRef | null = null;

    ngOnInit() {
        this.formGroup = this.fb.group({
            idTipoDocumento: [0]
        });

        this.listar();
    }

    get f() {
        return this.formGroup.controls;
    }

    listar() {
        this.tipoDocumentoService.listar().subscribe({
            next: (respuesta) => {
                if (respuesta.error) {
                    return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                }

                this.tipoDocumento = respuesta.data ?? [];
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar los datos');
            }
        });
    }

    onClicAbrirDialogoEliminar(idEstadoCita: any) {
        this.notificacion.mostrarDialog('Eliminar el tipo de documento?', 'Se eliminará el tipo de documento.', 'warning', '#d33', '#3085d6', 'Si', 'No').then((r) => {
            if (r.isConfirmed) {
                this.f['idTipoDocumento'].setValue(idEstadoCita);
                this.tipoDocumentoService.eliminar(this.formGroup.getRawValue()).subscribe({
                    next: (respuesta) => {
                        if (respuesta.error || respuesta.data == 2) {
                            return this.notificacion.mostrarMensaje(respuesta.data ?? 0, respuesta.mensaje);
                        }

                        this.notificacion.mostrarMensaje(respuesta.data, respuesta.mensaje);
                        this.listar();
                    },
                    error: (err) => {
                        this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al eliminar el tipo de documento.');
                    }
                });
            }
        });
    }

    openModal(data?: TipoDocumentoDTO) {
        let titulo: string = !data ? 'NUEVO TIPO DE DOOCUMENTO' : 'EDITAR TIPO DE DOCUMENTO';
        this.modalRef = this.dialogService.open(TipoDocumentoForm, {
            header: titulo,
            width: '500px',
            baseZIndex: 10000,
            closable: true,
            focusOnShow: true,
            draggable: true,
            keepInViewport: true,
            closeOnEscape: false,
            data: data
        });

        this.modalRef?.onClose.subscribe((r: any) => {
            if (r) {
                this.listar();
            }
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
