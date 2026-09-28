import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ProrrateoDTO } from '@/app/core/models/prorrateo';
import { ProrrateoService } from '@/app/core/services/prorrateo-service';
import { UnidadService } from '@/app/core/services/unidad-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { periodoActual } from '@/app/core/utils/date-utils';

@Component({
    selector: 'app-prorrateo-form',
    templateUrl: './prorrateo-form.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputGroupModule, InputNumberModule, SelectModule, ButtonModule]
})
export class ProrrateoForm implements OnInit {
    private prorrateoService = inject(ProrrateoService);
    private unidadService = inject(UnidadService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);

    formGroup!: FormGroup;
    submite = false;
    unidades: { label: string; value: number }[] = [];

    servicios = [
        { label: 'Luz', value: 'LUZ' },
        { label: 'Agua', value: 'AGUA' }
    ];

    ngOnInit() {
        const data: ProrrateoDTO = this.config.data;
        this.formGroup = this.fb.group({
            idProrrateo: [data?.idProrrateo ?? null],
            idUnidad: [data?.idUnidad ?? null, Validators.required],
            periodo: [data?.periodo ?? periodoActual(), [Validators.required, Validators.pattern(/^\d{4}-\d{2}$/)]],
            tipoServicio: [data?.tipoServicio ?? 'LUZ', Validators.required],
            consumoIndividual: [data?.consumoIndividual ?? null, [Validators.required, Validators.min(0)]],
            consumoComunAsignado: [data?.consumoComunAsignado ?? 0, [Validators.min(0)]],
            costoUnitario: [data?.costoUnitario ?? null, [Validators.required, Validators.min(0)]],
            montoCalculado: [data?.montoCalculado ?? null, [Validators.required, Validators.min(0)]]
        });

        this.unidadService.listar().subscribe((r) => {
            this.unidades = (r.data ?? []).map((u) => ({ label: `${u.numeroUnidad} — Piso ${u.piso}`, value: u.idUnidad! }));
        });

        ['consumoIndividual', 'consumoComunAsignado', 'costoUnitario'].forEach((campo) => {
            this.formGroup.get(campo)!.valueChanges.subscribe(() => this.recalcularMonto());
        });
    }

    private recalcularMonto() {
        const { consumoIndividual, consumoComunAsignado, costoUnitario } = this.formGroup.getRawValue();
        if (consumoIndividual != null && costoUnitario != null) {
            const monto = (Number(consumoIndividual) + Number(consumoComunAsignado ?? 0)) * Number(costoUnitario);
            this.formGroup.get('montoCalculado')!.setValue(Math.round(monto * 100) / 100, { emitEvent: false });
        }
    }

    get f() {
        return this.formGroup.controls;
    }

    onClickGuardar() {
        if (this.formGroup.valid) {
            this.prorrateoService.insertarActualizar(this.formGroup.getRawValue()).subscribe({
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
