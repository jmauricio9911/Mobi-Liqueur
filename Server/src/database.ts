import mysql from 'promise-mysql';

import keys from './keys';

const pool = mysql.createPool(keys.database);
//Conexion de base de datos mysql.
pool.getConnection()
    .then(connection => {
        pool.releaseConnection(connection);
        console.log('Conexion Exiitosa');
    });

export default pool;
