import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { Stays } from '../../services/stays';
import { StayDto } from '../../types/stayDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-stay',
  imports: [DatePickerModule, CommonModule, ReactiveFormsModule],
  templateUrl: './new-stay.html',
  styleUrl: './new-stay.css',
})
export class NewStay {
  date: Date | undefined;

  stayService = inject(Stays);
  router = inject(Router);

  stayForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
  });
  onSubmit() {
    console.log(this.stayForm.value);
    if (this.stayForm.valid) {
      const stayDto: StayDto = {
        title: this.stayForm.value.title!,
        startDate: this.formatDate(this.stayForm.value.startDate! as unknown as Date),
        endDate: this.formatDate(this.stayForm.value.endDate! as unknown as Date),
      };
      console.log('🚀 ~ NewStay ~ onSubmit ~ stayDto:', stayDto);
      this.stayService.createStay(stayDto).subscribe({
        next: (response) => {
          console.log('Stay created successfully', response);
          // Optionally, reset the form or navigate to another page
          this.stayService.stays.reload();
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error creating stay', error);
          // Optionally, display an error message to the user
        },
      });
    } else {
      console.error('Form is invalid');
      // Optionally, display validation errors to the user
    }
  }

  formatDate(date: Date): string {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
