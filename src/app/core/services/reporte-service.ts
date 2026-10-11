import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { DashboardDTO } from '../models/reporte';

@Injectable({
    providedIn: 'root'
})
export class ReporteService {
    private url = environment.URL_BACKEND + 'reporte/';
    private http = inject(HttpClient);

    dashboard(periodo: string) {
        return this.http.get<ApiResponse<DashboardDTO>>(`${this.url}dashboard`, { params: { periodo } });
    }

    liquidacionesExcel(periodo?: string) {
        return this.http.get(`${this.url}liquidaciones/excel`, { params: periodo ? { periodo } : {}, responseType: 'blob' });
    }

    liquidacionesPdf(periodo?: string) {
        return this.http.get(`${this.url}liquidaciones/pdf`, { params: periodo ? { periodo } : {}, responseType: 'blob' });
    }

    dashboardPdf(periodo: string) {
        return this.http.get(`${this.url}dashboard/pdf`, { params: { periodo }, responseType: 'blob' });
    }
}
