// Importación de módulos necesarios
const express = require( 'express' );         // Framework para construir aplicaciones web y APIs en Node.js
const cookieParser = require( 'cookie-parser' ); // Middleware para analizar cookies en las solicitudes
const bodyParser = require( 'body-parser' );     // Middleware para analizar datos en el cuerpo de las solicitudes
const morgan = require( 'morgan' );              // Middleware para registrar solicitudes HTTP en el servidor
const routes = require( './routes/index.js' );   // Archivo que contiene las rutas de la API

// Creación de la instancia de servidor con Express
const server = express();
server.name = 'API';  // Nombre del servidor, útil para identificar en logs o errores

// Middlewares de análisis de solicitudes
server.use( express.json() );  // Analiza solicitudes con cuerpo en JSON de forma nativa en Express

// Analiza datos URL-encoded (como datos de formularios), permitiendo objetos complejos y con límite de 50 MB
server.use( bodyParser.urlencoded( { extended: true, limit: '50mb' } ) );

// Analiza datos JSON, también con límite de 50 MB para manejar grandes cantidades de datos
server.use( bodyParser.json( { limit: '50mb' } ) );

// Analiza cookies en las solicitudes, útil para manejar autenticación y datos de sesión
server.use( cookieParser() );

// Registra las solicitudes HTTP en la consola con detalles como el método, URL y código de estado, útil para depuración
server.use( morgan( 'dev' ) );

// Middleware para configurar políticas de CORS (Cross-Origin Resource Sharing)
server.use( ( req, res, next ) =>
{
    res.header( 'Access-Control-Allow-Origin', 'http://localhost:5173' ); // Permite solicitudes desde un dominio específico (en este caso, localhost en el puerto 5173)
    res.header( 'Access-Control-Allow-Credentials', 'true' );             // Permite el uso de cookies y credenciales en solicitudes
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' ); // Define los encabezados permitidos en solicitudes
    res.header( 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE' ); // Define los métodos HTTP permitidos
    next(); // Llama al siguiente middleware o ruta
} );

// Usa el archivo de rutas definido en './routes/index.js'
server.use( routes );

// Middleware de manejo de errores
server.use( ( err, req, res, next ) =>
{
    const status = err.status || 500;     // Si el error tiene un código de estado, lo usa; de lo contrario, responde con 500 (Error interno)
    const message = err.message || err;   // Usa el mensaje de error proporcionado o el error en sí
    console.error( err );                   // Registra el error en la consola para revisión
    res.status( status ).send( message );     // Envía el mensaje de error y el código de estado al cliente
} );

// Exporta el servidor para que pueda ser utilizado en otros archivos, como en el archivo principal que lo ejecutará
module.exports = server;
