import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth-service';
import { PermisosService } from '../services/permisos-service';

// Guard 1: ¿Está logueado?
export const isAuthGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.estaAutenticado()) {
        return true;
    }

    // Si no lo está, lo mandamos al login
    router.navigate(['/auth/login']);
    return false;
};

/**
 * Guard 2: ¿el rol del usuario tiene el modulo habilitado?
 *
 * Antes esto recibia un arreglo de roles fijo en el codigo (ROLE_X). Eso
 * hacia que un rol nuevo, creado desde la pantalla Roles, no encajara en
 * ningun arreglo y quedara sin acceso a nada mas que el Dashboard. Ahora el
 * codigo de modulo se valida contra los permisos reales del rol del usuario
 * (rol_permiso en el backend, configurables desde Roles), no contra un
 * nombre de rol fijo. Es asincrono porque los permisos pueden no estar
 * cargados todavia (p.ej. recien despues de un F5).
 */
export const hasPermisoGuard = (codigoModulo: string): CanActivateFn => {
    return () => {
        const permisosService = inject(PermisosService);
        const router = inject(Router);

        return permisosService.obtenerPermisos().pipe(
            map((permisos) => {
                if (permisos.some((p) => p.codigo === codigoModulo)) {
                    return true;
                }
                // Si no tiene permiso, lo mandamos al dashboard
                router.navigate(['/']);
                return false;
            })
        );
    };
};
