import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'footer-widget',
    imports: [RouterModule],
    template: `
        <div class="py-12 px-12 mx-0 mt-20 lg:mx-20">
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 md:col-span-3">
                    <a (click)="router.navigate(['/landing'], { fragment: 'home' })" class="flex flex-wrap items-center justify-center md:justify-start md:mb-0 mb-6 cursor-pointer">
                        <span class="flex items-center justify-center bg-primary-100 dark:bg-primary-900/40 mr-2" style="width: 3rem; height: 3rem; border-radius: 10px">
                            <i class="pi pi-building text-2xl! text-primary"></i>
                        </span>
                        <h4 class="font-medium text-3xl text-surface-900 dark:text-surface-0">Dataverse Rentals</h4>
                    </a>
                </div>

                <div class="col-span-12 md:col-span-9">
                    <div class="grid grid-cols-12 gap-8 text-center md:text-left">
                        <div class="col-span-12 md:col-span-4">
                            <h4 class="font-medium text-2xl leading-normal mb-6 text-surface-900 dark:text-surface-0">Cliente</h4>
                            <span class="leading-normal text-xl block mb-2 text-surface-700 dark:text-surface-100">Administradora Inmobiliaria</span>
                            <span class="leading-normal text-xl block text-surface-700 dark:text-surface-100">Flores &amp; Asociados</span>
                        </div>

                        <div class="col-span-12 md:col-span-4">
                            <h4 class="font-medium text-2xl leading-normal mb-6 text-surface-900 dark:text-surface-0">Consultora</h4>
                            <span class="leading-normal text-xl block mb-2 text-surface-700 dark:text-surface-100">Dataverse Corporation</span>
                            <span class="leading-normal text-xl block text-surface-700 dark:text-surface-100">Célula de 5 alumnos</span>
                        </div>

                        <div class="col-span-12 md:col-span-4">
                            <h4 class="font-medium text-2xl leading-normal mb-6 text-surface-900 dark:text-surface-0">Proyecto académico</h4>
                            <span class="leading-normal text-xl block mb-2 text-surface-700 dark:text-surface-100">Diseño y Arquitectura de Software</span>
                            <span class="leading-normal text-xl block text-surface-700 dark:text-surface-100">Facultad de Ingeniería</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class FooterWidget {
    constructor(public router: Router) {}
}
