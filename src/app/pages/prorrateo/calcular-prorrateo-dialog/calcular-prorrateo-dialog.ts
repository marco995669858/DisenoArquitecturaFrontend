import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ProrrateoService } from '@/app/core/services/prorrateo-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { periodoActual } from '@/app/core/utils/date-utils';

/**
 * CU-05 -- Calcular Prorrateo. A diferencia de los demas modales de esta
 * pantalla, este no crea un registro con datos que el usuario llena a mano:
 * dispara el calculo automatico (lee lecturas, recibo del servicio y el
 * criterio configurado) para un periodo y servicio, y el backend hace el
 * resto.
 */
@Component({
    selector: 'app-calcular-prorrateo-dialog',
    templateUrl: './calcular-prorrateo-dialog.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, SelectModule, ButtonModule]
})
export class CalcularProrrateoDialog implements OnInit {
    private prorrateoService = inject(ProrrateoService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private fb = inject(FormBuilder);
    private cdr = inject(ChangeDetectorRef);

    formGroup!: FormGroup;
    submite = false;
    calculando = false;

    servicios = [
        { label: 'Luz', value: 'LUZ' },
        { label: 'Agua', value: 'AGUA' }
    ];

    ngOnInit() {
        this.formGroup = this.fb.group({
            periodo: [periodoActual(), [Validators.required, Validators.pattern(/^\d{4}-\d{2}$/)]],
            tipoServicio: ['LUZ', Validators.required]
        });
    }

    get f() {
        return this.formGroup.controls;
    }

    onClickCalcular() {
        if (this.formGroup.valid) {
            this.calculando = true;
            this.prorrateoService.calcular(this.formGroup.getRawValue()).subscribe({
                next: (respuesta) => {
                    this.calculando = false;
                    if (respuesta.error) {
                        this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                        this.cdr.detectChanges();
                        return;
                    }
                    this.notificacion.mostrarMensaje(1, respuesta.mensaje);
                    this.ref.close(true);
                },
                error: () => {
                    this.calculando = false;
                    this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al calcular el prorrateo.');
                    this.cdr.detectChanges();
                }
            });
        } else {
            this.submite = true;
            setTimeout(() => (this.submite = false), 9000);
        }
    }

    cerrarModal() {
        this.ref.close(false);
    }
}
