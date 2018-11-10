import { Component, OnInit } from '@angular/core';
import { FileService } from './services/file.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'foxintelligence-test';
  downloadUri;
  downloadName;

  constructor(private fileService: FileService, private sanitizer: DomSanitizer) { }

  ngOnInit() { 
    this.fileService.getResult().subscribe( data => {
      const blob = window.URL.createObjectURL(new Blob([data], {type: "text/json;charset=utf-8"}));
      this.downloadUri  = this.sanitizer.bypassSecurityTrustResourceUrl(blob);
      this.downloadName = 'test-result.json';
    });
  }

}
