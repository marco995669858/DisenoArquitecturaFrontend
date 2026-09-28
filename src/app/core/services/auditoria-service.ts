import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { EventoAuditoriaDTO } from '../models/auditoria';

@Injectable({
    providedIn: 'root'
})
export class AuditoriaService {
    private url = environment.URL_BACKEND + 'auditoria/';
    private http = inject(HttpClient);

    listarHistorial(limite = 200) {
        return this.http.get<ApiResponse<EventoAuditoriaDTO[]>>(`${this.url}historial`, { params: { limite } });
    }
}
