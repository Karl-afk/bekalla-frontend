import { inject, Injectable, Injector } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class Toast {
  private injector = inject(Injector); // Injector im Constructor

  private get messageService() {
    return this.injector.get(MessageService); // Lazy!
  }
  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
