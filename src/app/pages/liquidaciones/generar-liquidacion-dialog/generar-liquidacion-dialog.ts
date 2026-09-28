import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import Swal from 'sweetalert2';
import { LiquidacionService } from '@/app/core/services/liquidacion-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { periodoActual } from '@/app/core/utils/date-utils';

/**
 * CU-06 -- Generar Liquidacion. Emite de una vez la liquidacion de todas las
 * unidades con contrato vigente para el periodo indicado (incluye el
 * prorrateo de luz y agua, RN-04 y FA-01 -- ver ImplLiquidacion en el
 * backend). El resultado trae listas separadas de lo generado, lo omitido
 * y las excepciones, asi que se resume en un dialogo en vez de un toast.
 */
@Component({
    selector: 'app-generar-liquidacion-dialog',
    templateUrl: './generar-liquidacion-dialog.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, ButtonModule]
})
export class GenerarLiquidacionDialog implements OnInit {
    private liquidacionService = inject(LiquidacionService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private fb = inject(FormBuilder);
    private cdr = inject(ChangeDetectorRef);

    formGroup!: FormGroup;
    submite = false;
    generando = false;

    ngOnInit() {
        this.formGroup = this.fb.group({
            periodo: [periodoActual(), [Validators.required, Validators.pattern(/^\d{4}-\d{2}$/)]]
        });
    }

    get f() {
        return this.formGroup.controls;
    }

    onClickGenerar() {
        if (this.formGroup.valid) {
            this.generando = true;
            this.liquidacionService.generar(this.formGroup.getRawValue()).subscribe({
                next: (respuesta) => {
                    this.generando = false;
                    if (respuesta.error) {
                        this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                        this.cdr.detectChanges();
                        return;
                    }
                    // Se cierra el dialogo de PrimeNG (baseZIndex 10000) ANTES de
                    // mostrar el SweetAlert: si el dialogo sigue abierto, el popup
                    // de SweetAlert queda apilado detras de el (su propio z-index
                    // por defecto es menor).
                    this.ref.close(true);
                    this.mostrarResumen(respuesta.mensaje, respuesta.data);
                },
                error: () => {
                    this.generando = false;
                    this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al generar las liquidaciones.');
                    this.cdr.detectChanges();
                }
            });
        } else {
            this.submite = true;
            setTimeout(() => (this.submite = false), 9000);
        }
    }

    private mostrarResumen(mensaje: string, data: any) {
        const listaHtml = (titulo: string, items?: string[]) =>
            items && items.length ? `<p class="text-left mt-3 mb-1 font-semibold">${titulo}</p><ul class="text-left text-sm">${items.map((i) => `<li>${i}</li>`).join('')}</ul>` : '';

        Swal.fire({
            title: 'Liquidaciones generadas',
            html: `<p class="text-left">${mensaje}</p>${listaHtml('Omitidas', data?.omitidas)}${listaHtml('Excepciones', data?.excepciones)}${listaHtml('Advertencias', data?.advertencias)}`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    }

    cerrarModal() {
        this.ref.close(false);
    }
}
