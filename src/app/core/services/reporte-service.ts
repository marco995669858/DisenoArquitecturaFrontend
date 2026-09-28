import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class ReporteService {
    private url = environment.URL_BACKEND + 'reporte/';
    private http = inject(HttpClient);

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
