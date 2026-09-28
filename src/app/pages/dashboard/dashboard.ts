import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { forkJoin } from 'rxjs';
import { ContratoService } from '@/app/core/services/contrato-service';
import { LiquidacionService } from '@/app/core/services/liquidacion-service';
import { MantenimientoService } from '@/app/core/services/mantenimiento-service';
import { UnidadService } from '@/app/core/services/unidad-service';
import { ReporteService } from '@/app/core/services/reporte-service';
import { NotificacionService } from '@/app/core/services/notificacion-service';
import { ContratoDTO } from '@/app/core/models/contrato';
import { LiquidacionDTO } from '@/app/core/models/liquidacion';
import { periodoActual } from '@/app/core/utils/date-utils';
import { descargarBlob } from '@/app/core/utils/file-download-utils';

interface ContratoPorVencer extends ContratoDTO {
    diasRestantes: number;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, ChartModule, ButtonModule],
    templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
    private contratoService = inject(ContratoService);
    private liquidacionService = inject(LiquidacionService);
    private mantenimientoService = inject(MantenimientoService);
    private unidadService = inject(UnidadService);
    private reporteService = inject(ReporteService);
    private notificacion = inject(NotificacionService);

    periodo = periodoActual();

    ingresosDelMes = signal(0);
    egresosDelMes = signal(0);
    morosidad = signal(0);
    resultadoNeto = signal(0);

    contratosPorVencer = signal<ContratoPorVencer[]>([]);
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

    ngOnInit() {
        forkJoin({
            contratos: this.contratoService.listar(),
            liquidaciones: this.liquidacionService.listar(),
            mantenimientos: this.mantenimientoService.listar(),
            unidades: this.unidadService.listar()
        }).subscribe(({ contratos, liquidaciones, mantenimientos, unidades }) => {
            const listaLiquidaciones = liquidaciones.data ?? [];
            const liquidacionesDelPeriodo = listaLiquidaciones.filter((l) => l.periodo === this.periodo);

            const ingresos = liquidacionesDelPeriodo.filter((l) => l.estado === 'PAGADO').reduce((sum, l) => sum + (l.montoTotal ?? 0), 0);
            const pendiente = listaLiquidaciones.filter((l) => l.estado === 'PENDIENTE' || l.estado === 'VENCIDO').reduce((sum, l) => sum + (l.montoTotal ?? 0), 0);

            const egresos = (mantenimientos.data ?? [])
                .filter((m) => (m.fechaMantenimiento ?? '').startsWith(this.periodo))
                .reduce((sum, m) => sum + (m.monto ?? 0), 0);

            this.ingresosDelMes.set(ingresos);
            this.egresosDelMes.set(egresos);
            this.morosidad.set(pendiente);
            this.resultadoNeto.set(ingresos - egresos);

            this.liquidacionesPendientes.set(listaLiquidaciones.filter((l) => l.estado !== 'PAGADO').slice(0, 5));

            const hoy = new Date();
            const en30dias = new Date();
            en30dias.setDate(hoy.getDate() + 30);

            const porVencer = (contratos.data ?? [])
                .filter((c) => c.estado === 'VIGENTE' && c.fechaFin)
                .map((c) => {
                    const fechaFin = new Date(c.fechaFin! + 'T00:00:00');
                    const diasRestantes = Math.round((fechaFin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
                    return { ...c, diasRestantes };
                })
                .filter((c) => c.diasRestantes >= 0 && c.diasRestantes <= 30)
                .sort((a, b) => a.diasRestantes - b.diasRestantes)
                .slice(0, 5);

            this.contratosPorVencer.set(porVencer);

            this.construirGraficoUnidadesPorEstado(unidades.data ?? []);
            this.construirGraficoIngresosEgresos(listaLiquidaciones, mantenimientos.data ?? []);
        });
    }

    exportarPdf() {
        this.reporteService.dashboardPdf(this.periodo).subscribe({
            next: (blob) => descargarBlob(blob, `dashboard-${this.periodo}.pdf`),
            error: () => this.notificacion.mostrarMensaje(0, 'Ocurrió un problema al exportar el dashboard.')
        });
    }

    private construirGraficoUnidadesPorEstado(unidades: { estado?: string }[]) {
        const conteo: Record<string, number> = { DISPONIBLE: 0, OCUPADO: 0, MANTENIMIENTO: 0 };
        unidades.forEach((u) => {
            if (u.estado && conteo[u.estado] !== undefined) conteo[u.estado]++;
        });

        this.dataUnidadesPorEstado.set({
            labels: ['Disponible', 'Ocupado', 'Mantenimiento'],
            datasets: [
                {
                    data: [conteo['DISPONIBLE'], conteo['OCUPADO'], conteo['MANTENIMIENTO']],
                    backgroundColor: ['#22c55e', '#3b82f6', '#f97316'],
                    hoverBackgroundColor: ['#16a34a', '#2563eb', '#ea580c']
                }
            ]
        });
    }

    private construirGraficoIngresosEgresos(liquidaciones: LiquidacionDTO[], mantenimientos: { fechaMantenimiento?: string; monto?: number }[]) {
        const ingresosPorPeriodo = new Map<string, number>();
        liquidaciones
            .filter((l) => l.estado === 'PAGADO' && l.periodo)
            .forEach((l) => ingresosPorPeriodo.set(l.periodo!, (ingresosPorPeriodo.get(l.periodo!) ?? 0) + (l.montoTotal ?? 0)));

        const egresosPorPeriodo = new Map<string, number>();
        mantenimientos
            .filter((m) => m.fechaMantenimiento)
            .forEach((m) => {
                const periodo = m.fechaMantenimiento!.slice(0, 7);
                egresosPorPeriodo.set(periodo, (egresosPorPeriodo.get(periodo) ?? 0) + (m.monto ?? 0));
            });

        const periodos = Array.from(new Set([...ingresosPorPeriodo.keys(), ...egresosPorPeriodo.keys()]))
            .sort()
            .slice(-6);

        this.dataIngresosEgresos.set({
            labels: periodos,
            datasets: [
                { label: 'Ingresos', data: periodos.map((p) => ingresosPorPeriodo.get(p) ?? 0), backgroundColor: '#22c55e' },
                { label: 'Egresos', data: periodos.map((p) => egresosPorPeriodo.get(p) ?? 0), backgroundColor: '#f97316' }
            ]
        });
    }
}
