const Productos = require('../models/Productos');
const { unlink } =require('fs');
const multer = require('multer');
const fs = require('fs');
const {nanoid} = require('nanoid')

const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../uploads/');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${nanoid()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Formato no válido'))
        }
    }
}

// Pasar la configiguración y el campo
const upload = multer(configuracionMulter).single('imagen');

// Subir archivo
exports.subirArchivo = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            res.json({ mensaje: error })
        }
        return next();
    })
}


// Agrega nuevos Productos
exports.nuevoProducto = async(req,res,next)=>{
    const producto = new Productos(req.body);
    try {
        if(req.file.filename){
            producto.imagen = req.file.filename
        }
        // guardar el registro  
        await producto.save();
        res.json({ mensaje: ' Producto agregado correctamente'})
    } catch (error) {
        console.log(error);
        next();
    }
}

exports.mostrarProductos = async (req,res,next) =>{
    try {
        const productos = await Productos.find({});
        res.json(productos)
        
    } catch (error) {
        console.log(error);
        next();
    }

}



exports.mostrarProducto = async (req,res,next) =>{
    const producto = await Productos.findById(req.params.idProducto);

    if(!producto){
        res.json({mensaje:'Ese producto no existe'})
        return next()
    };
    // mostrar producto
    res.json(producto)
        
}


exports.actualizarProducto = async (req,res,next) =>{
    try {
        // seleccionar producto
        let productoAnterior = await Productos.findById(req.params.idProducto);

        //construir nuevo producto
        let nuevoProducto = req.body;

        //verificar si hay imagen nueva
        if(req.file){
            nuevoProducto.imagen = req.file.filename;
            const imagenAnteriorPath = __dirname+`/../uploads/${productoAnterior.imagen}`
            unlink(imagenAnteriorPath, (error) => {
                if (error) {
                return console.log(error)
                }
            })
        } else {
            nuevoProducto.imagen = productoAnterior.imagen;
        }

        let producto = await Productos.findOneAndUpdate({_id: req.params.idProducto}, nuevoProducto,{
            new: true,
        });
        
        // mostrar producto
        await res.json({mensaje:'Se ha actualizado la informacion de este producto',producto})
            
    } catch (error) {
        console.log(error);
        next();
    }

}

// Eliminar Producto
exports.eliminarProducto = async (req,res,next) =>{
    try {
        await Productos.findOneAndDelete({ _id: req.params.idProducto});
        
        res.json({mensaje: 'Producto Eliminado'})
    } catch (error) {
        console.log(error);
    }


    // mostrar mensaje
        
}

exports.buscarProducto = async (req,res,next)=>{
    try {
        // obtener el query
        const { query } = req.params;
        const producto = await Productos.find({ nombre: new RegExp(query, 'i')});
        res.json(producto);
    } catch (error) {
        console.log(error);
        next();
    }
}