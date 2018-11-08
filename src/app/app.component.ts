import { Component } from '@angular/core';
import { FileService } from './services/file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'foxintelligence-test';

  file;
    
  constructor(private fileService: FileService) { }

  showResult() {
      this.fileService.getResult().subscribe( data => this.file = data );
  }
}
