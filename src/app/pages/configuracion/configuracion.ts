import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router, NavigationEnd } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { filter } from 'rxjs';

@Component({
    selector: 'app-configuracion',
    templateUrl: './configuracion.html',
    styleUrl: './configuracion.scss',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLinkWithHref, TabsModule]
})
export class Configuracion implements OnInit {
    tabs = [
        /* { id: 'aseguradora', label: 'Aseguradora' }, */
        { id: 'especialidades', label: 'Especialidades' },
        { id: 'estado-cita', label: 'Estado de Cita' },
        { id: 'tipo-consulta', label: 'Tipo de Consulta' },
        { id: 'tipo-documento', label: 'Tipo de Documento' }
    ];

    activeTab = signal('especialidades');

    private router = inject(Router);

    ngOnInit() {
        this.sincronizarTabConUrl(this.router.url);

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: any) => {
            this.sincronizarTabConUrl(event.urlAfterRedirects);
        });
    }

    sincronizarTabConUrl(url: string) {
        const tabEncontrado = this.tabs.find((tab) => url.includes(tab.id));

        if (tabEncontrado) {
            this.activeTab.set(tabEncontrado.id);
        }
    }
}
