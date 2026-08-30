import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { EspecialidadService } from '../../../core/services/especialidad-service';
import { NotificacionService } from '../../../core/services/notificacion-service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EspecialidadForm } from './especialidad-form/especialidad-form';
import { EspecialidadDTO } from '@/app/core/models/especialidad';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-especialidad',
    templateUrl: './especialidad.html',
    styleUrl: './especialidad.scss',
    standalone: true,
    imports: [ConfirmDialogModule, FormsModule, CommonModule, ReactiveFormsModule, TableModule, InputIconModule, ButtonModule, IconFieldModule, InputTextModule, DialogModule, ToolbarModule]
})
export class Especialidad implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    private especialidadService = inject(EspecialidadService);
    private notificacion = inject(NotificacionService);
    private cdr = inject(ChangeDetectorRef);
    private fb = inject(FormBuilder);
    private dialogService = inject(DialogService);

    formGroup!: FormGroup;
    especialidades: EspecialidadDTO[] = [];
    modalRef: DynamicDialogRef | null = null;

    ngOnInit() {
        this.formGroup = this.fb.group({
            idEspecialidad: [0]
        });

        this.listar();
    }

    get f() {
        return this.formGroup.controls;
    }

    listar() {
        this.especialidadService.listar().subscribe({
            next: (respuesta) => {
                if (respuesta.error) {
                    return this.notificacion.mostrarMensaje(0,respuesta.mensaje);
                }

                this.especialidades = respuesta.data ?? [];
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar los datos');
            }
        });
    }

    onClicAbrirDialogoEliminar(idEspecialidad: any) {
        this.notificacion.mostrarDialog('Eliminar especialidad?', 'Se eliminará la especialidad.', 'warning', '#d33', '#3085d6', 'Si', 'No').then((r) => {
            if (r.isConfirmed) {
                this.f['idEspecialidad'].setValue(idEspecialidad);
                this.especialidadService.eliminar(this.formGroup.getRawValue()).subscribe({
                    next: (respuesta) => {
                        if (respuesta.error || respuesta.data == 2) {
                            return this.notificacion.mostrarMensaje(respuesta.data ?? 0, respuesta.mensaje);
                        }

                        this.notificacion.mostrarMensaje(respuesta.data, respuesta.mensaje);
                        this.listar();
                    },
                    error: (err) => {
                        this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al eliminar la especialidad.');
                    }
                });
            }
        });
    }

    openModal(data?: EspecialidadDTO) {
        let titulo: string = !data ? 'NUEVA ESPECIALIDAD' : 'EDITAR ESPECIALIDAD';
        this.modalRef = this.dialogService.open(EspecialidadForm, {
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
            if(r){
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
