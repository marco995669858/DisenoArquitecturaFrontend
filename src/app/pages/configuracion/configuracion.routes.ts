import { Routes } from '@angular/router';
import { Configuracion } from './configuracion';

// Asumiendo los nombres de tus componentes importados:
import { Aseguradora } from './aseguradora/aseguradora';
import { EstadoCita } from './estado-cita/estado-cita';
import { TipoConsulta } from './tipo-consulta/tipo-consulta';
import { TipoDocumento } from './tipo-documento/tipo-documento';
import { Especialidad } from './especialidad/especialidad';

export const CONFIGURACION: Routes = [
  {
    path: 'maestros',
    component: Configuracion,
    children: [
      { path: 'aseguradora', component: Aseguradora },
      { path: 'especialidades', component: Especialidad },
      { path: 'estado-cita', component: EstadoCita },
      { path: 'tipo-consulta', component: TipoConsulta },
      { path: 'tipo-documento', component: TipoDocumento },
      { path: '', redirectTo: 'especialidades', pathMatch: 'full' }
    ]
  }
];
