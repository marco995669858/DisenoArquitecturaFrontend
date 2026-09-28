import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { AlertaVencimientoResultDTO, ContratoDTO, ContratoRequest, RenovarContratoRequest, RenovarContratoResultDTO } from '../models/contrato';

@Injectable({
    providedIn: 'root'
})
export class ContratoService {
    private url = environment.URL_BACKEND + 'contrato/';
    private http = inject(HttpClient);

    listar() {
        return this.http.get<ApiResponse<ContratoDTO[]>>(`${this.url}listar`);
    }

    insertarActualizar(params: ContratoRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}insertar/actualizar`, params);
    }

    eliminar(params: ContratoRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
    }

    /** RN-03 / CU-03a: contratos vencidos recien marcados y los que estan por vencer. */
    alertasVencimiento() {
        return this.http.get<ApiResponse<AlertaVencimientoResultDTO>>(`${this.url}alertas-vencimiento`);
    }

    /** CU-03b: cierra el contrato actual como RENOVADO y abre uno nuevo VIGENTE que lo continua. */
    renovar(params: RenovarContratoRequest) {
        return this.http.post<ApiResponse<RenovarContratoResultDTO>>(`${this.url}renovar`, params);
    }
}
