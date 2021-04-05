import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import indexRoutes from './routes/indexRoutes';
import productosRoutes from './routes/ProductosRoutes';
import userRoutes from './routes/userRoutes';
import rolRoutes from './routes/rolRoutes';
import clienteRoutes from './routes/clienteRoutes';
import comboRoutes from './routes/comboRoutes';
import promotionRoutes from './routes/promocionRoutes';
import ventaRoutes from './routes/ventaRoutes';

class Server {

    public app: Application;
    
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    //Configuracion de puerto
    config(): void {
        this.app.set('port', process.env.PORT || 3000);

        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
    }
    //Configuracion de rutas del servidor Microservicios.
    routes(): void {
        this.app.use('/', indexRoutes);
        this.app.use('/api/producto', productosRoutes);
        this.app.use('/api/user', userRoutes);
        this.app.use('/api/cliente', clienteRoutes);
        this.app.use('/api/rol', rolRoutes);
        this.app.use('/api/venta', ventaRoutes);
        this.app.use('/api/promocion', promotionRoutes);
        this.app.use('/api/combo', comboRoutes);
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Servidor corriendo en el puerto:', this.app.get('port'));
        });
    }

}

const server = new Server();
server.start();