const { Sequelize } = require( 'sequelize' );

// Configuración de la conexión a PostgreSQL
const sequelize = new Sequelize( 'api1', 'admin', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
} );

sequelize.authenticate()
    .then( () => console.log( 'Conexión a PostgreSQL exitosa' ) )
    .catch( err => console.error( 'Error de conexión a PostgreSQL:', err ) );

module.exports = sequelize;
