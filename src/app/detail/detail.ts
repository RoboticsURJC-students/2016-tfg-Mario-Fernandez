import { Component} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import {ProfesorScheme} from '../models/profesores';
import { Http, Headers, RequestOptions } from '@angular/http';
import * as io from 'socket.io-client';

const URL = 'https://www.classcity.tk/app/uploads/';

@Component({
  selector: 'detail',
  templateUrl: './detail.html',
  styleUrls: [ './detail.css' ]
})

export class ProfesorDetail {

  profesor: ProfesorScheme;
  imgsrc: string;
  socket = null;
  message = '';
  conversation = [];
  jwt: string;
  decodedJwt: Data;
  id: string;
  jwtHelper: JwtHelper = new JwtHelper();
  aceptado: boolean = false;

  constructor(public route: ActivatedRoute, public authHttp: AuthHttp,
     private http: Http) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.id = params['id'];
      this.getdata(this.id);
    });
    this.socket = io('https://wwww.classcity.tk/socket');
    this.jwt = localStorage.getItem('id_token');
    this.decodedJwt = this.jwt && this.jwtHelper.decodeToken(this.jwt);
    console.log(this.decodedJwt);
    this.socket.emit('room', {'roomName': this.id, 'userName': this.decodedJwt.id.nombre});

    this.socket.on('intro', function(data) {
            this.conversation.push(data);
    }.bind(this));

    this.socket.on('message', function(data) {
           this.conversation.push(data);
    }.bind(this));

    this.socket.on('client left', function(data) {
           this.conversation.push(data);
    }.bind(this));

  }

  notification() {
    let peticion = document.getElementById('peticion');
    let solicitud = document.getElementById('solicitud');
    solicitud.style.visibility = 'hidden';
    peticion.style.visibility = 'inherit';
    let url = 'https://www.classcity.tk/app/notification';
    console.log(this.decodedJwt);
    let body = (<any>Object).assign(this.decodedJwt, this.profesor);
    console.log(this.decodedJwt);
    console.log(this.profesor);
    console.log(body);
    let headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this.http.post(url, body, options)
      .subscribe(
        response => {
           console.log(response);
         },
         error => {
           alert(error.text());
           console.log(error.text());
         }
      );
  }

  getdata(id: string) {
  let url = 'https://www.classcity.tk/app/detail/' + id; 
  let body = {'body': 'GET'};
  let headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
  let options = new RequestOptions({ headers: headers });
  this.http.post(url, body, options)
    .subscribe(
      response => {
        this.profesor = response.json();
        this.imgsrc = 'https://www.classcity.tk/app/' +  response.json().path;
        console.log(this.profesor);
        console.log("^^^^^^", response.json().notification);
        console.log(this.decodedJwt);
        this.aceptado = this.estasaceptado(response.json().notification);
        console.log(this.aceptado);
      },
      error => {
        alert(error.text());
        console.log(error.text());
      }
    );
  }

  estasaceptado(array){
      for (let item of array) {
        if(item.alumno === this.decodedJwt.id._id){
          return item.leido;
        }
      }
      return false;
  }

  send() {
        this.socket.emit('newMessage', {
            'userName': this.decodedJwt.id.nombre,
            'text': this.message
        });
        this.message = '';
    }

  keypressHandler(event) {
       if (event.keyCode === 13) {
           this.send();
       }
   }
}

interface Data {
  Email: string;
  id: {
    _id: string,
    apellidos: string,
    asignaturas: string,
    curso: string,
    edad: string,
    location: { lat: number, lng: number}
    nombre: string,
    path: string
  };
}
