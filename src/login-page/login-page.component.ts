import { CommonModule } from '@angular/common';
import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {
  showPage: boolean = false;
  fullText: string = 'Enter phone number To Login';
  displayText: string = '';
  private typingSpeed: number = 100; 
  private typingTimer: any;
  
  constructor(private el: ElementRef) {}
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' 
    });
  }
  ngOnInit(): void {
    this.scrollToTop();
    this.showPage = false;
    this.displayText = '';
  }
  
  triggerPoint = 0;
  
  @HostListener('window:scroll', [])
  onScroll(): void {
    this.triggerPoint = window.innerHeight / 10;
    const scrollPosition = window.scrollY;
    const wasShowing = this.showPage;
    this.showPage = scrollPosition > this.triggerPoint;
    
    if (this.showPage && !wasShowing) {
      setTimeout(() => {
        this.startTypingAnimation();
      }, 2400);
    }
  }
  
  startTypingAnimation(): void {
    this.displayText = '';
    let charIndex = 0;
    if (this.typingTimer) {
      clearInterval(this.typingTimer);
    }
    
    this.typingTimer = setInterval(() => {
      if (charIndex < this.fullText.length) {
        this.displayText += this.fullText.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(this.typingTimer);
      }
    }, this.typingSpeed);
  }
}