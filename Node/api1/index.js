const server = require("./src/app.js")


const PORT = 3000;

server.get( '/', ( req, res ) =>
{
    res.send( '¡Hola, mundo!' );
} );

server.listen( PORT, () =>
{
    console.log( `Servidor escuchando en http://localhost:${ PORT }` );
} );


