import { Router } from "express";
import { ProductManager } from '../Classes/product-functions.js'

const router = Router()

const newInstance = new ProductManager();

router.get('/realTimeProducts', async (req, res) => {
    try {
        const productos = await productMngr.getProducts();
        res.render('home', {productos, length : productos.length > 0 ? true : false});
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });   
    }
})

router.get('/', async ( req, res ) => {

    let limit = parseInt(req.query.limit);

    try {
        const products = await newInstance.getProducts(limit);
        res.status(200).send(products);
    } catch (error) {
        res.status(500).json([{ error }]);
    }    
});

router.get('/:pid', async ( req, res ) => {

    const productId = parseInt(req.params.pid);

    try {
        const products = await newInstance.getProducts();
        let filterProduct = products.find(product => product.id === productId);
        if (filterProduct) {
            res.status(200).send(filterProduct);
        } else {
            res.status(404).json([{ message: 'El producto no existe' }]);
        }
    } catch (error) {
        res.status(500).json([{ error }]);
    }
});

router.post('/', async (req, res) => {

    const { title, description, code, price, status, stock, category, thumbnail } = req.body;

    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
        res.status(500).json([{ message: 'Todos los campos son obligatorios.' }]);
    } else {
        try {
            const addProduct = await newInstance.addProduct(title, description, code, price, status, stock, category, thumbnail);
            res.status(200).json([{ message: addProduct }]);
        } catch (error) {
            res.status(500).json([{ message: 'Error al cargar el producto.' }, { error }]);
        }
    }
});

router.put('/:pid', async ( req, res ) => {

    const productPid = parseInt( req.params.pid );

    const { title, description, code, price, status, stock, category, thumbnail } = req.body;

    try {
        const productUpdate = await newInstance.updateProduct(productPid, req.body);
        res.status(200).json([{ message: 'Producto actualizado correctamente.' }, { productUpdate }]);
    } catch ( error ) {
        res.status(500).json([{ message: 'Hubo un problema al actualizar el producto:' }, { error }]);
    }

})

router.delete('/:pid', async ( req, res ) => {

    const pid = parseInt(req.params.pid);

    try {
        const product = await newInstance.deleteProduct(pid);
        res.status(200).json([{ message: product }]);
    } catch (error) {
        res.status(500).json([{ message: product }, { error }]);
    }

})

export default router;
