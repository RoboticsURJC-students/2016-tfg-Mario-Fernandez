import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AlumnoScheme } from './alumno';

@Component({
  selector: 'signupalumno',
  templateUrl: './src/signupalumno/signupalumno.html',
  styleUrls: [ './src/signupalumno/signupalumno.css' ]
})

export class SignupAlumno {

  model = new AlumnoScheme('', '', '', '', new Date(''));

  constructor(public router: Router, public http: Http) {
  }

  registrar(description: AlumnoScheme) {
    let url = 'http://localhost:3001/registeralumno';
    let body = JSON.stringify(description);
    let headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    console.log(body);
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

  login(event) {
    event.preventDefault();
    this.router.navigate(['/alumno']);
  }

}
