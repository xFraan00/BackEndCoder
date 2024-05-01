import { Router } from "express";
import { CartManager } from "../../src/Classes/cart-functions.js";

const router = Router()
const newInstanceCart = new CartManager ()

router.get('/', async (req, res) => {

    try {

        const carts = await newInstanceCart.readCarts()

        res.status(200).json( [ { carts } ] );

    } catch (error) {

        res.status(500).json( [ { message: 'Hubo un error al obtener los carritos' } ] );

    }
})


router.post('/', async ( req, res ) => {
 
    try {
        const newCartAdded = await newInstanceCart.addCart();
        res.status(200).json([{ message: 'Carrito agregado' }, {newCartAdded}]);
    } catch (error) {
        res.status(500).json([{ message: error }]);
    }
    
        
})


router.get('/:cid', async ( req, res ) => {

    const cid = parseInt( req.params.cid );
 
    try {
        const listOfProductsFromCart = await newInstanceCart.getProductsFromCart(cid);
        res.status(200).json([{ listOfProductsFromCart }]);
    } catch (error) {
        res.status(500).json([{ message: error }]);
    }
    
        
})


router.post('/:cid/product/:pid', async (req, res) => {
    
    
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    try {

        
        const currentCart = await newInstanceCart.addProductToCart(cid, pid)

        res.status(200).json([{ message: 'Se añadio correctamente el producto al carrito' }, {currentCart}]);

    } catch (error) {
        
        res.status(500).json([{ message: error }]);
    }
});



export default router;