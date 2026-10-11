import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { UsuarioDTO } from '@/app/core/models/usuario';
import { UsuarioService } from '@/app/core/services/usuario-service';
import { RolService } from '@/app/core/services/rol-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';

@Component({
    selector: 'app-usuario-form',
    templateUrl: './usuario-form.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputGroupModule, PasswordModule, SelectModule, ButtonModule]
})
export class UsuarioForm implements OnInit {
    private usuarioService = inject(UsuarioService);
    private rolService = inject(RolService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);

    formGroup!: FormGroup;
    submite = false;
    esNuevo = true;
    roles: { label: string; value: number }[] = [];

    estados = [
        { label: 'Activo', value: 'ACTIVO' },
        { label: 'Inactivo', value: 'INACTIVO' }
    ];

    ngOnInit() {
        const data: UsuarioDTO = this.config.data;
        this.esNuevo = !data;

        this.formGroup = this.fb.group({
            idUsuario: [data?.idUsuario ?? null],
            idRol: [data?.idRol ?? null, Validators.required],
            nombreUsuario: [data?.nombreUsuario ?? '', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
            password: [this.esNuevo ? '' : null, this.esNuevo ? [Validators.required, Validators.minLength(8)] : []],
            nombreCompleto: [data?.nombreCompleto ?? '', [Validators.required, Validators.maxLength(150)]],
            email: [data?.email ?? '', [Validators.email, Validators.maxLength(150)]],
            estado: [data?.estado ?? 'ACTIVO', Validators.required]
        });

        // nombreUsuario identifica el login y no se puede cambiar una vez creado.
        if (!this.esNuevo) {
            this.formGroup.get('nombreUsuario')!.disable();
        }

        this.rolService.listar().subscribe({
            next: (r) => {
                this.roles = (r.data ?? []).map((rol) => ({ label: rol.nombre!, value: rol.idRol! }));
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar los roles.')
        });
    }

    get f() {
        return this.formGroup.controls;
    }

    onClickGuardar() {
        if (this.formGroup.valid) {
            this.usuarioService.insertarActualizar(this.formGroup.getRawValue()).subscribe({
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
