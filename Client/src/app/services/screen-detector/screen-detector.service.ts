import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenDetectorService {
  private screenSize$ = new Subject<boolean>();

  constructor(private ngZone: NgZone) {
    this.checkScreenSize();
    window.addEventListener('resize', () => {
      this.ngZone.run(() => this.checkScreenSize());
    });
  }

  checkScreenSize() {
    const isSmallScreen = window.innerWidth < 960;
    this.screenSize$.next(isSmallScreen);
  }

  get screenSizeChanges() {
    return this.screenSize$.asObservable();
  }
}
