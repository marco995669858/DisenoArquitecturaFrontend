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
import { TextareaModule } from 'primeng/textarea';
import { UnidadDTO } from '@/app/core/models/unidad';
import { UnidadService } from '@/app/core/services/unidad-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';

@Component({
    selector: 'app-unidad-form',
    templateUrl: './unidad-form.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputGroupModule, InputNumberModule, SelectModule, TextareaModule, ButtonModule]
})
export class UnidadForm implements OnInit {
    private unidadService = inject(UnidadService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);

    formGroup!: FormGroup;
    submite = false;

    // "Ocupado" no se elige a mano: lo pone y lo quita el sistema segun
    // exista o no un contrato vigente para la unidad (ver ImplContrato).
    // Aca solo se ofrecen los dos estados que sí decide el administrador.
    estados = [
        { label: 'Disponible', value: 'DISPONIBLE' },
        { label: 'Mantenimiento', value: 'MANTENIMIENTO' }
    ];

    ngOnInit() {
        const data: UnidadDTO = this.config.data;
        this.formGroup = this.fb.group({
            idUnidad: [data?.idUnidad ?? null],
            piso: [data?.piso ?? null, [Validators.required, Validators.min(1), Validators.max(10)]],
            numeroUnidad: [data?.numeroUnidad ?? '', [Validators.required, Validators.maxLength(10)]],
            areaM2: [data?.areaM2 ?? null, [Validators.required, Validators.min(40)]],
            caracteristicas: [data?.caracteristicas ?? '', [Validators.maxLength(255)]],
            estado: [data?.estado ?? 'DISPONIBLE', Validators.required]
        });
    }

    get f() {
        return this.formGroup.controls;
    }

    onClickGuardar() {
        if (this.formGroup.valid) {
            this.unidadService.insertarActualizar(this.formGroup.getRawValue()).subscribe({
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
