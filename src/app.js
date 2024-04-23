const express = require('express');
const app = express();
const PORT = 8080;

const productRouter = require('./routes/products.routes.js');
const cartRouter = require("./routes/cart-routes.js")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/products', productRouter);
app.use("/api/cart", cartRouter);

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});