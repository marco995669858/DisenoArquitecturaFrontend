import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { RolDTO } from '@/app/core/models/rol';
import { ModuloSistemaDTO, NivelAcceso, PermisoAsignado } from '@/app/core/models/modulo';
import { RolService } from '@/app/core/services/rol-service';
import { ModuloService } from '@/app/core/services/modulo-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';

/**
 * El nombre y los permisos de un rol se guardan juntos, en el mismo POST: el
 * backend reemplaza por completo los permisos anteriores de ese rol por la
 * lista que llega aca, cada uno con su nivel de acceso (ver
 * ImplRol.insertUpdateRol). Antes esta pantalla solo pedia el nombre, y un
 * rol nuevo quedaba sin acceso a ningun modulo -- de ahi el listado de
 * checkboxes. El nivel (Lectura/Escritura) es lo que permite crear un rol
 * como "Consulta" para, por ejemplo, una auditoria externa: ve los modulos
 * marcados pero no puede crear, editar ni eliminar en ellos -- el backend
 * (PermisoAccessFilter) tambien lo exige de verdad, no es solo de interfaz.
 */
@Component({
    selector: 'app-rol-form',
    templateUrl: './rol-form.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputGroupModule, CheckboxModule, SelectButtonModule, ButtonModule]
})
export class RolForm implements OnInit {
    private rolService = inject(RolService);
    private moduloService = inject(ModuloService);
    private notificacion = inject(NotificacionService);
    private ref = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);
    private fb = inject(FormBuilder);
    private cdr = inject(ChangeDetectorRef);

    formGroup!: FormGroup;
    submite = false;
    modulos: ModuloSistemaDTO[] = [];

    opcionesNivel = [
        { label: 'Solo lectura', value: 'LECTURA' as NivelAcceso },
        { label: 'Lectura y escritura', value: 'ESCRITURA' as NivelAcceso }
    ];

    ngOnInit() {
        const data: RolDTO = this.config.data;
        this.formGroup = this.fb.group({
            idRol: [data?.idRol ?? null],
            nombre: [data?.nombre ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            permisos: [[] as PermisoAsignado[]]
        });

        this.moduloService.listar().subscribe({
            next: (r) => {
                this.modulos = r.data ?? [];
                this.cdr.detectChanges();
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar los módulos.')
        });

        if (data?.idRol) {
            this.rolService.obtenerPermisos(data.idRol).subscribe({
                next: (r) => {
                    this.formGroup.patchValue({ permisos: r.data ?? [] });
                    this.cdr.detectChanges();
                },
                error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar los permisos del rol.')
            });
        }
    }

    get f() {
        return this.formGroup.controls;
    }

    private permisos(): PermisoAsignado[] {
        return this.formGroup.value.permisos ?? [];
    }

    estaMarcado(codigo: string): boolean {
        return this.permisos().some((p) => p.codigo === codigo);
    }

    nivelDe(codigo: string): NivelAcceso {
        return this.permisos().find((p) => p.codigo === codigo)?.nivelAcceso ?? 'ESCRITURA';
    }

    onCambioPermiso(codigo: string, marcado: boolean) {
        const actuales = this.permisos();
        const nuevos = marcado ? [...actuales, { codigo, nivelAcceso: 'ESCRITURA' as NivelAcceso }] : actuales.filter((p) => p.codigo !== codigo);
        this.formGroup.patchValue({ permisos: nuevos });
    }

    onCambioNivel(codigo: string, nivelAcceso: NivelAcceso) {
        const nuevos = this.permisos().map((p) => (p.codigo === codigo ? { ...p, nivelAcceso } : p));
        this.formGroup.patchValue({ permisos: nuevos });
    }

    onClickGuardar() {
        if (this.formGroup.valid) {
            this.rolService.insertarActualizar(this.formGroup.getRawValue()).subscribe({
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
