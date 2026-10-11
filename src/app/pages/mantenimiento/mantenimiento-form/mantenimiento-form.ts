import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MantenimientoDTO } from '@/app/core/models/mantenimiento';
import { MantenimientoService } from '@/app/core/services/mantenimiento-service';
import { UnidadService } from '@/app/core/services/unidad-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { fromDateInput, toDateInput } from '@/app/core/utils/date-utils';

@Component({
    selector: 'app-mantenimiento-form',
    templateUrl: './mantenimiento-form.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputGroupModule, InputNumberModule, DatePickerModule, SelectModule, TextareaModule, CheckboxModule, ButtonModule]
})
export class MantenimientoForm implements OnInit {
    private mantenimientoService = inject(MantenimientoService);
    private unidadService = inject(UnidadService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);

    formGroup!: FormGroup;
    submite = false;
    unidades: { label: string; value: number | null }[] = [{ label: 'Áreas comunes (sin unidad)', value: null }];

    tipos = [
        { label: 'Material', value: 'MATERIAL' },
        { label: 'Mano de obra', value: 'MANO_DE_OBRA' },
        { label: 'Material y mano de obra', value: 'AMBOS' }
    ];

    ngOnInit() {
        const data: MantenimientoDTO = this.config.data;
        this.formGroup = this.fb.group({
            idMantenimiento: [data?.idMantenimiento ?? null],
            idUnidad: [data?.idUnidad ?? null],
            ubicacion: [data?.ubicacion ?? ''],
            descripcion: [data?.descripcion ?? '', [Validators.required, Validators.maxLength(255)]],
            fechaMantenimiento: [toDateInput(data?.fechaMantenimiento) ?? new Date(), Validators.required],
            tipoGasto: [data?.tipoGasto ?? 'MATERIAL', Validators.required],
            proveedor: [data?.proveedor ?? ''],
            montoMateriales: [data?.montoMateriales ?? null],
            montoManoObra: [data?.montoManoObra ?? null],
            imputableInquilino: [data?.imputableInquilino ?? false]
        });

        this.unidadService.listar().subscribe({
            next: (r) => {
                this.unidades = [
                    { label: 'Áreas comunes (sin unidad)', value: null },
                    ...(r.data ?? []).map((u) => ({ label: `${u.numeroUnidad} — Piso ${u.piso}`, value: u.idUnidad! }))
                ];
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar las unidades.')
        });

        this.formGroup.get('tipoGasto')!.valueChanges.subscribe(() => this.actualizarValidadoresMonto());
        this.actualizarValidadoresMonto();
    }

    get f() {
        return this.formGroup.controls;
    }

    get muestraMateriales(): boolean {
        const tipo = this.formGroup?.get('tipoGasto')?.value;
        return tipo === 'MATERIAL' || tipo === 'AMBOS';
    }

    get muestraManoObra(): boolean {
        const tipo = this.formGroup?.get('tipoGasto')?.value;
        return tipo === 'MANO_DE_OBRA' || tipo === 'AMBOS';
    }

    /**
     * El backend recalcula monto = montoMateriales + montoManoObra y exige
     * que sea mayor a cero (chk_mantenimiento_desglose / chk_mantenimiento_monto).
     * El campo que no aplica segun el tipo de gasto se limpia a 0 en vez de
     * dejarlo en null, para no arrastrar un valor que ya no corresponde si
     * el usuario cambia de tipo despues de haber escrito algo.
     */
    private actualizarValidadoresMonto() {
        const materiales = this.formGroup.get('montoMateriales')!;
        const manoObra = this.formGroup.get('montoManoObra')!;

        if (this.muestraMateriales) {
            materiales.setValidators([Validators.required, Validators.min(0.01)]);
        } else {
            materiales.setValue(0, { emitEvent: false });
            materiales.clearValidators();
        }

        if (this.muestraManoObra) {
            manoObra.setValidators([Validators.required, Validators.min(0.01)]);
        } else {
            manoObra.setValue(0, { emitEvent: false });
            manoObra.clearValidators();
        }

        materiales.updateValueAndValidity({ emitEvent: false });
        manoObra.updateValueAndValidity({ emitEvent: false });
    }

    onClickGuardar() {
        if (this.formGroup.valid) {
            const valores = this.formGroup.getRawValue();
            const payload = { ...valores, fechaMantenimiento: fromDateInput(valores.fechaMantenimiento) };

            this.mantenimientoService.insertarActualizar(payload).subscribe({
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
