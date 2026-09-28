import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        © 2026 - {{anioActual}} GRUPO 7
    </div>`
})
export class AppFooter {
    anioActual:number = new Date().getFullYear() + 1;
}
