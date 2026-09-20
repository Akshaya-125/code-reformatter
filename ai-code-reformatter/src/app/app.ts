// import { Component, OnInit } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet],
//   template: '<router-outlet></router-outlet>'
// })
// export class AppComponent implements OnInit {

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     // Wake up both Render services when app loads
//     this.pingServices();
//   }

//   private pingServices(): void {
//     this.http.get('https://django-ai-service.onrender.com/api/health/')
//       .subscribe({ error: () => {} });
//     this.http.get('https://spring-boot-service-6hal.onrender.com/api/health')
//       .subscribe({ error: () => {} });
//   }
// }
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {}