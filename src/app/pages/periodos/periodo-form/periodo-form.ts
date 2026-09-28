import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PeriodoFacturacionDTO } from '@/app/core/models/periodo-facturacion';
import { PeriodoFacturacionService } from '@/app/core/services/periodo-facturacion-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { periodoActual } from '@/app/core/utils/date-utils';

@Component({
    selector: 'app-periodo-form',
    templateUrl: './periodo-form.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputGroupModule, SelectModule, ButtonModule]
})
export class PeriodoForm implements OnInit {
    private periodoService = inject(PeriodoFacturacionService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);

    formGroup!: FormGroup;
    submite = false;

    estados = [
        { label: 'En progreso', value: 'EN_PROGRESO' },
        { label: 'Completo', value: 'COMPLETO' },
        { label: 'Liquidado', value: 'LIQUIDADO' }
    ];

    ngOnInit() {
        const data: PeriodoFacturacionDTO = this.config.data;
        this.formGroup = this.fb.group({
            idPeriodo: [data?.idPeriodo ?? null],
            periodo: [data?.periodo ?? periodoActual(), [Validators.required, Validators.pattern(/^\d{4}-\d{2}$/)]],
            estado: [data?.estado ?? 'EN_PROGRESO', Validators.required]
        });
    }

    get f() {
        return this.formGroup.controls;
    }

    onClickGuardar() {
        if (this.formGroup.valid) {
            this.periodoService.insertarActualizar(this.formGroup.getRawValue()).subscribe({
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
