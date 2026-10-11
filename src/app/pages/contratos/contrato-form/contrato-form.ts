import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ContratoDTO } from '@/app/core/models/contrato';
import { ContratoService } from '@/app/core/services/contrato-service';
import { UnidadService } from '@/app/core/services/unidad-service';
import { InquilinoService } from '@/app/core/services/inquilino-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { fromDateInput, toDateInput } from '@/app/core/utils/date-utils';

@Component({
    selector: 'app-contrato-form',
    templateUrl: './contrato-form.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputGroupModule, InputNumberModule, DatePickerModule, SelectModule, ButtonModule]
})
export class ContratoForm implements OnInit {
    private contratoService = inject(ContratoService);
    private unidadService = inject(UnidadService);
    private inquilinoService = inject(InquilinoService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);

    formGroup!: FormGroup;
    submite = false;

    unidades: { label: string; value: number }[] = [];
    inquilinos: { label: string; value: number }[] = [];

    estados = [
        { label: 'Vigente', value: 'VIGENTE' },
        { label: 'Renovado', value: 'RENOVADO' },
        { label: 'Finalizado', value: 'FINALIZADO' },
        { label: 'Vencido', value: 'VENCIDO' }
    ];

    ngOnInit() {
        const data: ContratoDTO = this.config.data;
        this.formGroup = this.fb.group({
            idContrato: [data?.idContrato ?? null],
            idUnidad: [data?.idUnidad ?? null, Validators.required],
            idInquilino: [data?.idInquilino ?? null, Validators.required],
            fechaInicio: [toDateInput(data?.fechaInicio), Validators.required],
            fechaFin: [toDateInput(data?.fechaFin), Validators.required],
            montoAlquiler: [data?.montoAlquiler ?? null, [Validators.required, Validators.min(0.01)]],
            rutaContratoDigital: [data?.rutaContratoDigital ?? ''],
            estado: [data?.estado ?? 'VIGENTE', Validators.required]
        });

        // Una unidad OCUPADO ya tiene un contrato vigente (unidad.estado se
        // sincroniza solo con eso, ver ImplContrato); no tiene sentido
        // ofrecerla para un contrato nuevo. Al editar, la unidad que ya
        // tiene ESTE contrato se deja ver igual, aunque figure OCUPADO,
        // porque es precisamente la que el contrato ocupa.
        const idUnidadActual = data?.idUnidad;
        this.unidadService.listar().subscribe({
            next: (r) => {
                this.unidades = (r.data ?? [])
                    .filter((u) => u.estado !== 'OCUPADO' || u.idUnidad === idUnidadActual)
                    .map((u) => ({ label: `${u.numeroUnidad} — Piso ${u.piso}`, value: u.idUnidad! }));
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar las unidades.')
        });

        this.inquilinoService.listar().subscribe({
            next: (r) => {
                this.inquilinos = (r.data ?? []).map((i) => ({ label: `${i.nombreCompleto} (${i.numeroDocumento})`, value: i.idInquilino! }));
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar los inquilinos.')
        });
    }

    get f() {
        return this.formGroup.controls;
    }

    onClickGuardar() {
        if (this.formGroup.valid) {
            const valores = this.formGroup.getRawValue();
            const payload = {
                ...valores,
                fechaInicio: fromDateInput(valores.fechaInicio),
                fechaFin: fromDateInput(valores.fechaFin)
            };

            this.contratoService.insertarActualizar(payload).subscribe({
                next: (respuesta) => {
                    if (respuesta.error) {
                        return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                    }
                    this.notificacion.mostrarMensaje(1, respuesta.mensaje);
                    this.cerrarModal();
                },
                error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al procesar su solicitud.')
            });
        } else {
            this.submite = true;
            setTimeout(() => (this.submite = false), 9000);
        }
    }

    cerrarModal() {
        this.ref.close(true);
    }
}
