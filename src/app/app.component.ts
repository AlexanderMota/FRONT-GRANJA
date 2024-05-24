import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LocalizationService } from './services/localization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent{

  constructor(private localizationService: LocalizationService) {}

  //vis = "";
  title = 'FRONT-GRANJA';
  

  
}
