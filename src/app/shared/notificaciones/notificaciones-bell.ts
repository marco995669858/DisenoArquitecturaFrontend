import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { PopoverModule, Popover } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ContratoService } from '@/app/core/services/contrato-service';
import { LiquidacionService } from '@/app/core/services/liquidacion-service';
import { PermisosService } from '@/app/core/services/permisos-service';

interface Notificacion {
    icono: string;
    color: string;
    texto: string;
    ruta: string;
}

/**
 * Campanita de notificaciones del topbar. No agrega ningun endpoint nuevo:
 * junta dos cosas que el backend ya calcula (RN-03 contratos por vencer, y
 * las liquidaciones que ya estan en VENCIDO) y las muestra en un solo lugar,
 * filtradas por rol igual que el menu lateral (app.menu.ts).
 */
@Component({
    selector: 'app-notificaciones-bell',
    standalone: true,
    imports: [CommonModule, BadgeModule, OverlayBadgeModule, PopoverModule, ButtonModule, TooltipModule],
    templateUrl: './notificaciones-bell.html'
})
export class NotificacionesBell implements OnInit {
    @ViewChild('panel') panel!: Popover;

    private contratoService = inject(ContratoService);
    private liquidacionService = inject(LiquidacionService);
    private permisosService = inject(PermisosService);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    cargando = false;
    notificaciones: Notificacion[] = [];

    ngOnInit() {
        // Degrada en silencio a proposito: si fallan los permisos aca, el
        // menu lateral (app.menu.ts) ya le avisa al usuario por su cuenta;
        // no hace falta duplicar el mismo aviso por la campanita.
        this.permisosService.obtenerPermisos().subscribe({ next: () => this.cargar(), error: () => {} });
    }

    private cargar() {
        // Contratos y liquidaciones son cosa de quien tenga esos modulos
        // habilitados (antes, fijo a Administrador/Cobranza); si el rol no
        // tiene ninguno de los dos, ni siquiera vale la pena consultar.
        const puedeContratos = this.permisosService.tienePermiso('CONTRATOS');
        const puedeLiquidaciones = this.permisosService.tienePermiso('LIQUIDACIONES');
        if (!puedeContratos && !puedeLiquidaciones) {
            return;
        }

        this.cargando = true;
        forkJoin({
            contratos: puedeContratos ? this.contratoService.alertasVencimiento() : of(null),
            liquidaciones: puedeLiquidaciones ? this.liquidacionService.listar() : of(null)
        }).subscribe({
            next: ({ contratos, liquidaciones }) => {
                this.cargando = false;
                const lista: Notificacion[] = [];

                (contratos?.data?.contratosPorVencer ?? []).forEach((c) => {
                    lista.push({
                        icono: 'pi pi-file',
                        color: 'text-orange-500',
                        texto: `Contrato de ${c.numeroUnidad} (${c.nombreInquilino}) vence en ${c.diasParaVencer} día(s)`,
                        ruta: '/contratos'
                    });
                });

                (liquidaciones?.data ?? [])
                    .filter((l) => l.estado === 'VENCIDO')
                    .forEach((l) => {
                        lista.push({
                            icono: 'pi pi-exclamation-triangle',
                            color: 'text-red-500',
                            texto: `Liquidación de ${l.numeroUnidad} — ${l.periodo} está vencida (S/ ${l.montoTotal?.toFixed(2)})`,
                            ruta: '/liquidaciones'
                        });
                    });

                this.notificaciones = lista;
                this.cdr.detectChanges();
            },
            error: () => {
                this.cargando = false;
                this.cdr.detectChanges();
            }
        });
    }

    toggle(event: Event) {
        this.panel.toggle(event);
    }

    onClickNotificacion(n: Notificacion) {
        this.panel.hide();
        this.router.navigate([n.ruta]);
    }
}
