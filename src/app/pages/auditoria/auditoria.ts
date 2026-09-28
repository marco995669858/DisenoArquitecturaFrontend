import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { AuditoriaService } from '@/app/core/services/auditoria-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { EventoAuditoriaDTO } from '@/app/core/models/auditoria';

@Component({
    selector: 'app-auditoria',
    templateUrl: './auditoria.html',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, TagModule, InputIconModule, IconFieldModule, InputTextModule]
})
export class Auditoria implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    private auditoriaService = inject(AuditoriaService);
    private notificacion = inject(NotificacionService);
    private cdr = inject(ChangeDetectorRef);

    eventos: EventoAuditoriaDTO[] = [];
    cargando = false;

    ngOnInit() {
        this.listar();
    }

    listar() {
        this.cargando = true;
        this.auditoriaService.listarHistorial(200).subscribe({
            next: (respuesta) => {
                this.cargando = false;
                if (respuesta.error) {
                    return this.notificacion.mostrarMensaje(0, respuesta.mensaje);
                }
                this.eventos = respuesta.data ?? [];
                this.cdr.detectChanges();
            },
            error: () => {
                this.cargando = false;
                this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar el historial de auditoría.');
                this.cdr.detectChanges();
            }
        });
    }

    severidadAccion(accion?: string) {
        switch (accion) {
            case 'CREACION': return 'success';
            case 'ACTUALIZACION': return 'info';
            case 'ELIMINACION': return 'danger';
            default: return 'secondary';
        }
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
