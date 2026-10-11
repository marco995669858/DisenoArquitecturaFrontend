import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MedidorDTO } from '@/app/core/models/medidor';
import { MedidorService } from '@/app/core/services/medidor-service';
import { UnidadService } from '@/app/core/services/unidad-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';

@Component({
    selector: 'app-medidor-form',
    templateUrl: './medidor-form.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputGroupModule, SelectModule, ButtonModule]
})
export class MedidorForm implements OnInit {
    private medidorService = inject(MedidorService);
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

    tipos = [
        { label: 'Individual (de una unidad)', value: 'INDIVIDUAL' },
        { label: 'General (áreas comunes)', value: 'GENERAL' }
    ];

    ngOnInit() {
        const data: MedidorDTO = this.config.data;
        this.formGroup = this.fb.group({
            idMedidor: [data?.idMedidor ?? null],
            idUnidad: [data?.idUnidad ?? null],
            tipoServicio: [data?.tipoServicio ?? 'LUZ', Validators.required],
            tipoMedidor: [data?.tipoMedidor ?? 'INDIVIDUAL', Validators.required],
            numeroSerie: [data?.numeroSerie ?? '', [Validators.required, Validators.maxLength(50)]]
        });

        this.unidadService.listar().subscribe({
            next: (r) => {
                this.unidades = (r.data ?? []).map((u) => ({ label: `${u.numeroUnidad} — Piso ${u.piso}`, value: u.idUnidad! }));
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar las unidades.')
        });

        this.formGroup.get('tipoMedidor')!.valueChanges.subscribe((tipo) => {
            if (tipo === 'GENERAL') {
                this.formGroup.get('idUnidad')!.setValue(null);
                this.formGroup.get('idUnidad')!.disable();
            } else {
                this.formGroup.get('idUnidad')!.enable();
            }
        });

        if (this.formGroup.get('tipoMedidor')!.value === 'GENERAL') {
            this.formGroup.get('idUnidad')!.disable();
        }
    }

    get f() {
        return this.formGroup.controls;
    }

    onClickGuardar() {
        if (this.formGroup.valid) {
            this.medidorService.insertarActualizar(this.formGroup.getRawValue()).subscribe({
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
