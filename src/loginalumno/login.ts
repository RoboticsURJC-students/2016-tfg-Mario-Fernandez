import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { contentHeaders } from '../common/headers';
import { AlumnoScheme } from './alumno';

@Component({
  selector: 'login',
  templateUrl: './src/loginalumno/login.html',
  styleUrls: [ './src/loginalumno/login.css' ]
})
export class LoginAlumno {

  model = new AlumnoScheme('', '');

  submitted = false;

  onSubmit() { this.submitted = true; }

  constructor(public router: Router, public http: Http) {  }

  login(description: AlumnoScheme) {
    let url = 'http://localhost:3001/loginalumno';
    let body = JSON.stringify(description);
    let headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this.http.post(url, body, options)
      .subscribe(
        response => {
          localStorage.setItem('id_token', response.json().id_token);
          this.router.navigate(['/home']);
          console.log(response.json());
        },
        error => {
          alert(error.text());
          console.log(error.text());
        }
      );
  }

  signup(event) {
    event.preventDefault();
    this.router.navigate(['/signualumno']);
  }
}
