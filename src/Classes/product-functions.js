const fs = require("fs");

class Product {
    constructor(id, title, description, code, price, status, stock, category, thumbnail) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = status;
        this.stock = stock;
        this.category = category;
        this.thumbnail = thumbnail;
    }
}

class ProductManager {
    constructor() {
        this.path = "products.json";
    }

    async readProducts() {
        try {
            const data = await fs.promises.readFile(this.path, "utf8");
            if (data) {
                return JSON.parse(data);
            } else {
                return [];
            }
        } catch (error) {
            console.log("Hubo un error al leer la lista de Productos", error);
            return [];
        }
    }
    

    async addProduct(title, description, code, price, status, stock, category, thumbnail) {
        let messageStatus = "Producto agregado con éxito";
        try {
            const listProduct = await this.readProducts();

            const findProduct = listProduct.find(product => product.code === code);
            if (!findProduct) {
                let autoId = listProduct.length + 1;

                const findId = listProduct.find(product => product.id === autoId);

                if (findId) {
                    autoId = autoId + 1;
                }
                const newProduct = new Product(autoId, title, description, code, price, status, stock, category, thumbnail);

                listProduct.push(newProduct);

                await fs.promises.writeFile(this.path, JSON.stringify(listProduct));
            } else {
                messageStatus = `El producto ${findProduct.code} ya existe`;
            }
            return messageStatus;
        } catch (error) {
            console.log(error);
        }
    }

    async getProducts(limit) {
        try {
            const products = await this.readProducts();
            let productsGroup = [...products];
    
            if (limit) {
                productsGroup = productsGroup.slice(0, limit);
            }
    
            return productsGroup;
        } catch (error) {
            console.log("Hubo un error al obtener los productos", error);
            return [];
        }
    }
    


    async updateProduct(id, toUpdate) {
        try {
            const products = await this.readProducts();

            const indexProduct = products.findIndex(product => product.id === id);

            if (indexProduct !== -1) {
                const originalProduct = products[indexProduct];

                const updateProduct = { ...originalProduct, ...toUpdate };
                products[indexProduct] = updateProduct;

                await fs.promises.writeFile(this.path, JSON.stringify(products));
                return updateProduct;
            }
        } catch (error) {
            console.log("Hubo un error al actualizar el producto");
        }
    }

    async deleteProduct(id) {
        let message = "Producto eliminado correctamente";

        try {
            const products = await this.readProducts();

            const indexProduct = products.findIndex(product => product.id === id);

            if (indexProduct !== -1) {
                products.splice(indexProduct, 1);

                await fs.promises.writeFile(this.path, JSON.stringify(products));
                
            } else {
                message = "El producto no existe";
            }
        } catch (error) {
            message = "Hubo un error al eliminar el producto";
        }
    }
}

module.exports = { Product, ProductManager };
