import { EspecialidadDTO } from '@/app/core/models/especialidad';
import { EspecialidadService } from '@/app/core/services/especialidad-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-especialidad-form',
    templateUrl: './especialidad-form.html',
    styleUrl: './especialidad-form.scss',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputGroupModule, TextareaModule, ButtonModule]
})
export class EspecialidadForm implements OnInit {
    private especialidadService = inject(EspecialidadService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);

    formGroup!: FormGroup;
    submite: boolean = false;

    ngOnInit() {
        let data: EspecialidadDTO = this.config.data;
        this.formGroup = this.fb.group({
            idEspecialidad: [data?.idEspecialidad ?? 0],
            nombre: [data?.nombre ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            descripcion: [data?.descripcion ?? '', [Validators.minLength(5), Validators.maxLength(500)]]
        });
    }

    get f() {
        return this.formGroup.controls;
    }

    onClickGuardar() {
        if (this.formGroup.valid) {
            this.especialidadService.insertarActualizar(this.formGroup.getRawValue()).subscribe({
                next: (respuesta) => {
                    if (respuesta.error || respuesta.data == 2) {
                        return this.notificacion.mostrarMensaje(respuesta.data ?? 0, respuesta.mensaje);
                    }

                    this.notificacion.mostrarMensaje(respuesta.data, respuesta.mensaje);
                    this.cerrarModal();
                },
                error: (err) => {
                    this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al procesar su solicitud.');
                }
            });
        } else {
            this.submite = true;
            setTimeout(() => {
                this.submite = false;
            }, 9000);
        }
    }

    cerrarModal() {
        this.ref.close(true);
    }
}
