import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InquilinoDTO } from '@/app/core/models/inquilino';
import { InquilinoService } from '@/app/core/services/inquilino-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';

@Component({
    selector: 'app-inquilino-form',
    templateUrl: './inquilino-form.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputGroupModule, SelectModule, ButtonModule]
})
export class InquilinoForm implements OnInit {
    private inquilinoService = inject(InquilinoService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);

    formGroup!: FormGroup;
    submite = false;

    tiposDocumento = [
        { label: 'DNI', value: 'DNI' },
        { label: 'RUC', value: 'RUC' },
        { label: 'Carné de extranjería', value: 'CE' },
        { label: 'Pasaporte', value: 'PASAPORTE' }
    ];

    ngOnInit() {
        const data: InquilinoDTO = this.config.data;
        this.formGroup = this.fb.group({
            idInquilino: [data?.idInquilino ?? null],
            tipoDocumento: [data?.tipoDocumento ?? 'DNI', Validators.required],
            numeroDocumento: [data?.numeroDocumento ?? '', [Validators.required, Validators.maxLength(20)]],
            nombreCompleto: [data?.nombreCompleto ?? '', [Validators.required, Validators.maxLength(150)]],
            telefono: [data?.telefono ?? '', [Validators.maxLength(20)]],
            email: [data?.email ?? '', [Validators.email, Validators.maxLength(150)]],
            direccion: [data?.direccion ?? '', [Validators.maxLength(255)]]
        });
    }

    get f() {
        return this.formGroup.controls;
    }

    onClickGuardar() {
        if (this.formGroup.valid) {
            this.inquilinoService.insertarActualizar(this.formGroup.getRawValue()).subscribe({
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
