import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { ReporteService } from '@/app/core/services/reporte-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { ContratoPorVencerDTO } from '@/app/core/models/contrato';
import { LiquidacionDTO } from '@/app/core/models/liquidacion';
import { periodoActual } from '@/app/core/utils/date-utils';
import { descargarBlob } from '@/app/core/utils/file-download-utils';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, ChartModule, ButtonModule],
    templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
    private reporteService = inject(ReporteService);
    private notificacion = inject(NotificacionService);

    periodo = periodoActual();

    ingresosDelMes = signal(0);
    egresosDelMes = signal(0);
    morosidad = signal(0);
    resultadoNeto = signal(0);

    contratosPorVencer = signal<ContratoPorVencerDTO[]>([]);
    liquidacionesPendientes = signal<LiquidacionDTO[]>([]);

    // Grafico de torta: cuantas unidades hay en cada estado (DISPONIBLE /
    // OCUPADO / MANTENIMIENTO), el mismo estado que ahora se sincroniza solo
    // con el ciclo de vida del contrato.
    dataUnidadesPorEstado = signal<any>(null);

    // Grafico de barras: ingresos (liquidaciones pagadas) vs egresos (gastos
    // de mantenimiento) de los ultimos periodos con datos, para ver la
    // tendencia en vez de solo el mes actual.
    dataIngresosEgresos = signal<any>(null);

    chartOptions = {
        plugins: { legend: { position: 'bottom' } },
        responsive: true,
        maintainAspectRatio: false
    };

    /**
     * Todo lo que antes se calculaba aca combinando cuatro endpoints crudos
     * (ingresos, egresos, morosidad, resultado neto, tendencia) ahora lo
     * entrega ya calculado GestorRentabilidad en el backend (RF-09); esta
     * pantalla solo pide los indicadores y los presenta.
     */
    ngOnInit() {
        this.reporteService.dashboard(this.periodo).subscribe({
            next: (respuesta) => {
                const data = respuesta.data;
                if (!data) {
                    return;
                }

                this.ingresosDelMes.set(data.ingresos ?? 0);
                this.egresosDelMes.set(data.egresos ?? 0);
                this.morosidad.set(data.morosidad ?? 0);
                this.resultadoNeto.set(data.resultadoNeto ?? 0);

                this.liquidacionesPendientes.set((data.liquidacionesPendientes ?? []).slice(0, 5));
                this.contratosPorVencer.set((data.contratosPorVencer ?? []).slice(0, 5));

                this.construirGraficoUnidadesPorEstado(data.unidadesDisponibles ?? 0, data.unidadesOcupadas ?? 0, data.unidadesEnMantenimiento ?? 0);
                this.construirGraficoIngresosEgresos(data.ingresosEgresosPorPeriodo ?? []);
            },
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al cargar el dashboard.')
        });
    }

    exportarPdf() {
        this.reporteService.dashboardPdf(this.periodo).subscribe({
            next: (blob) => descargarBlob(blob, `dashboard-${this.periodo}.pdf`),
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al exportar el dashboard.')
        });
    }

    private construirGraficoUnidadesPorEstado(disponibles: number, ocupadas: number, enMantenimiento: number) {
        this.dataUnidadesPorEstado.set({
            labels: ['Disponible', 'Ocupado', 'Mantenimiento'],
            datasets: [
                {
                    data: [disponibles, ocupadas, enMantenimiento],
                    backgroundColor: ['#22c55e', '#3b82f6', '#f97316'],
                    hoverBackgroundColor: ['#16a34a', '#2563eb', '#ea580c']
                }
            ]
        });
    }

    private construirGraficoIngresosEgresos(tendencia: { periodo?: string; ingresos?: number; egresos?: number }[]) {
        this.dataIngresosEgresos.set({
            labels: tendencia.map((t) => t.periodo),
            datasets: [
                { label: 'Ingresos', data: tendencia.map((t) => t.ingresos ?? 0), backgroundColor: '#22c55e' },
                { label: 'Egresos', data: tendencia.map((t) => t.egresos ?? 0), backgroundColor: '#f97316' }
            ]
        });
    }
}
