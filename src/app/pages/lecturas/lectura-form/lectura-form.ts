import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { LecturaMedidorDTO } from '@/app/core/models/lectura-medidor';
import { LecturaMedidorService } from '@/app/core/services/lectura-medidor-service';
import { MedidorService } from '@/app/core/services/medidor-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { fromDateInput, periodoActual, toDateInput } from '@/app/core/utils/date-utils';

@Component({
    selector: 'app-lectura-form',
    templateUrl: './lectura-form.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputGroupModule, InputNumberModule, DatePickerModule, SelectModule, ButtonModule]
})
export class LecturaForm implements OnInit {
    private lecturaService = inject(LecturaMedidorService);
    private medidorService = inject(MedidorService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);

    formGroup!: FormGroup;
    submite = false;
    medidores: { label: string; value: number }[] = [];

    ngOnInit() {
        const data: LecturaMedidorDTO = this.config.data;
        this.formGroup = this.fb.group(
            {
                idLectura: [data?.idLectura ?? null],
                idMedidor: [data?.idMedidor ?? null, Validators.required],
                periodo: [data?.periodo ?? periodoActual(), [Validators.required, Validators.pattern(/^\d{4}-\d{2}$/)]],
                lecturaAnterior: [data?.lecturaAnterior ?? null, [Validators.required, Validators.min(0)]],
                lecturaActual: [data?.lecturaActual ?? null, [Validators.required, Validators.min(0)]],
                fechaLectura: [toDateInput(data?.fechaLectura) ?? new Date(), Validators.required]
            },
            { validators: this.validarMesDeLecturaCoincideConPeriodo }
        );

        this.medidorService.listar().subscribe((r) => {
            this.medidores = (r.data ?? []).map((m) => ({
                label: `${m.numeroSerie} — ${m.tipoServicio} (${m.numeroUnidad ?? 'General'})`,
                value: m.idMedidor!
            }));
        });
    }

    get f() {
        return this.formGroup.controls;
    }

    /**
     * La fecha de lectura tiene que caer dentro del mismo mes que el periodo
     * que se esta reportando (periodo 2026-09 con fecha de lectura en
     * diciembre no tiene sentido); el backend repite esta misma validacion.
     */
    private validarMesDeLecturaCoincideConPeriodo(group: AbstractControl): ValidationErrors | null {
        const periodo: string = group.get('periodo')?.value;
        const fecha: Date = group.get('fechaLectura')?.value;
        if (!periodo || !fecha || !/^\d{4}-\d{2}$/.test(periodo)) return null;

        const periodoDeLaFecha = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        return periodoDeLaFecha === periodo ? null : { mesNoCoincide: true };
    }

    onClickGuardar() {
        if (this.formGroup.valid) {
            const valores = this.formGroup.getRawValue();
            const payload = { ...valores, fechaLectura: fromDateInput(valores.fechaLectura) };

            this.lecturaService.insertarActualizar(payload).subscribe({
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
