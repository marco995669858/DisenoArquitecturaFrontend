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
import { InputTextModule } from 'primeng/inputtext';
import { LiquidacionDTO } from '@/app/core/models/liquidacion';
import { LiquidacionService } from '@/app/core/services/liquidacion-service';
import { ContratoService } from '@/app/core/services/contrato-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { fromDateInput, periodoActual, toDateInput } from '@/app/core/utils/date-utils';

@Component({
    selector: 'app-liquidacion-form',
    templateUrl: './liquidacion-form.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputGroupModule, InputNumberModule, DatePickerModule, SelectModule, ButtonModule]
})
export class LiquidacionForm implements OnInit {
    private liquidacionService = inject(LiquidacionService);
    private contratoService = inject(ContratoService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);

    formGroup!: FormGroup;
    submite = false;
    contratos: { label: string; value: number }[] = [];

    estados = [
        { label: 'Pendiente', value: 'PENDIENTE' },
        { label: 'Parcial', value: 'PARCIAL' },
        { label: 'Pagado', value: 'PAGADO' },
        { label: 'Vencido', value: 'VENCIDO' }
    ];

    ngOnInit() {
        const data: LiquidacionDTO = this.config.data;
        this.formGroup = this.fb.group({
            idLiquidacion: [data?.idLiquidacion ?? null],
            idContrato: [data?.idContrato ?? null, Validators.required],
            periodo: [data?.periodo ?? periodoActual(), [Validators.required, Validators.pattern(/^\d{4}-\d{2}$/)]],
            montoAlquiler: [data?.montoAlquiler ?? 0, [Validators.min(0)]],
            montoLuz: [data?.montoLuz ?? 0, [Validators.min(0)]],
            montoAgua: [data?.montoAgua ?? 0, [Validators.min(0)]],
            montoOtros: [data?.montoOtros ?? 0, [Validators.min(0)]],
            fechaEmision: [toDateInput(data?.fechaEmision) ?? new Date(), Validators.required],
            fechaVencimiento: [toDateInput(data?.fechaVencimiento), Validators.required],
            estado: [data?.estado ?? 'PENDIENTE', Validators.required]
        });

        this.contratoService.listar().subscribe({
            next: (r) => {
                this.contratos = (r.data ?? []).map((c) => ({ label: `${c.numeroUnidad} — ${c.nombreInquilino}`, value: c.idContrato! }));
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar los contratos.')
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

            this.liquidacionService.insertarActualizar(payload).subscribe({
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
