import { Component } from '@angular/core';

@Component({
  selector: 'app-no-data',
  standalone: true,
  imports: [],
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.css'
})
export class NoDataComponent {

  DesertIllustration = "assets/images/no-data-desert.svg";

  constructor() { }

}
