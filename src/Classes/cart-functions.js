const fs = require("fs");

class Cart {
    constructor(id, products) {
        this.id = id;
        this.products = products;
    }
}

class CartManager {
    constructor() {
        this.path = "cart.json";
    }

    async readCart() {
        try {
            const data = await fs.promises.readFile(this.path, "utf8");
            return JSON.parse(data);
        } catch (error) {
            console.log("Hubo un error al leer la lista de Carritos", error);
            return [];
        }
    }

    async addCart() {
        try {
            const listCart = await this.readCart();
            let autoId = listCart.length + 1;
            const findCartId = listCart.find(cart => cart.id === autoId);

            if (findCartId) {
                autoId = autoId + 1;
            }
            const newCart = new Cart(autoId, []);
            listCart.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(listCart));
            return newCart;
        } catch (error) {
            console.log(error);
        }
    }

    async getProductsFromCart(id) {
        try {
            const listCart = await this.readCart();
            const cart = listCart.find(cart => cart.id === id);
            return cart ? cart.products : [];
        } catch (error) {
            console.log("Hubo un error al obtener los productos del carrito", error);
            return [];
        }
    }

    async addProductToCart(cartId, pId) {
        try {
            const listCart = await this.readCart();
            let cart = listCart.find(cart => cart.id === cartId);

            if (!cart) {
                cart = await this.addCart();
            }

            const productIndex = cart.products.findIndex(item => item.product === pId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity++;
            } else {
                const newProductCart = {
                    "product": pId,
                    "quantity": 1,
                };
                cart.products.push(newProductCart);
            }

            await fs.promises.writeFile(this.path, JSON.stringify(listCart));
            return cart;
        } catch (error) {
            console.log("Hubo un error al agregar el producto al carrito", error);
        }
    }
}

module.exports = { Cart, CartManager };
