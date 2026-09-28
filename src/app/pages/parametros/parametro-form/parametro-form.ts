import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ParametroSistemaDTO } from '@/app/core/models/parametro-sistema';
import { ParametroSistemaService } from '@/app/core/services/parametro-sistema-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';

@Component({
    selector: 'app-parametro-form',
    templateUrl: './parametro-form.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputGroupModule, TextareaModule, ButtonModule]
})
export class ParametroForm implements OnInit {
    private parametroService = inject(ParametroSistemaService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);

    formGroup!: FormGroup;
    submite = false;

    ngOnInit() {
        const data: ParametroSistemaDTO = this.config.data;
        this.formGroup = this.fb.group({
            idParametro: [data?.idParametro ?? null],
            clave: [data?.clave ?? '', [Validators.required, Validators.maxLength(50)]],
            valor: [data?.valor ?? '', [Validators.required, Validators.maxLength(255)]],
            descripcion: [data?.descripcion ?? '', [Validators.maxLength(255)]]
        });
    }

    get f() {
        return this.formGroup.controls;
    }

    onClickGuardar() {
        if (this.formGroup.valid) {
            this.parametroService.insertarActualizar(this.formGroup.getRawValue()).subscribe({
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
