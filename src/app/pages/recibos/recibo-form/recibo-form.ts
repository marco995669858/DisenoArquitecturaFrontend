import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ReciboServicioDTO } from '@/app/core/models/recibo-servicio';
import { ReciboServicioService } from '@/app/core/services/recibo-servicio-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { fromDateInput, periodoActual, toDateInput } from '@/app/core/utils/date-utils';

@Component({
    selector: 'app-recibo-form',
    templateUrl: './recibo-form.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputGroupModule, InputNumberModule, DatePickerModule, SelectModule, ButtonModule]
})
export class ReciboForm implements OnInit {
    private reciboService = inject(ReciboServicioService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);

    formGroup!: FormGroup;
    submite = false;

    servicios = [
        { label: 'Luz', value: 'LUZ' },
        { label: 'Agua', value: 'AGUA' }
    ];

    ngOnInit() {
        const data: ReciboServicioDTO = this.config.data;
        this.formGroup = this.fb.group({
            idRecibo: [data?.idRecibo ?? null],
            periodo: [data?.periodo ?? periodoActual(), [Validators.required, Validators.pattern(/^\d{4}-\d{2}$/)]],
            tipoServicio: [data?.tipoServicio ?? 'LUZ', Validators.required],
            montoTotal: [data?.montoTotal ?? null, [Validators.required, Validators.min(0.01)]],
            fechaEmision: [toDateInput(data?.fechaEmision) ?? new Date(), Validators.required],
            fechaVencimiento: [toDateInput(data?.fechaVencimiento)],
            rutaDocumento: [data?.rutaDocumento ?? '']
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
                fechaEmision: fromDateInput(valores.fechaEmision),
                fechaVencimiento: fromDateInput(valores.fechaVencimiento)
            };

            this.reciboService.insertarActualizar(payload).subscribe({
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
