import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ContratoService } from '@/app/core/services/contrato-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { ContratoDTO } from '@/app/core/models/contrato';
import { fromDateInput } from '@/app/core/utils/date-utils';

/**
 * CU-03b -- Renovar Contrato. A diferencia de editar el contrato existente,
 * esto deja intacto el historial: el contrato actual queda RENOVADO y se crea
 * uno nuevo VIGENTE que retoma desde la fecha de fin anterior (ver
 * ImplContrato.renovarContrato en el backend). El monto de alquiler y la ruta
 * del contrato digital son opcionales -- si se dejan vacios, se heredan del
 * contrato que se renueva.
 */
@Component({
    selector: 'app-renovar-contrato-dialog',
    templateUrl: './renovar-contrato-dialog.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, DatePickerModule, InputNumberModule, ButtonModule]
})
export class RenovarContratoDialog implements OnInit {
    private contratoService = inject(ContratoService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);
    private cdr = inject(ChangeDetectorRef);

    formGroup!: FormGroup;
    submite = false;
    guardando = false;
    contrato!: ContratoDTO;

    ngOnInit() {
        this.contrato = this.config.data;
        this.formGroup = this.fb.group({
            nuevaFechaFin: [null, Validators.required],
            nuevoMontoAlquiler: [null]
        });
    }

    get f() {
        return this.formGroup.controls;
    }

    onClickRenovar() {
        if (this.formGroup.valid) {
            this.guardando = true;
            const valores = this.formGroup.getRawValue();
            this.contratoService
                .renovar({
                    idContrato: this.contrato.idContrato!,
                    nuevaFechaFin: fromDateInput(valores.nuevaFechaFin)!,
                    nuevoMontoAlquiler: valores.nuevoMontoAlquiler
                })
                .subscribe({
                    next: (respuesta) => {
                        this.guardando = false;
                        if (respuesta.error) {
                            this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                            this.cdr.detectChanges();
                            return;
                        }
                        this.notificacion.mostrarMensaje(1, respuesta.mensaje);
                        this.ref.close(true);
                    },
                    error: () => {
                        this.guardando = false;
                        this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al renovar el contrato.');
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
