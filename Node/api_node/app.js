const express = require( 'express' );
const cors = require( 'cors' );
// const bodyParser = require( 'body-parser' );
const Usuario = require( './models/usuario' );

const app = express();
// Configuración de CORS
app.use( cors() );
app.use( express.json() );
// app.use( bodyParser.json() );

// Sincronizar el modelo con la base de datos
Usuario.sync().then( () => console.log( 'Tabla de usuarios creada o sincronizada' ) );

// Rutas de la API

// Obtener todos los usuarios
app.get( '/usuarios', async ( req, res ) =>
{
    try
    {
        const usuarios = await Usuario.findAll();
        res.status( 200 ).json( usuarios );
    } catch ( error )
    {
        res.status( 500 ).json( { error: error.message } );
    }
} );

// Obtener un usuario por ID
app.get( '/usuarios/:id', async ( req, res ) =>
{
    try
    {
        const usuario = await Usuario.findByPk( req.params.id );
        if ( usuario )
        {
            res.status( 200 ).json( usuario );
        } else
        {
            res.status( 404 ).json( { error: 'Usuario no encontrado' } );
        }
    } catch ( error )
    {
        res.status( 500 ).json( { error: error.message } );
    }
} );

// Crear un nuevo usuario
app.post( '/usuarios', async ( req, res ) =>
{
    const { nombre, email, rol } = req.body;
    try
    {
        const nuevoUsuario = await Usuario.create( { nombre, email, rol } );
        res.status( 201 ).json( nuevoUsuario );
    } catch ( error )
    {
        res.status( 400 ).json( { error: error.message } );
    }
} );

// Actualizar un usuario existente
app.put( '/usuarios/:id', async ( req, res ) =>
{
    const { nombre, email, rol } = req.body;
    try
    {
        const usuario = await Usuario.findByPk( req.params.id );
        if ( usuario )
        {
            usuario.nombre = nombre || usuario.nombre;
            usuario.email = email || usuario.email;
            usuario.rol = rol || usuario.rol;
            await usuario.save();
            res.status( 200 ).json( usuario );
        } else
        {
            res.status( 404 ).json( { error: 'Usuario no encontrado' } );
        }
    } catch ( error )
    {
        res.status( 400 ).json( { error: error.message } );
    }
} );

// Eliminar un usuario
app.delete( '/usuarios/:id', async ( req, res ) =>
{
    try
    {
        const usuario = await Usuario.findByPk( req.params.id );
        if ( usuario )
        {
            await usuario.destroy();
            res.status( 200 ).json( { mensaje: 'Usuario eliminado' } );
        } else
        {
            res.status( 404 ).json( { error: 'Usuario no encontrado' } );
        }
    } catch ( error )
    {
        res.status( 500 ).json( { error: error.message } );
    }
} );

// Iniciar el servidor
const PORT = 5000;
app.listen( PORT, () =>
{
    console.log( `Servidor corriendo en http://localhost:${ PORT }` );
} );
