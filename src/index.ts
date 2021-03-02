import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import indexRoutes from './routes/indexRoutes';
import productosRoutes from './routes/ProductosRoutes';

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
        this.app.use('/api/mobiLiqueur', productosRoutes);
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Servidor corriendo en el puerto:', this.app.get('port'));
        });
    }

}

const server = new Server();
server.start();