import { json, urlencoded } from 'express';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/cart-routes.js';
import viewsRouter from './routes/views.routes.js'
import handlebars from 'express-handlebars';
import __dirName from './utils.js';
import { Server } from 'socket.io';
import express from 'express';

const app = express();

const port = 8080;

const httpServer = app.listen( port, ()=>{ console.log('Corriendo en el servidor ' + port) } );

const socketServer = new Server( httpServer );

app.use(json());
app.use(urlencoded({ extended: true }));

app.engine( 'handlebars', handlebars.engine() );
app.set('views', __dirName + '/views');
app.set('view engine', 'handlebars');
app.use(express.static( __dirName + '/public'))

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter)

socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('message', data => {
        console.log(data);
    })
} )

