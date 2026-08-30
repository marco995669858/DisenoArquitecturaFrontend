import { LoadingService } from '@/app/core/services/loading-service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss',
  standalone: true,
  imports: [CommonModule],
})
export class LoadingSpinner {
  loadingService = inject(LoadingService);
}
