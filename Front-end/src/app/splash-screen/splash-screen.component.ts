import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})
export class SplashScreenComponent implements OnInit {
  displayedText = '';
  fullText = 'Package Tracker';
  charIndex = 0;

  ngOnInit(): void {
    this.animateText();
  }

  animateText() {
    const interval = setInterval(() => {
      if (this.charIndex < this.fullText.length) {
        this.displayedText += this.fullText[this.charIndex];
        this.charIndex++;
      } else {
        // Clear interval when the animation finishes
        clearInterval(interval);

        // Wait for 3 seconds before restarting the animation
        setTimeout(() => {
          // Reset values for the next loop
          this.charIndex = 0;
          this.displayedText = '';
          // Start the animation again
          this.animateText();
        }, 3000)
      }
    }, 150);
  }

}
