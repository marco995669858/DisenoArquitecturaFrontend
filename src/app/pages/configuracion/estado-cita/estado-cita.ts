import { EstadoCitaDTO } from '@/app/core/models/estadoCita';
import { EstadoCitaService } from '@/app/core/services/estado-cita-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { EstadoCitaForm } from './estado-cita-form/estado-cita-form';
import { ColorPickerModule } from 'primeng/colorpicker';

@Component({
    selector: 'app-estado-cita',
    templateUrl: './estado-cita.html',
    styleUrl: './estado-cita.scss',
    standalone: true,
    imports: [ConfirmDialogModule, FormsModule, CommonModule, ReactiveFormsModule, TableModule, InputIconModule, ButtonModule, IconFieldModule, InputTextModule, DialogModule, ToolbarModule, ColorPickerModule]
})
export class EstadoCita implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    private estadoCitaService = inject(EstadoCitaService);
    private notificacion = inject(NotificacionService);
    private cdr = inject(ChangeDetectorRef);
    private fb = inject(FormBuilder);
    private dialogService = inject(DialogService);

    formGroup!: FormGroup;
    estadoCita: EstadoCitaDTO[] = [];
    modalRef: DynamicDialogRef | null = null;

    ngOnInit() {
        this.formGroup = this.fb.group({
            idEstadoCita: [0]
        });

        this.listar();
    }

    get f() {
        return this.formGroup.controls;
    }

    listar() {
        this.estadoCitaService.listar().subscribe({
            next: (respuesta) => {
                if (respuesta.error) {
                    return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                }

                this.estadoCita = respuesta.data ?? [];
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar los datos');
            }
        });
    }

    onClicAbrirDialogoEliminar(idEstadoCita: any) {
        this.notificacion.mostrarDialog('Eliminar el estado de la cita?', 'Se eliminará el estado de la cita.', 'warning', '#d33', '#3085d6', 'Si', 'No').then((r) => {
            if (r.isConfirmed) {
                this.f['idEstadoCita'].setValue(idEstadoCita);
                this.estadoCitaService.eliminar(this.formGroup.getRawValue()).subscribe({
                    next: (respuesta) => {
                        if (respuesta.error || respuesta.data == 2) {
                            return this.notificacion.mostrarMensaje(respuesta.data ?? 0, respuesta.mensaje);
                        }

                        this.notificacion.mostrarMensaje(respuesta.data, respuesta.mensaje);
                        this.listar();
                    },
                    error: (err) => {
                        this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al eliminar el estado de la cita.');
                    }
                });
            }
        });
    }

    openModal(data?: EstadoCitaDTO) {
        let titulo: string = !data ? 'NUEVO ESTADO DE CITA' : 'EDITAR ESTADO DE LA CITA';
        this.modalRef = this.dialogService.open(EstadoCitaForm, {
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
