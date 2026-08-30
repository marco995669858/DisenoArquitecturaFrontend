import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

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

// Guard 2: ¿Tiene el rol correcto?
export const hasRoleGuard = (rolesPermitidos: string[]): CanActivateFn => {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        const usuario = authService.usuarioActual();

        const tienePermiso = usuario?.roles.some((rol) => rolesPermitidos.includes(rol.authority));

        if (tienePermiso) {
            return true;
        }

        // Si no tiene permiso, lo mandamos al dashboard
        router.navigate(['/']);
        return false;
    };
};
