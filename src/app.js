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
const httpServer = app.listen( port, ()=>{ console.log('Corriendo en el servidor ' + port) } );
const socketServer = new Server( httpServer );
app.use(json());
app.use(urlencoded({ extended: true }));
app.engine( 'handlebars', handlebars.engine() );
app.set('views', __dirName + '/views')
app.set('view engine', 'handlebars')
app.use(express.static( __dirName + '/public'))
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter)

const newInstance = new ProductManager ()

socketServer.on('connection', socket => {
    newInstance.getProducts()
    .then( products => {
        socket.emit('products', products)
    })
    socket.on('addProduct', async newProductData => {
        try {
            await newInstance.addProduct(
                newProductData.title,
                newProductData.description,
                newProductData.code,
                newProductData.price,
                true,
                newProductData.stock,
                newProductData.category,
                newProductData.thumbnail
            );
            const products = await newInstance.getProducts();
            socket.emit('products', products);
        } catch (error) {
            console.error('Error al agregar un nuevo producto:', error);
        }
    });
    socket.on('deleteProduct', async productToDelete => {
        try {
            await newInstance.deleteProduct(productToDelete)
            const products = await newInstance.getProducts();
            socket.emit('products', products);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    })
} )
