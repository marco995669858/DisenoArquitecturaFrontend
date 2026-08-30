import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Ruc } from '../models/ruc';
import { Dni } from '../models/dni';

@Injectable({
  providedIn: 'root',
})
export class DniService {

  url:string = 'https://dniruc.apisperu.com/api/v1/';
  token:string = '?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im1hcmNvczk5NTY2OTg1OEBnbWFpbC5jb20ifQ.7sfHaLFbS6mn7cwDRMBHiE2FM2fo0G6WDbvFNpJrQuA'

  private http = inject(HttpClient);

  getConsultarDni(dni:string){
    return this.http.get<Dni>(`${this.url}dni/${dni}${this.token}`);
  }

  getConsultarRuc(ruc:string){
    return this.http.get<Ruc>(`${this.url}ruc/${ruc}${this.token}`);
  }
}
