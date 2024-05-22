const express = require("express");
const router = express.Router();

// Controllers
const clienteController = require("../controllers/clienteController");
const productosController = require("../controllers/productosController");
const pedidosController = require("../controllers/pedidosController");
const usuariosController = require("../controllers/usuariosController");

// middleware de autenticacion
const auth = require("../middleware/auth");

module.exports = function () {
  /** CLIENTES */
  // Agrega nuevos clientes via POST
  router.post("/clientes", auth, clienteController.nuevoCliente);

  // Obtener clientes
  router.get("/clientes", auth, clienteController.mostrarClientes);

  // Mostrar un cliente en especifico x id
  router.get("/clientes/:clienteId", auth, clienteController.buscarCliente);

  // Actualizar Cliente
  router.put("/clientes/:clienteId", auth, clienteController.actualizarCliente);

  // Actualizar Cliente
  router.delete(
    "/clientes/:clienteId",
    auth,
    clienteController.eliminarCliente
  );

  /** PRODUCTOS */
  // nuevos productos
  router.post("/productos",
        auth,
        productosController.subirArchivo,
        productosController.nuevoProducto
    );

  // Mostrar los productos
  router.get("/productos", 
        auth, 
        productosController.mostrarProductos
    );

  // Mostrar un producto
  router.get(
    "/productos/:idProducto",
    auth,
    productosController.mostrarProducto
  );

  // Actualizar Producto
  router.put(
    "/productos/:idProducto",
    auth,
    productosController.subirArchivo,
    productosController.actualizarProducto
  );

  // Eliminar Producto
  router.delete(
    "/productos/:idProducto",
    auth,
    productosController.eliminarProducto
  );

  // Busqueda de productos
  router.post(
    "/productos/busqueda/:query",
    productosController.buscarProducto
  );

  /** PEDIDOS */
  // Agrega nuevos pedidos
  router.post("/pedidos", 
        auth,
        pedidosController.nuevoPedido
    );

  // Mostrar todos los pedidos
  router.get("/pedidos", 
        auth,
        pedidosController.mostrarPedidos
    );

  // Mostrar un pedido (ID)
  router.get("/pedidos/:idPedido", 
        auth,
        pedidosController.mostrarPedido
    );

  // Actualizar pedido
  router.put("/pedidos/:idPedido", 
        auth,
        pedidosController.actualizarPedido
    );

  // Eliminar pedido
  router.delete("/pedidos/:idPedido", 
        auth,
        pedidosController.eliminarPedido
    );

  /** USUARIOS */
  // Crear nuevo Usuario
  router.post("/crear-cuenta", 
        usuariosController.crearCuenta
    );

  // Iniciar Sesion
  router.post("/iniciar-sesion", 
        usuariosController.autenticarUsuario
    );

  return router;
};
