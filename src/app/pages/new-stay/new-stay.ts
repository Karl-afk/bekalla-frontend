import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { Stays } from '../../services/stays';
import { StayDto } from '../../types/stayDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-stay',
  imports: [DatePickerModule, CommonModule, ReactiveFormsModule, ButtonModule],
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
        startDate: this.stayService.formatDate(this.stayForm.value.startDate! as unknown as Date),
        endDate: this.stayService.formatDate(this.stayForm.value.endDate! as unknown as Date),
      };
      this.stayService.createStay(stayDto).subscribe({
        next: (response) => {
          console.log('Stay created successfully', response);
          // Optionally, reset the form or navigate to another page
          this.stayService.stays.reload();
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error creating stay', error);
        },
      });
    } else {
      console.error('Form is invalid');
    }
  }
}
