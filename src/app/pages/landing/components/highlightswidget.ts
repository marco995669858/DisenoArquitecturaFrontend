import { Component } from '@angular/core';

@Component({
    selector: 'highlights-widget',
    template: `
        <div id="highlights" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
            <div class="text-center">
                <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Lo que hoy se hace a mano, ahora lo hace el sistema</div>
                <span class="text-muted-color text-2xl">Menos hojas de cálculo, menos errores de cálculo, menos documentos perdidos.</span>
            </div>

            <div class="grid grid-cols-12 gap-4 mt-20 pb-2 md:pb-20">
                <div class="flex justify-center col-span-12 lg:col-span-6 bg-purple-100 p-0 order-1 lg:order-0" style="border-radius: 8px">
                    <div class="flex items-center justify-center w-11/12" style="min-height: 320px">
                        <i class="pi pi-percentage text-9xl! text-purple-400"></i>
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-6 my-auto flex flex-col lg:items-end text-center lg:text-right gap-4">
                    <div class="flex items-center justify-center bg-purple-200 self-center lg:self-end" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                        <i class="pi pi-fw pi-calculator text-4xl! text-purple-700"></i>
                    </div>
                    <div class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-normal">Prorrateo y liquidación de un clic</div>
                    <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal ml-0 md:ml-2" style="max-width: 650px"
                        >A partir de las lecturas de medidores y el recibo del servicio, el sistema calcula el consumo de cada unidad, reparte el excedente de áreas comunes y emite la liquidación mensual completa: alquiler, luz, agua y mantenimiento imputable.</span
                    >
                </div>
            </div>

            <div class="grid grid-cols-12 gap-4 my-20 pt-2 md:pt-20">
                <div class="col-span-12 lg:col-span-6 my-auto flex flex-col text-center lg:text-left lg:items-start gap-4">
                    <div class="flex items-center justify-center bg-yellow-200 self-center lg:self-start" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                        <i class="pi pi-fw pi-shield text-3xl! text-yellow-700"></i>
                    </div>
                    <div class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-normal">Cada rol ve solo lo que necesita</div>
                    <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal mr-0 md:mr-2" style="max-width: 650px"
                        >Acceso por usuario y rol (administrador, cobranza, mantenimiento), con alertas automáticas de contratos por vencer y un dashboard con ingresos, egresos, morosidad y resultado del mes para quien administra el edificio.</span
                    >
                </div>

                <div class="flex justify-end order-1 sm:order-2 col-span-12 lg:col-span-6 bg-yellow-100 p-0" style="border-radius: 8px">
                    <div class="flex items-center justify-center w-11/12" style="min-height: 320px">
                        <i class="pi pi-chart-line text-9xl! text-yellow-400"></i>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class HighlightsWidget {}
