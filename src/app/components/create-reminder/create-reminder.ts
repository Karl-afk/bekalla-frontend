import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ReminderFrequency,
  ReminderService,
  CreateReminder as CreateReminderDto,
} from '../../services/reminder.service';
import { ToastService } from '../../services/toast-service';
// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';

const WEEKDAYS = [
  { label: 'Montag', value: '1' },
  { label: 'Dienstag', value: '2' },
  { label: 'Mittwoch', value: '3' },
  { label: 'Donnerstag', value: '4' },
  { label: 'Freitag', value: '5' },
  { label: 'Samstag', value: '6' },
  { label: 'Sonntag', value: '0' },
];

const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => ({
  label: `${i + 1}. des Monats`,
  value: String(i + 1),
}));

const FREQUENCIES = [
  { label: 'Einmalig', value: 'once' },
  { label: 'Täglich', value: 'daily' },
  { label: 'Wöchentlich', value: 'weekly' },
  { label: 'Monatlich', value: 'monthly' },
];

@Component({
  selector: 'app-create-reminder',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    ToggleSwitchModule,
    TextareaModule,
  ],
  templateUrl: './create-reminder.html',
  styleUrl: './create-reminder.css',
})
export class CreateReminder {
  private fb = inject(FormBuilder);
  private service = inject(ReminderService);
  private toast = inject(ToastService);

  saved = output<void>();
  cancelled = output<void>();

  loading = false;
  today = new Date();

  frequencies = FREQUENCIES;
  weekdays = WEEKDAYS;
  monthDays = MONTH_DAYS;

  form = this.fb.group({
    title: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    body: this.fb.control('', { nonNullable: true }),
    frequency: this.fb.control<ReminderFrequency | null>(null, [Validators.required]),
    scheduleValue: this.fb.control<string | null>(null),
    time: this.fb.control<Date | null>(null, [Validators.required]),
    isActive: this.fb.control(true, { nonNullable: true }),
  });

  constructor() {
    // Bei Frequenz-Wechsel: scheduleValue zurücksetzen + Validierung anpassen
    this.form.get('frequency')?.valueChanges.subscribe((freq) => {
      const ctrl = this.form.get('scheduleValue')!;
      ctrl.reset();

      if (freq === 'weekly' || freq === 'monthly' || freq === 'once') {
        ctrl.setValidators([Validators.required]);
      } else {
        ctrl.clearValidators();
      }
      ctrl.updateValueAndValidity();
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const value = this.form.getRawValue();

    // Zeit zu "HH:mm" String umwandeln
    const timeDate = value.time as unknown as Date;
    const time = `${timeDate.getHours().toString().padStart(2, '0')}:${timeDate.getMinutes().toString().padStart(2, '0')}`;

    // Datum bei "once" zu ISO-String umwandeln
    let scheduleValue: any = value.scheduleValue;
    if (value.frequency === 'once' && scheduleValue instanceof Date) {
      scheduleValue = scheduleValue.toISOString().split('T')[0]; // "2026-04-15"
    }

    const payload: CreateReminderDto = {
      title: value.title,
      body: value.body,
      frequency: value.frequency as ReminderFrequency,
      scheduleValue: scheduleValue ?? null,
      time,
      isActive: value.isActive,
    };

    this.service.create(payload).subscribe({
      next: () => {
        this.toast.showSuccess('Reminder gespeichert!');
        this.loading = false;
        this.saved.emit();
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
