import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { PermisosService } from '@/app/core/services/permisos-service';

interface MenuEntry {
    label: string;
    icon: string;
    routerLink: string[];
    /** Si se omite, el ítem es visible para cualquier usuario autenticado (solo el Dashboard). */
    codigoModulo?: string;
}

interface MenuGroup {
    label: string;
    items: MenuEntry[];
}

// Mismo codigo de modulo que valida app.routes.ts (ver rol_permiso en el
// backend): un grupo entero se oculta si ninguno de sus items es visible
// para los permisos del usuario logueado.
const MENU: MenuGroup[] = [
    {
        label: 'Principal',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
    },
    {
        label: 'Inmuebles',
        items: [
            { label: 'Unidades', icon: 'pi pi-fw pi-building', routerLink: ['/unidades'], codigoModulo: 'UNIDADES' },
            { label: 'Inquilinos', icon: 'pi pi-fw pi-users', routerLink: ['/inquilinos'], codigoModulo: 'INQUILINOS' },
            { label: 'Contratos', icon: 'pi pi-fw pi-file', routerLink: ['/contratos'], codigoModulo: 'CONTRATOS' }
        ]
    },
    {
        label: 'Servicios',
        items: [
            { label: 'Medidores', icon: 'pi pi-fw pi-gauge', routerLink: ['/medidores'], codigoModulo: 'MEDIDORES' },
            { label: 'Lecturas', icon: 'pi pi-fw pi-list-check', routerLink: ['/lecturas'], codigoModulo: 'LECTURAS' },
            { label: 'Recibos', icon: 'pi pi-fw pi-file-import', routerLink: ['/recibos'], codigoModulo: 'RECIBOS' },
            { label: 'Prorrateo', icon: 'pi pi-fw pi-percentage', routerLink: ['/prorrateo'], codigoModulo: 'PRORRATEO' }
        ]
    },
    {
        label: 'Cobranza',
        items: [
            { label: 'Liquidaciones', icon: 'pi pi-fw pi-receipt', routerLink: ['/liquidaciones'], codigoModulo: 'LIQUIDACIONES' },
            { label: 'Pagos', icon: 'pi pi-fw pi-wallet', routerLink: ['/pagos'], codigoModulo: 'PAGOS' }
        ]
    },
    {
        label: 'Operaciones',
        items: [{ label: 'Mantenimiento', icon: 'pi pi-fw pi-wrench', routerLink: ['/mantenimiento'], codigoModulo: 'MANTENIMIENTO' }]
    },
    {
        label: 'Administración',
        items: [
            { label: 'Usuarios', icon: 'pi pi-fw pi-user-edit', routerLink: ['/usuarios'], codigoModulo: 'USUARIOS' },
            { label: 'Roles', icon: 'pi pi-fw pi-shield', routerLink: ['/roles'], codigoModulo: 'ROLES' },
            { label: 'Parámetros', icon: 'pi pi-fw pi-cog', routerLink: ['/parametros'], codigoModulo: 'PARAMETROS' },
            { label: 'Periodos', icon: 'pi pi-fw pi-calendar-clock', routerLink: ['/periodos'], codigoModulo: 'PERIODOS' },
            { label: 'Auditoría', icon: 'pi pi-fw pi-history', routerLink: ['/auditoria'], codigoModulo: 'AUDITORIA' }
        ]
    }
];

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `
})
export class AppMenu implements OnInit {
    private permisosService = inject(PermisosService);
    private cdr = inject(ChangeDetectorRef);

    model: MenuItem[] = [];

    ngOnInit() {
        this.permisosService.obtenerPermisos().subscribe(() => {
            this.construirMenu();
            this.cdr.detectChanges();
        });
    }

    private construirMenu() {
        const puedeVer = (item: MenuEntry) => !item.codigoModulo || this.permisosService.tienePermiso(item.codigoModulo);

        this.model = MENU.map((grupo) => ({
            label: grupo.label,
            items: grupo.items.filter(puedeVer)
        })).filter((grupo) => grupo.items.length > 0);
    }
}
