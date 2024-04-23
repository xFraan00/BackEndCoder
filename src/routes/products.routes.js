const { Router } = require("express");
const router = Router();
const { ProductManager } = require("../Classes/product-functions.js");

const newInstance = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await newInstance.getProducts(limit);
        res.status(200).send(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const products = await newInstance.getProducts();
        const filterProduct = products.find(product => product.id === productId);
        if (filterProduct) {
            res.status(200).send(filterProduct);
        } else {
            res.status(404).json({ message: "El producto no existe" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;
    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
        res.status(400).json({ message: "Todos los campos son obligatorios" });
    } else {
        try {
            const addProduct = await newInstance.addProduct(title, description, code, price, status, stock, category, thumbnail);
            res.status(200).json({ message: addProduct });
        } catch (error) {
            res.status(500).json({ message: "Error al cargar el producto", error: error.message });
        }
    }
});

router.put("/:pid", async (req, res) => {
    const productPid = parseInt(req.params.pid);
    try {
        const productUpdate = await newInstance.updateProduct(productPid, req.body);
        res.status(200).json({ message: "Producto actualizado correctamente", productUpdate });
    } catch (error) {
        res.status(500).json({ message: "Hubo un error al actualizar el producto", error: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    const pId = parseInt(req.params.pid);
    try {
        const product = await newInstance.deleteProduct(pId);
        res.status(200).json({ message: product });
    } catch (error) {
        res.status(500).json({ message: "Hubo un error al eliminar el producto", error: error.message });
    }
});

module.exports = router;
