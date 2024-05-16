const Clientes = require('../models/Clientes');
const Productos = require('../models/Productos');
const Pedidos = require('../models/Pedidos');

// Agregar nuevo pedido
exports.nuevoPedido = async (req,res,next)=>{
    const pedido = new Pedidos(req.body);

    try {
        await pedido.save();
        res.json({mensaje:'Se ha realizado un pedido'});
    } catch (error) {
        console.log(error);
    }
}

// Mostrar todos los pedidos
exports.mostrarPedidos = async (req,res,next)=>{
    try {
        const pedidos = await Pedidos.find({}).populate('cliente').populate({
            path:'pedido.producto',
            model: 'Productos'
        });
        res.json(pedidos)
    } catch (error) {
        console.log(error);
        next();
    }
}

// Mostrar un solo pedido (ID)
exports.mostrarPedido = async (req,res,next)=>{
    const pedido = await Pedidos.findById(req.params.idPedido).populate('cliente').populate({
        path:'pedido.producto',
        model: 'Productos'
    });
    if(!pedido){
        res.json({mensaje:'Ese Pedido no existe'})
        return next();
    }
    res.json(pedido)

}

// Actualizar pedido
exports.actualizarPedido = async (req,res,next)=>{
    
    try {
        const nuevoPedido = req.body
        let pedido = await Pedidos.findOneAndUpdate({_id: req.params.idPedido },nuevoPedido,{
            new: true
        })
        .populate('cliente')
        .populate({
            path:'pedido.producto',
            model: 'Productos'
        });
        
        // Si el pedido no existe
        if (!pedido) {
            res.json({mensaje:'Pedido inexistente'})
            next();
        }
        // mostrar producto
        await res.json({mensaje:'Se ha actualizado la informacion de este producto',pedido})


    } catch (error) {
        console.log(error);
        next();
    }

}

// Eliminar pedido
exports.eliminarPedido = async (req,res,next) =>{
    try {
        await Pedidos.findOneAndDelete({_id: req.params.idPedido })
        res.json({mensaje:'Pedido eliminado'})
    } catch (error) {
        console.log(error);
        next();
    }

}