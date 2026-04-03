import { inject, Injectable, Injector } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private injector = inject(Injector);
  private messageService = this.injector.get(MessageService);

  showSuccess(message: string) {
    this.messageService.add({
      key: 'global',
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }
  showInfo(message: string) {
    this.messageService.add({ key: 'global', severity: 'info', summary: 'Info', detail: message });
  }

  showWarn(message: string) {
    this.messageService.add({ key: 'global', severity: 'warn', summary: 'Warn', detail: message });
  }

  showError(message: string) {
    this.messageService.add({
      key: 'global',
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  showContrast(message: string) {
    this.messageService.add({
      key: 'global',
      severity: 'contrast',
      summary: 'Contrast',
      detail: message,
    });
  }

  showSecondary(message: string) {
    this.messageService.add({
      key: 'global',
      severity: 'secondary',
      summary: 'Secondary',
      detail: message,
    });
  }
}
