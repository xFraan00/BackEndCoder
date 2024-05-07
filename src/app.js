import { json, urlencoded } from 'express';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/cart-routes.js';
import viewsRouter from './routes/views.routes.js'
import handlebars from 'express-handlebars';
import __dirName from './utils.js';
import { Server } from 'socket.io';
import express from 'express';
import { ProductManager } from './Classes/product-functions.js'; 

const app = express();
const port = 8080;
const httpServer = app.listen(port, () => { console.log('Corriendo en el servidor ' + port) });
const socketServer = new Server(httpServer);


const productMngr = new ProductManager('./products.json');

app.use(json());
app.use(urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirName + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirName + '/public'))

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter)

socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado");

    productMngr.getProducts()
    .then((productos) => {
        socket.emit('productos', productos);
    })

    socket.on('nuevoProducto', producto => {
        productMngr.addProduct(producto.code, producto.title, producto.description, producto.price, [], producto.stock)
        .then(() => {
            productMngr.getProducts()
            .then((productos) => {
                socket.emit('productos', productos);
                socket.emit('respuestaAdd', "Producto agregado");
            })            
        })
        .catch((error) => socket.emit('respuestaAdd', "Error al agregar el producto: " + error.message))
    });
    
    socket.on('eliminarProducto', pid => {
        productMngr.deleteProduct(pid)
        .then(() => {
            productMngr.getProducts()
            .then((productos) => {
                socket.emit('productos', productos);
                socket.emit('respuestaDelete', "Producto eliminado");
            })            
        })
        .catch((error) => socket.emit('respuestaDelete', "Error al eliminar el producto: " + error.message))
    })
})
