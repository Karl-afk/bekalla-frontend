import { Component, inject, resource } from '@angular/core';
import {
  CreateReminder,
  Reminder,
  ReminderFrequency,
  ReminderService,
} from '../../services/reminder.service';
import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast-service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
const WEEKDAYS: Record<string, string> = {
  '0': 'Sonntag',
  '1': 'Montag',
  '2': 'Dienstag',
  '3': 'Mittwoch',
  '4': 'Donnerstag',
  '5': 'Freitag',
  '6': 'Samstag',
};

const FREQUENCIES = [
  { label: 'Einmalig', value: 'once' },
  { label: 'Täglich', value: 'daily' },
  { label: 'Wöchentlich', value: 'weekly' },
  { label: 'Monatlich', value: 'monthly' },
];

const WEEKDAY_OPTIONS = Object.entries(WEEKDAYS).map(([value, label]) => ({ label, value }));
const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => ({
  label: `${i + 1}. des Monats`,
  value: String(i + 1),
}));
@Component({
  selector: 'app-reminder-list',
  imports: [
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    ToggleSwitchModule,
    TagModule,
    TextareaModule,
    ConfirmDialogModule,
    FormsModule,
  ],
  templateUrl: './reminder-list.html',
  styleUrl: './reminder-list.css',
  providers: [ConfirmationService],
})
export class ReminderList {
  private service = inject(ReminderService);
  private toast = inject(ToastService);
  private confirmSvc = inject(ConfirmationService);

  today = new Date();
  frequencies = FREQUENCIES;
  weekdayOptions = WEEKDAY_OPTIONS;
  monthDays = MONTH_DAYS;

  // Edit-State pro Row (id → Formwerte)
  editForms: Record<string, any> = {};

  remindersResource = resource({
    loader: () => firstValueFrom(this.service.getAll()),
  });

  reminders = () => this.remindersResource.value()?.reminders ?? [];

  // ─── Edit initialisieren ──────────────────────────────────────────────────
  initEdit(reminder: Reminder) {
    this.editForms[reminder.id] = {
      title: reminder.title,
      body: reminder.body,
      frequency: reminder.frequency,
      scheduleValue: reminder.scheduleValue,
      time: this.timeStringToDate(reminder.time),
      isActive: reminder.isActive,
    };
  }

  cancelEdit(reminder: Reminder) {
    delete this.editForms[reminder.id];
  }

  onFrequencyChange(id: string) {
    this.editForms[id].scheduleValue = null;
  }

  // ─── Speichern ────────────────────────────────────────────────────────────
  saveEdit(reminder: Reminder) {
    const form = this.editForms[reminder.id];
    if (!form.title || !form.frequency || !form.time) {
      this.toast.showError('Bitte alle Pflichtfelder ausfüllen');
      return;
    }

    const time =
      form.time instanceof Date
        ? `${form.time.getHours().toString().padStart(2, '0')}:${form.time.getMinutes().toString().padStart(2, '0')}`
        : form.time;

    let scheduleValue = form.scheduleValue;
    if (form.frequency === 'once' && scheduleValue instanceof Date) {
      scheduleValue = scheduleValue.toISOString().split('T')[0];
    }

    const payload: CreateReminder = {
      title: form.title,
      body: form.body ?? '',
      frequency: form.frequency,
      scheduleValue: scheduleValue ?? null,
      time,
      isActive: form.isActive,
    };

    this.service.update(reminder.id, payload).subscribe({
      next: () => {
        this.toast.showSuccess('Reminder aktualisiert');
        delete this.editForms[reminder.id];
        this.remindersResource.reload();
      },
    });
  }

  // ─── Löschen ──────────────────────────────────────────────────────────────
  confirmDelete(reminder: Reminder) {
    this.confirmSvc.confirm({
      message: `"${reminder.title}" wirklich löschen?`,
      header: 'Bestätigung',
      icon: 'pi pi-trash',
      accept: () => this.delete(reminder),
    });
  }

  delete(reminder: Reminder) {
    this.service.delete(reminder.id).subscribe({
      next: () => {
        this.toast.showSuccess('Reminder gelöscht');
        this.remindersResource.reload();
      },
    });
  }

  // ─── Hilfsfunktionen ──────────────────────────────────────────────────────
  frequencyLabel(freq: ReminderFrequency): string {
    return FREQUENCIES.find((f) => f.value === freq)?.label ?? freq;
  }

  frequencySeverity(
    freq: ReminderFrequency,
  ): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    const map: Record<string, 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast'> = {
      once: 'info',
      daily: 'warn',
      weekly: 'success',
      monthly: 'secondary',
    };
    return map[freq] ?? 'info';
  }

  scheduleLabel(reminder: Reminder): string {
    switch (reminder.frequency) {
      case 'weekly':
        return WEEKDAYS[reminder.scheduleValue ?? ''] ?? '—';
      case 'monthly':
        return `${reminder.scheduleValue}. des Monats`;
      case 'once':
        return reminder.scheduleValue ?? '—';
      default:
        return '—';
    }
  }

  timeStringToDate(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
}
