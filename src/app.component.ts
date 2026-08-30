import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingSpinner } from './app/shared/loading-spinner/loading-spinner';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule,LoadingSpinner, ToastModule],
    template: `<router-outlet></router-outlet> <p-toast></p-toast> <app-loading-spinner></app-loading-spinner>`
})
export class AppComponent implements OnInit{
    ngOnInit() {
        localStorage.setItem('usuario', 'Marco');
    }

}
