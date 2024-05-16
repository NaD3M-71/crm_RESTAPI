const express = require('express');
const router = require('./routes/index');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require('path');
require('dotenv').config({path:'variables.env'});

const {FRONTEND_URL,DB_URL} = process.env;


// conectar MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(DB_URL)
.then(() => console.log('MongoDB Conectado...'))
.catch((err) => console.log(err))

// Crear el servidor
const app =  express();

// static files
//app.use(express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Definir Dominios para recibir las peticiones
const whitelist = [FRONTEND_URL];
const corsOptions = {
    origin: (origin, callback) =>{
        // Revisar si la peticion viene de un server en la whitelist
        const existe = whitelist.some( dominio => dominio === origin );
        if(existe){
            callback(null,true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}

// Habilitar cors
app.use(cors());

// habilitar bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// Routing

app.use('/', router())

//host
const host =  process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 5000

// iniciar app
app.listen(port,host, ()=>{
    console.log("el servidor funciona correctamente");
})
//app.listen(5000)




//TODO: Verificar que funcione correctamente despues de agregar CORS whitelist