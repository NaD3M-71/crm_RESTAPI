const Clientes = require('../models/Clientes');

// agrega nuevo cliente
exports.nuevoCliente = async(req,res, next)=>{
    const cliente = new Clientes(req.body);

    try {
        // guardar el registro  
        await cliente.save();
        res.json({ mensaje: ' Cliente agregado correctamente'})
    } catch (error) {
        res.send(error)
        next();
    }
}

// muestra todos los clientes
exports.mostrarClientes = async (req,res, next)=>{
    try {
        const clientes = await Clientes.find({});
        res.json(clientes)
    } catch (error) {
        console.log(error);
        next();
    }
}


// Muestra el cliente buscado x id
exports.buscarCliente = async (req,res, next)=>{
    const cliente = await Clientes.findById(req.params.clienteId);
    if(!cliente){
        res.json({mensaje: 'Ese Cliente no Existe'})
    }
    
    res.json(cliente);
}

// Actualizar Cliente
exports.actualizarCliente = async (req,res, next)=>{
    try {
        const cliente = await Clientes.findOneAndUpdate({_id : req.params.clienteId}, req.body, {
            new: true
        });
        
        if(!cliente){
            res.json({mensaje: 'Ese Cliente no Existe'})
        }
        
        res.json(cliente);
    } catch (error) {
        console.log(error);
        next();
    }
}

// Eliminar Cliente
exports.eliminarCliente = async (req,res, next)=>{
    try {
        await Clientes.findOneAndDelete({_id : req.params.clienteId});
        
        res.json({mensaje:'El Cliente se ha eliminado de la Base de datos'});

    } catch (error) {
        console.log(error);
        next();
    }
}