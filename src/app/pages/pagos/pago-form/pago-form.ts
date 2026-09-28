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
import { PagoDTO } from '@/app/core/models/pago';
import { PagoService } from '@/app/core/services/pago-service';
import { LiquidacionService } from '@/app/core/services/liquidacion-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { fromDateInput, toDateInput } from '@/app/core/utils/date-utils';

@Component({
    selector: 'app-pago-form',
    templateUrl: './pago-form.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputGroupModule, InputNumberModule, DatePickerModule, SelectModule, ButtonModule]
})
export class PagoForm implements OnInit {
    private pagoService = inject(PagoService);
    private liquidacionService = inject(LiquidacionService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);

    formGroup!: FormGroup;
    submite = false;
    liquidaciones: { label: string; value: number }[] = [];

    metodos = [
        { label: 'Efectivo', value: 'EFECTIVO' },
        { label: 'Transferencia', value: 'TRANSFERENCIA' },
        { label: 'Tarjeta', value: 'TARJETA' }
    ];

    ngOnInit() {
        const data: PagoDTO = this.config.data;
        this.formGroup = this.fb.group({
            idPago: [data?.idPago ?? null],
            idLiquidacion: [data?.idLiquidacion ?? null, Validators.required],
            fechaPago: [toDateInput(data?.fechaPago) ?? new Date(), Validators.required],
            montoPagado: [data?.montoPagado ?? null, [Validators.required, Validators.min(0.01)]],
            metodoPago: [data?.metodoPago ?? 'EFECTIVO', Validators.required],
            numeroVoucher: [data?.numeroVoucher ?? ''],
            rutaEvidencia: [data?.rutaEvidencia ?? '']
        });

        this.liquidacionService.listar().subscribe((r) => {
            this.liquidaciones = (r.data ?? []).map((l) => ({
                label: `${l.numeroUnidad} — ${l.nombreInquilino} — ${l.periodo} (S/ ${l.montoTotal?.toFixed(2)})`,
                value: l.idLiquidacion!
            }));
        });
    }

    get f() {
        return this.formGroup.controls;
    }

    onClickGuardar() {
        if (this.formGroup.valid) {
            const valores = this.formGroup.getRawValue();
            const payload = { ...valores, fechaPago: fromDateInput(valores.fechaPago) };

            this.pagoService.insertarActualizar(payload).subscribe({
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
