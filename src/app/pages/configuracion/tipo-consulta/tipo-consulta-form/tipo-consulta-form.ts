import { TipoConsultaDTO } from '@/app/core/models/tipoConsulta';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { TipoConsultaService } from '@/app/core/services/tipo-consulta-service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-tipo-consulta-form',
    templateUrl: './tipo-consulta-form.html',
    styleUrl: './tipo-consulta-form.scss',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputGroupModule, TextareaModule, ButtonModule, ColorPickerModule, DatePickerModule, InputNumberModule]
})
export class TipoConsultaForm implements OnInit {
    private tipoConsultaService = inject(TipoConsultaService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);

    formGroup!: FormGroup;
    submite: boolean = false;
    duracionEnMinutosFinal: number = 0;

    ngOnInit() {
        let data: TipoConsultaDTO = this.config.data;

        let duracionInicial: any = '';
        if (data?.duracionEstimadaMinutos) {
            const horas = Math.floor(data.duracionEstimadaMinutos / 60);
            const mins = data.duracionEstimadaMinutos % 60;
            duracionInicial = new Date();
            duracionInicial.setHours(horas, mins, 0);
            this.duracionEnMinutosFinal = data.duracionEstimadaMinutos;
        }

        this.formGroup = this.fb.group({
            idTipoConsulta: [data?.idTipoConsulta ?? 0],
            nombre: [data?.nombre ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            duracionEstimadaMinutos: [duracionInicial, [Validators.required]],
            precioBase: [data?.precioBase, [Validators.required]]
        });

        this.formGroup.get('duracionEstimadaMinutos')?.valueChanges.subscribe((valor: any) => {
            if (valor instanceof Date) {
                this.procesarMinutos(valor);
            } else if (typeof valor === 'string') {
                // Si el usuario escribe manualmente, a veces llega como string antes de convertirse
                const dateParsed = new Date(`1970-01-01T${valor}:00`);
                if (!isNaN(dateParsed.getTime())) {
                    this.procesarMinutos(dateParsed);
                }
            }
        });
    }

    get f() {
        return this.formGroup.controls;
    }

    procesarMinutos(fecha: Date) {
        const totalMinutos = fecha.getHours() * 60 + fecha.getMinutes();
        this.duracionEnMinutosFinal = totalMinutos;
    }

    onClickGuardar() {
        if (this.formGroup.valid) {
            this.formGroup.get('duracionEstimadaMinutos')?.setValue(this.duracionEnMinutosFinal);
            this.tipoConsultaService.insertarActualizar(this.formGroup.getRawValue()).subscribe({
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
