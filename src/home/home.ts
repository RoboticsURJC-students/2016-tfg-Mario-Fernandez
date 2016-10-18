import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { DataAlumno } from './dataalumno';
import { DataProfesor } from './dataprofesor';


declare var google: any;

@Component({
  selector: 'home',
  templateUrl: './src/home/home.html',
  styleUrls: [ './src/home/home.css' ]
})

export class Home implements OnInit{
  jwt: string;
  decodedJwt: DataAlumno;
  dir: string= '';
  profesores: DataProfesor[] = [];
  alumno = new DataAlumno('', '', new Date(''), '', {lat: 40.416775, lng: -3.7037901999999576});
  address : string = 'Madrid';

  constructor(public router: Router, public http: Http, public authHttp: AuthHttp) {
    this.jwt = localStorage.getItem('id_token');
    this.decodedJwt = this.jwt && jwt_decode(this.jwt);
    console.log(this.decodedJwt);
  }

  ngOnInit(){
    this.alumno.loc.lat = this.alumno.loc.lat;
    this.alumno.loc.lng = this.alumno.loc.lng;
  }

  getcoors(address: string) {
      console.log(address);
      console.log('Getting Address - ', address);
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, (results, status) => {
        this.alumno.loc.lat = results[0].geometry.location.lat();
        this.alumno.loc.lng = results[0].geometry.location.lng();
        console.log('lat: ' + this.alumno.loc.lat + ', long:'  + this.alumno.loc.lng);
      });
  }

  getallprof() {
    let url = 'http://localhost:3001/profesores';
    this.http.get(url).
      subscribe(
        response => {
          this.profesores = response.json();
          console.log(this.profesores);
        },
        error => {
          alert(error.text());
          console.log(error.text());
        }
      );
  }

  logout() {
    localStorage.removeItem('id_token');
    this.router.navigate(['/login']);
  }
}
