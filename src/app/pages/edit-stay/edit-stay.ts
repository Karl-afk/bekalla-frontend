import {
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  ResourceRef,
  signal,
} from '@angular/core';
import { Stays } from '../../services/stays';
import { httpResource } from '@angular/common/http';
import { Stay } from '../../types/Stay';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../services/toast-service';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Task } from '../../types/Task';
import { UpdateStayDto } from '../../types/updateStayDto';

@Component({
  selector: 'app-edit-stay',
  imports: [
    CommonModule,
    ButtonModule,
    DatePickerModule,
    ReactiveFormsModule,
    CheckboxModule,
    InputNumberModule,
    SelectModule,
  ],
  templateUrl: './edit-stay.html',
  styleUrl: './edit-stay.css',
})
export class EditStay {
  stayService = inject(Stays);
  toastService = inject(ToastService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private fb = inject(FormBuilder);

  categories = [
    { name: 'shopping', code: 'shopping' },
    { name: 'departure', code: 'departure' },
  ];

  error = signal<string | null>(null);

  stay: ResourceRef<Stay | undefined> = httpResource(() => ({
    url: `${this.stayService.apiUrl}/stays/${this.activatedRoute.snapshot.params['id']}/tasks`,
    credentials: 'include',
  }));

  departureTasks = computed(() => {
    return this.stay.value()?.tasks.filter((task) => task.category === 'departure');
  });
  shoppingTasks = computed(() => {
    return this.stay.value()?.tasks.filter((task) => task.category === 'shopping');
  });

  stayForm = this.fb.group({
    title: this.fb.control('', { validators: [Validators.required] }),
    startDate: this.fb.control<Date | null>(null, { validators: [Validators.required] }),
    endDate: this.fb.control<Date | null>(null, { validators: [Validators.required] }),
  });

  taskForm = this.fb.group({
    tasks: this.fb.array<FormGroup>([]),
  });

  get tasksArray(): FormArray {
    return this.taskForm.get('tasks') as FormArray;
  }

  createTaskGroup(task?: Partial<Task>): FormGroup {
    return this.fb.group({
      id: this.fb.control(task?.id ?? ''),
      title: this.fb.control(task?.title ?? '', [Validators.required]),
      category: this.fb.control(task?.category ?? '', [Validators.required]),
      isDone: this.fb.control(task?.isDone ?? false),
      amount: this.fb.control<number | null>(task?.amount ?? null),
    });
  }

  addTask() {
    this.tasksArray.push(this.createTaskGroup());
  }

  removeTask(index: number) {
    this.tasksArray.removeAt(index);
  }

  constructor() {
    effect(() => {
      if (this.stay.hasValue()) {
        const stay = this.stay.value();
        this.stayForm.patchValue({
          title: stay.title,
          startDate: new Date(stay.startDate),
          endDate: new Date(stay.endDate),
        });

        this.tasksArray.clear();
        stay.tasks.forEach((task) => {
          this.tasksArray.push(this.createTaskGroup(task));
        });
      }
    });
  }

  save() {
    if (this.stayForm.invalid) return;

    const id = this.stay.value()?.id;

    const payload = {
      ...this.stayForm.getRawValue(),
      tasks: this.tasksArray.getRawValue() as Task[],
    };

    if (!id) return;

    this.stayService.update(payload, id).subscribe({
      next: () => this.toastService.showSuccess('Stay gespeichert'),
      error: () => {}, // Error Interceptor übernimmt
    });
  }

  delete() {
    if (!this.stay.hasValue()) {
      return;
    }
    this.stayService.deleteStay(this.stay.value().id).subscribe({
      next: () => {
        this.toastService.showInfo('Aufenthalt erfolgreich gelöscht');
        this.stayService.stays.reload();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.toastService.showError('Fehler beim Löschen des Aufenthalts: ' + err.message);
      },
    });
  }
}
