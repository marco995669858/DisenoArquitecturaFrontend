import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { hasPermisoGuard, isAuthGuard } from './app/core/guards/auth-guard';
import { Unidades } from './app/pages/unidades/unidades';
import { Inquilinos } from './app/pages/inquilinos/inquilinos';
import { Contratos } from './app/pages/contratos/contratos';
import { Medidores } from './app/pages/medidores/medidores';
import { Lecturas } from './app/pages/lecturas/lecturas';
import { Prorrateo } from './app/pages/prorrateo/prorrateo';
import { Liquidaciones } from './app/pages/liquidaciones/liquidaciones';
import { Pagos } from './app/pages/pagos/pagos';
import { Mantenimiento } from './app/pages/mantenimiento/mantenimiento';
import { Roles } from './app/pages/roles/roles';
import { Usuarios } from './app/pages/usuarios/usuarios';
import { Parametros } from './app/pages/parametros/parametros';
import { Periodos } from './app/pages/periodos/periodos';
import { Recibos } from './app/pages/recibos/recibos';
import { Auditoria } from './app/pages/auditoria/auditoria';

// Cada ruta protegida exige el codigo de modulo_sistema correspondiente (ver
// rol_permiso en el backend); Dashboard es la unica sin restriccion, visible
// para cualquier usuario autenticado.
export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [isAuthGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'unidades', component: Unidades, canActivate: [hasPermisoGuard('UNIDADES')] },
            { path: 'inquilinos', component: Inquilinos, canActivate: [hasPermisoGuard('INQUILINOS')] },
            { path: 'contratos', component: Contratos, canActivate: [hasPermisoGuard('CONTRATOS')] },
            { path: 'medidores', component: Medidores, canActivate: [hasPermisoGuard('MEDIDORES')] },
            { path: 'lecturas', component: Lecturas, canActivate: [hasPermisoGuard('LECTURAS')] },
            { path: 'recibos', component: Recibos, canActivate: [hasPermisoGuard('RECIBOS')] },
            { path: 'prorrateo', component: Prorrateo, canActivate: [hasPermisoGuard('PRORRATEO')] },
            { path: 'liquidaciones', component: Liquidaciones, canActivate: [hasPermisoGuard('LIQUIDACIONES')] },
            { path: 'pagos', component: Pagos, canActivate: [hasPermisoGuard('PAGOS')] },
            { path: 'mantenimiento', component: Mantenimiento, canActivate: [hasPermisoGuard('MANTENIMIENTO')] },
            { path: 'roles', component: Roles, canActivate: [hasPermisoGuard('ROLES')] },
            { path: 'usuarios', component: Usuarios, canActivate: [hasPermisoGuard('USUARIOS')] },
            { path: 'parametros', component: Parametros, canActivate: [hasPermisoGuard('PARAMETROS')] },
            { path: 'periodos', component: Periodos, canActivate: [hasPermisoGuard('PERIODOS')] },
            { path: 'auditoria', component: Auditoria, canActivate: [hasPermisoGuard('AUDITORIA')] }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
