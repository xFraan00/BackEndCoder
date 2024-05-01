import express from 'express';
import { promises as fs } from "fs"

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let data = await fs.readFile("../products.json", "utf8")
        const products = JSON.parse(data)
        res.render("index", { products })
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al leer el archivo de productos");
    }
});
router.get("/realtimeproducts", async (req, res) => {
    try {
        let data = await fs.readFile("../products.json", "utf8")
        const products = JSON.parse(data)
        res.render("realTimeProducts", { products })
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al leer el archivo de productos");
    }
});

export default router;
