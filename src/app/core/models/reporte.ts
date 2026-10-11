import { ContratoPorVencerDTO } from './contrato';
import { LiquidacionDTO } from './liquidacion';

export interface IngresoEgresoPeriodoDTO {
    periodo?: string;
    ingresos?: number;
    egresos?: number;
}

/** RF-09 -- indicadores de rentabilidad ya calculados por GestorRentabilidad en el backend. */
export interface DashboardDTO {
    ingresos?: number;
    egresos?: number;
    morosidad?: number;
    resultadoNeto?: number;
    unidadesDisponibles?: number;
    unidadesOcupadas?: number;
    unidadesEnMantenimiento?: number;
    contratosPorVencer?: ContratoPorVencerDTO[];
    liquidacionesPendientes?: LiquidacionDTO[];
    ingresosEgresosPorPeriodo?: IngresoEgresoPeriodoDTO[];
}
