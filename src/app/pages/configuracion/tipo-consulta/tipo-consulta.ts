import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { TipoConsultaForm } from './tipo-consulta-form/tipo-consulta-form';
import { TipoConsultaDTO } from '@/app/core/models/tipoConsulta';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { TipoConsultaService } from '@/app/core/services/tipo-consulta-service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-tipo-consulta',
    templateUrl: './tipo-consulta.html',
    styleUrl: './tipo-consulta.scss',
    standalone: true,
    imports: [ConfirmDialogModule, FormsModule, CommonModule, ReactiveFormsModule, TableModule, InputIconModule, ButtonModule, IconFieldModule, InputTextModule, DialogModule, ToolbarModule, ColorPickerModule]
})
export class TipoConsulta implements OnInit {

    @ViewChild('filter') filter!: ElementRef;

    private tipoConsultaService = inject(TipoConsultaService);
    private notificacion = inject(NotificacionService);
    private cdr = inject(ChangeDetectorRef);
    private fb = inject(FormBuilder);
    private dialogService = inject(DialogService);

    formGroup!: FormGroup;
    tipoConsulta: TipoConsultaDTO[] = [];
    modalRef: DynamicDialogRef | null = null;

    ngOnInit() {
        this.formGroup = this.fb.group({
            idTipoConsulta: [0]
        });

        this.listar();
    }

    get f() {
        return this.formGroup.controls;
    }

    listar() {
        this.tipoConsultaService.listar().subscribe({
            next: (respuesta) => {
                if (respuesta.error) {
                    return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                }

                this.tipoConsulta = respuesta.data ?? [];
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar los datos');
            }
        });
    }

    onClicAbrirDialogoEliminar(idTipoConsulta: any) {
        this.notificacion.mostrarDialog('Eliminar el tipo de consulta?', 'Se eliminará el tipo de consulta.', 'warning', '#d33', '#3085d6', 'Si', 'No').then((r) => {
            if (r.isConfirmed) {
                this.f['idTipoConsulta'].setValue(idTipoConsulta);
                this.tipoConsultaService.eliminar(this.formGroup.getRawValue()).subscribe({
                    next: (respuesta) => {
                        if (respuesta.error || respuesta.data == 2) {
                            return this.notificacion.mostrarMensaje(respuesta.data ?? 0, respuesta.mensaje);
                        }

                        this.notificacion.mostrarMensaje(respuesta.data, respuesta.mensaje);
                        this.listar();
                    },
                    error: (err) => {
                        this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al eliminar el tipo de consulta.');
                    }
                });
            }
        });
    }

    openModal(data?: TipoConsultaDTO) {
        let titulo: string = !data ? 'NUEVO TIPO DE CONSULTA' : 'EDITAR TIPO DE CONSULTA';
        this.modalRef = this.dialogService.open(TipoConsultaForm, {
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
