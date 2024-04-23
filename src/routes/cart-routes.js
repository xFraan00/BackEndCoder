const { Router } = require('express');
const router = Router();
const { CartManager } = require('../Classes/cart-functions.js');
const { ProductManager } = require('../Classes/product-functions.js');

const cartMngr = new CartManager();
const productMngr = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const cart = await cartMngr.readCart();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Hubo un error al obtener el carrito", error });
    }
});

router.post("/", async (req, res) => {
    try {
        const newCartAdd = await cartMngr.addCart();
        res.status(200).json({ message: "Carrito agregado", newCartAdd });
    } catch (error) {
        res.status(500).json({ message: "Hubo un error al agregar el carrito", error });
    }
});

router.get("/:cid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    try {
        const listCartProducts = await cartMngr.getProductsFromCart(cid);
        res.status(200).json(listCartProducts);
    } catch (error) {
        res.status(500).json({ message: "Hubo un error al obtener los productos del carrito", error });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    try {
        const currentCart = await cartMngr.addProductToCart(cid, pid);
        res.status(200).json({ message: "Se añadió el producto al carrito", currentCart });
    } catch (error) {
        res.status(500).json({ message: "Hubo un error al añadir el producto al carrito", error });
    }
});

module.exports = router;
