import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../helper.service';

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FormsModule, HttpClientModule, MatProgressSpinnerModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  showPage = false;
  fullText = 'Enter phone number To Login';
  displayText = '';
  private typingSpeed = 100;
  private typingTimer: any;
  otpMessage:string='';
  hasInput = false;
  validationError = '';
  isValid = true;
  loading = false;
  showInput = true;
  data = {
    phone:'',
    otp:''
  }
  
  countries: Country[] = [
    { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳' },
    { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
    { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
    { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
    { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺' },
    { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪' },
    { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷' },
    { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵' },
    { name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳' },
    { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷' },
  ];
  
  selectedCountry = this.countries[0];
  phoneNumber = '';
  rawInput = '';
  triggerPoint = 0;

  @ViewChild('scrollTarget') scrollTarget!: ElementRef;

  constructor(private el: ElementRef, private apiCall: AuthService) {}

  ngOnInit(): void {
    this.scrollToTop();
    this.showPage = false;
    this.displayText = '';
  }

  scrollToTop(): void {
    if (!this.hasInput && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (typeof window !== 'undefined') {
      this.triggerPoint = window.innerHeight / 10;
      const wasShowing = this.showPage;
      this.showPage = window.scrollY > this.triggerPoint;

      if (this.showPage && !wasShowing) {
        setTimeout(() => this.startTypingAnimation(), 2400);
      }
    }
  }

  startTypingAnimation(): void {
    this.displayText = '';
    let charIndex = 0;
    clearInterval(this.typingTimer);

    this.typingTimer = setInterval(() => {
      if (charIndex < this.fullText.length) {
        this.displayText += this.fullText.charAt(charIndex++);
      } else {
        clearInterval(this.typingTimer);
      }
    }, this.typingSpeed);
  }

  async onSubmit(): Promise<void> {
    this.validatePhoneNumber();
    if (!this.isValid || !this.phoneNumber) {
      this.validationError = 'Please enter a valid phone number';
      return;
    }
    const filteredPhone = `${this.selectedCountry.dialCode}${this.phoneNumber}`.replace(/\s/g, '');
    this.loading = true;
  
    try {
     if(this.data.otp == ''){ this.apiCall.login(filteredPhone).subscribe({
        next: (response) => {
          if (response?.message) {
            this.showInput = false;
            this.otpMessage = response.message;
            this.clearValidationError(); 
          }
        },
        error: (error) => {
          console.error('API call failed:', error);
          this.validationError = 'Something went wrong. Please try again.'; 
        }
      });}else{
        this.apiCall.verifyOtp(this.data.phone,this.data.otp).subscribe({next:(response)=>{console.log(response,'verify otp')}})
      }
    } catch (error) {
      console.error('API call failed:', error);
      this.validationError = 'Something went wrong. Please try again.';
    } finally {
      this.loading = false;
    }
  }
  
  

  onCountryChange(event: Event): void {
    const countryCode = (event.target as HTMLSelectElement)?.value;
    const found = this.countries.find(country => country.code === countryCode);
    if (found) {
      this.selectedCountry = found;
    }
  }

  onInputChange(event: Event, type: string): void {
    const inputValue = (event.target as HTMLInputElement)?.value || '';

    if (type === 'phone') {
      this.rawInput = inputValue;
      this.validatePhoneNumber();
      
      // Update the data object for phone number
      this.data.phone = `${this.selectedCountry.dialCode}${this.phoneNumber}`.replace(/\s/g, '');
    } else if (type === 'otp') {
      this.data.otp = inputValue;  // Store OTP value in data.otp
    }
console.log(this.data,'data')
    if (this.scrollTarget) {
      this.rawInput.length > 0 
        ? disableBodyScroll(this.scrollTarget.nativeElement) 
        : enableBodyScroll(this.scrollTarget.nativeElement);
    }
  }

  validatePhoneNumber(): void {
    if (this.rawInput && !/^\d*$/.test(this.rawInput)) {
      this.validationError = 'Only numbers are allowed';
      this.isValid = false;
      this.phoneNumber = this.rawInput.replace(/\D/g, '');
    } else {
      this.phoneNumber = this.rawInput;
      this.clearValidationError();
    }
    this.hasInput = this.phoneNumber.length > 0;
  }

  clearValidationError(): void {
    this.validationError = '';
    this.isValid = true;
  }

  @HostListener('window:beforeunload')
  onBeforeUnload(): void {
    if (typeof window !== 'undefined' && !this.hasInput) {
      window.scrollTo(0, 0);
    }
  }
}