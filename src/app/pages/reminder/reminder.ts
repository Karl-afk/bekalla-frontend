import { Component, inject, resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ReminderService } from '../../services/reminder.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CreateReminder } from '../../components/create-reminder/create-reminder';
import { ReminderList } from '../../components/reminder-list/reminder-list';

@Component({
  selector: 'app-reminder',
  imports: [ButtonModule, DialogModule, CreateReminder, ReminderList],
  templateUrl: './reminder.html',
  styleUrl: './reminder.css',
})
export class Reminder {
  private reminderService = inject(ReminderService);
  showForm = false;
  reminders = resource({ loader: () => firstValueFrom(this.reminderService.getAll()) });

  onSaved() {
    this.showForm = false;
    this.reminders.reload();
  }
}
