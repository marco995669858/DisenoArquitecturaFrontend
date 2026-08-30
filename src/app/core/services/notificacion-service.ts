import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class NotificacionService {
    private messageService = inject(MessageService);

    mostrarMensaje(tipo: number, mensaje: string) {
        const configuracion: Record<number, { severity: string; summary: string }> = {
            1: { severity: 'success', summary: 'Éxito' },
            2: { severity: 'info', summary: 'Información' },
            0: { severity: 'error', summary: 'Error' }
        };

        const configActual = configuracion[tipo] || { severity: 'warn', summary: 'Atención' };

        this.messageService.add({
            severity: configActual.severity,
            summary: configActual.summary,
            detail: mensaje
        });
    }

    mostrarDialog(titulo?: string, texto?: string, icon?: any, colorConfirm?: string, colorCancel?: string, textButtonConfirm?: string, textButtonCancel?: any) {
        return Swal.fire({
            title: titulo,
            text: texto,
            icon: icon,
            showCancelButton: true,
            confirmButtonColor: colorConfirm,
            cancelButtonColor: colorCancel,
            confirmButtonText: textButtonConfirm,
            cancelButtonText: textButtonCancel
        });
    }
}
