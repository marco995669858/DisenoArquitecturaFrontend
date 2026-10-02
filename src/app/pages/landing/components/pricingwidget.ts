import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';

/**
 * En el Sakai original esta seccion era de precios. Dataverse Rentals es un
 * prototipo interno para un solo cliente (Flores & Asociados), no un
 * producto que se vende por planes, asi que se reutiliza el mismo layout de
 * 3 tarjetas para mostrar los roles de acceso en su lugar (RNF-01).
 */
@Component({
    selector: 'pricing-widget',
    imports: [RouterModule, DividerModule, ButtonModule, RippleModule],
    template: `
        <div id="pricing" class="py-6 px-6 lg:px-20 my-2 md:my-6">
            <div class="text-center mb-6">
                <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Roles y accesos del sistema</div>
                <span class="text-muted-color text-2xl">Cada usuario entra con su propio rol; el menú y las acciones se ajustan solos.</span>
            </div>

            <div class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-0">
                <div class="col-span-12 lg:col-span-4 p-0 md:p-4">
                    <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                        <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">Administrador</div>
                        <div class="flex justify-center">
                            <div class="flex items-center justify-center bg-blue-100" style="width: 6rem; height: 6rem; border-radius: 50%">
                                <i class="pi pi-shield text-5xl! text-blue-600"></i>
                            </div>
                        </div>
                        <div class="my-8 flex flex-col items-center gap-4">
                            <span class="text-surface-600 dark:text-surface-200 text-center">Control total del sistema</span>
                            <button pButton pRipple label="Ingresar" routerLink="/auth/login" class="p-button-rounded border-0 font-light leading-tight bg-blue-500 text-white"></button>
                        </div>
                        <p-divider class="w-full bg-surface-200"></p-divider>
                        <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Unidades, medidores y prorrateo</span>
                            </li>
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Liquidaciones y dashboard de rentabilidad</span>
                            </li>
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Usuarios, roles y parámetros del sistema</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
                    <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                        <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">Cobranza</div>
                        <div class="flex justify-center">
                            <div class="flex items-center justify-center bg-teal-100" style="width: 6rem; height: 6rem; border-radius: 50%">
                                <i class="pi pi-wallet text-5xl! text-teal-600"></i>
                            </div>
                        </div>
                        <div class="my-8 flex flex-col items-center gap-4">
                            <span class="text-surface-600 dark:text-surface-200 text-center">Inquilinos, contratos y pagos</span>
                            <button pButton pRipple label="Ingresar" routerLink="/auth/login" class="p-button-rounded border-0 font-light leading-tight bg-blue-500 text-white"></button>
                        </div>
                        <p-divider class="w-full bg-surface-200"></p-divider>
                        <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Inquilinos y contratos vigentes</span>
                            </li>
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Liquidaciones y registro de pagos</span>
                            </li>
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Voucher obligatorio por cada cobro</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-4 p-0 md:p-4 mt-6 md:mt-0">
                    <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                        <div class="text-surface-900 dark:text-surface-0 text-center my-8 text-3xl">Mantenimiento</div>
                        <div class="flex justify-center">
                            <div class="flex items-center justify-center bg-orange-100" style="width: 6rem; height: 6rem; border-radius: 50%">
                                <i class="pi pi-wrench text-5xl! text-orange-600"></i>
                            </div>
                        </div>
                        <div class="my-8 flex flex-col items-center gap-4">
                            <span class="text-surface-600 dark:text-surface-200 text-center">Unidades y trabajos operativos</span>
                            <button pButton pRipple label="Ingresar" routerLink="/auth/login" class="p-button-rounded border-0 font-light leading-tight bg-blue-500 text-white"></button>
                        </div>
                        <p-divider class="w-full bg-surface-200"></p-divider>
                        <ul class="my-8 list-none p-0 flex text-surface-900 dark:text-surface-0 flex-col px-8">
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Registro de unidades del edificio</span>
                            </li>
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Gastos de materiales y mano de obra</span>
                            </li>
                            <li class="py-2">
                                <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                <span class="text-xl leading-normal">Trabajos imputables al inquilino</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class PricingWidget {}
