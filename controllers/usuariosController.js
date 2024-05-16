const Usuarios =  require('../models/Usuarios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.crearCuenta = async (req,res) =>{
    // leer los datos del usuario y agregarlos al modelo
    const usuario = new Usuarios(req.body);
    usuario.password = await bcrypt.hash(req.body.password, 12);

    try {
        await usuario.save();
        res.json({mensaje: ' Usuario guardado correctamente'});
    } catch (error) {
        console.log(error);
        res.json({mensaje: 'Hubo un error'});
    }

}
exports.autenticarUsuario = async (req,res,next) =>{
    // buscar el usuario
    const { email,password } = req.body;
    const usuario = await Usuarios.findOne({ email });

    if(!usuario){
        // Si el usuario NO existe
        await res.status(401).json({mensaje: 'Ese usuario no existe'});
        next();
    } else {
        // El usuario existe, verificar password
        if(!bcrypt.compareSync(password, usuario.password)){
            // si la contraseña es incorrecta
            await res.status(401).json({mensaje: 'Contraseña Incorrecta'});
            next();
        }else {
            // Si la contraseña es correcta, crear token
            //res.json({mensaje: 'todo bien'});
            const token = jwt.sign({
                email: usuario.email,
                nombre: usuario.nombre,
                id : usuario._id
            }, 
            'LLAVESECRETA', // Esta es la secret Key que me va a pedir el cliente para autenticar, deberia ir en un .env
            {
                expiresIn: '1h'
            });

            // retornar el token
            res.json({ token });

        }
    }

}