var _       = require('lodash'),
    config  = require('../config'),
    jwt     = require('jsonwebtoken'),
    mongoose = require('mongoose');

var DataAlumno = mongoose.model('Alumno');
var AlumnoScheme  = mongoose.model('LoginAlumno');

function createToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresInMinutes: 1 });
}

exports.registeralumno = function(req, res) {
	console.log('POSTCACA');
	console.log(req.body);

  var datos = new DataAlumno(
  { nombre: req.body.nombre,
    apellidos:    req.body.apellidos,
    edad:         req.body.edad });

	var alumno = new AlumnoScheme(
  { email:       req.body.email,
    password:     req.body.password,
    data : datos});

  //comprobar si el Nick ya existe
  AlumnoScheme.find( { "email": req.body.email }, function(err, data) {
    console.log(data);
    if (data.length == 0){
      if (!req.body.email || !req.body.password) {
        res.status(400).send("You must send the username and the password");
      }else{
        alumno.save(function(err, datasave) {
          if(err) return res.send(500, err.message);
          var profile = _.pick(req.body, 'email', 'password', 'extra');
          profile.id = datasave._id;
          res.status(201).send({ id_token: createToken(profile) });
        });
        datos.save(function(err, datasave) {
          if(err) return res.send(500, err.message);
          console.log(datasave);
        });
      }
    }else{
        res.status(400).send("A user with that username already exists");
    }
  });
};

exports.loginalumno = function(req, res) {
  AlumnoScheme.find({"email" : req.body.email}, function(err, login) {
    if (login.length != 0){
      DataAlumno.populate(login, {path: "data"},function(err, libros){
        console.log(libros);
        var profile = _.pick(req.body, 'email', 'password', 'extra');
        profile.Nombre = libros[0].data.nombre;
        profile.Apellidos = libros[0].data.apellidos;
        profile.Edad = libros[0].data.edad;
        res.status(201).send({ id_token: createToken(profile) });
      });
    }else{
      res.status(401).send("The username or password don't match");
    }
  });
};
