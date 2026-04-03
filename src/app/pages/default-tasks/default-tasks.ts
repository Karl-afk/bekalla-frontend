import { Component, computed, effect, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { CreateDefaultTask, DefaultTasksService } from '../../services/default-tasks-service';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Task } from '../../types/Task';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-default-tasks',
  imports: [
    ButtonModule,
    InputTextModule,
    SelectModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    InputNumberModule,
  ],
  templateUrl: './default-tasks.html',
  styleUrl: './default-tasks.css',
})
export class DefaultTasks {
  private defaultTasksService = inject(DefaultTasksService);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  selectOptions = [{ name: 'departure' }, { name: 'shopping' }];

  defaultTasks = computed(() => {
    if (this.defaultTasksService.defaultTasks.hasValue()) {
      return this.defaultTasksService.defaultTasks.value().defaultTasks;
    }
    return [];
  });

  newTaskForm = this.fb.group({
    title: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    category: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    isDone: this.fb.control(false, { nonNullable: true }),
    amount: this.fb.control(null),
  });

  form = this.fb.group({
    defaultTasks: this.fb.array<FormGroup>([]),
  });

  get tasksArray(): FormArray {
    return this.form.get('defaultTasks') as FormArray;
  }

  constructor() {
    effect(() => {
      if (this.defaultTasksService.defaultTasks.hasValue()) {
        const tasks = this.defaultTasksService.defaultTasks.value().defaultTasks;

        this.tasksArray.clear();
        tasks.forEach((task) => {
          this.tasksArray.push(this.createTaskGroup(task));
        });
      }
    });
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
    console.log('🚀 ~ DefaultTasks ~ addTask ~ this.newTaskForm.errors:', this.newTaskForm.invalid);
    if (this.newTaskForm.errors) {
    }
    const newTask: CreateDefaultTask = this.newTaskForm.getRawValue();
    this.defaultTasksService.create(newTask).subscribe(() => {
      this.defaultTasksService.defaultTasks.reload();
      this.newTaskForm.reset();
    });
  }

  removeTask(index: number, id: string) {
    this.tasksArray.removeAt(index);
    this.defaultTasksService.delete(id).subscribe((v) => {});
  }
  save(index: number, id: string) {
    if (this.form.valid) {
      const updatedTask: CreateDefaultTask = this.tasksArray.controls.at(index)?.getRawValue();
      this.defaultTasksService.update(id, updatedTask).subscribe((res) => {
        console.log('🚀 ~ DefaultTasks ~ save ~ res:', res);
        this.defaultTasksService.defaultTasks.reload();
      });
    }
  }
}
