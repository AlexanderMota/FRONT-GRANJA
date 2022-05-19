import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  vis = "";
  title = 'FRONT-GRANJA';
  
  setVis(vis:string){
    this.vis = vis;
  }
  
}
