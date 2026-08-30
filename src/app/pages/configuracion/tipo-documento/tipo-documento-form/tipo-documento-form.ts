import { TipoDocumentoDTO } from '@/app/core/models/tipoDocumento';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { TipoDocumentoService } from '@/app/core/services/tipo-documento-service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-tipo-documento-form',
    templateUrl: './tipo-documento-form.html',
    styleUrl: './tipo-documento-form.scss',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputGroupModule, TextareaModule, ButtonModule, ColorPickerModule]
})
export class TipoDocumentoForm implements OnInit {
    private tipoDocumentoService = inject(TipoDocumentoService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);

    formGroup!: FormGroup;
    submite: boolean = false;

    ngOnInit() {
        let data: TipoDocumentoDTO = this.config.data;
        this.formGroup = this.fb.group({
            idTipoDocumento: [data?.idTipoDocumento ?? 0],
            nombre: [data?.nombre ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            abreviatura: [data?.abreviatura ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]]
        });
    }

    get f() {
        return this.formGroup.controls;
    }

    onClickGuardar() {
        if (this.formGroup.valid) {
            this.tipoDocumentoService.insertarActualizar(this.formGroup.getRawValue()).subscribe({
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
