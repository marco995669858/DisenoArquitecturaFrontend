import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, throwError } from 'rxjs';
import { LoadingService } from '../services/loading-service';
import { AuthService } from '../services/auth-service';
import { NotificacionService } from '../services/notificacion-service';

// --- ESTADO GLOBAL DEL INTERCEPTOR ---
// Bandera para saber si ya estamos en proceso de pedir un nuevo token
let estaRefrescando = false;
// La "Sala de espera". Inicia en null. Cuando haya un token nuevo, emitirá ese token.
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const loadingService = inject(LoadingService);
    const authService = inject(AuthService);
    const notificacionService = inject(NotificacionService);

    const token = authService.obtenerToken();

    // Activamos el loading al iniciar la petición
    loadingService.show();

    // 1. Clonar la petición y agregar el Token
    let peticionClonada = req;
    if (token) {
        peticionClonada = inyectarToken(req, token);
    }

    return next(peticionClonada).pipe(
        // Agregamos un delay opcional para evitar parpadeos en redes ultra rápidas
        // delay(400),
        catchError((error: HttpErrorResponse) => {
            // Si el backend dice 401, el token expiró o es inválido
            if ((error.status === 401 || error.status === 403) && !req.url.includes('/login')) {
                return manejarError401(req, next, authService);
            }
            return throwError(() => error);
        }),
        finalize(() => {
            // Desactivamos el loading al finalizar (éxito o error)
            loadingService.hide();
        })
    );
};

// --- FUNCIONES AUXILIARES ---

// Función para pegar el token en los headers (para no repetir código)
const inyectarToken = (request: HttpRequest<any>, token: string) => {
    return request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
    });
};

// Función para manejar el 401 y la sala de espera
const manejarError401 = (request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService) => {
    // CASO A: Somos la PRIMERA petición en fallar
    if (!estaRefrescando) {
        estaRefrescando = true;
        refreshTokenSubject.next(null); // Cerramos la sala de espera (nadie pasa)

        return authService.refrescarToken().pipe(
            switchMap((respuesta) => {
                estaRefrescando = false;

                // ¡Tenemos tokens nuevos! Los guardamos
                authService.guardarToken(respuesta.accessToken, respuesta.refreshToken);

                // Avisamos a la sala de espera que ya hay un token nuevo
                refreshTokenSubject.next(respuesta.accessToken);

                // Reintentamos la petición original que falló
                return next(inyectarToken(request, respuesta.accessToken));
            }),
            catchError((err) => {
                // CASO CRÍTICO: El Refresh Token también expiró o es inválido
                estaRefrescando = false;
                authService.logout(); // ¡Te vas pal lobby! (Cierra sesión obligatoriamente)
                return throwError(() => err);
            })
        );
    }

    // CASO B: Ya hay otra petición refrescando el token. ¡Ponte a la cola!
    else {
        return refreshTokenSubject.pipe(
            // Esperamos hasta que el BehaviorSubject emita algo que NO sea null
            filter((token) => token !== null),
            take(1), // Tomamos el nuevo token y nos desuscribimos (salimos de la sala de espera)
            // Reintentamos esta petición pausada con el nuevo token
            switchMap((token) => next(inyectarToken(request, token as string)))
        );
    }
};
