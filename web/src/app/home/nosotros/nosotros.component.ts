import { Component } from '@angular/core';
import { ScriptsService } from '../../services/scripts.service';

@Component({
  selector: 'app-nosotros',
  standalone: false,
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent {

  constructor(
    private scripts_service: ScriptsService
  ) {
    this.scripts_service.main();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
}
