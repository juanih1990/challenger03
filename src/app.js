import express from "express"
import ProductManager from "./ProductManager.js"
const app = express()

//leer
app.get('/', (req, res) => res.json("ok"))
app.get('/api/productos', async (req, res) => {
    const productManager = new ProductManager()
    const data = await productManager.getProduct()
    const limit = req.query.limit
    const id = req.query.id; // Obtén el valor del parámetro "id" de la ruta
    if(data){
        if (id) {
            const producto = data.find((product) => product.id === parseInt(id));
    
            if (producto) {
                res.json({ data: producto });
            }
        }
        else if (limit) {
            const limitValue = parseInt(limit)
            if (!isNaN(limitValue)) {
                const limitedData = data.slice(0, limitValue);
                res.json({ data: limitedData });
            }
        } else{
            res.json({ data })
        }
    }
    else{
        res.status(404).json({ error: "Producto no encontrado" });
    }
  
    

})
app.get('/api/productos/:pid', async (req, res) => {
    const productManager = new ProductManager()
    const data = await productManager.getProduct()
    const id = req.params.pid; // Obtén el valor del parámetro "id" de la ruta
    if (data) {
        const producto = data.find((product) => product.id === parseInt(id));

        if (producto) {
            res.json({ data: producto });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
})
app.listen(8080)

//  Busca id por parametro 
//=>http://127.0.0.1:8080/api/productos/2

//  Pone un limite a la busqueda de productos ejemplo 1
//=>  http://127.0.0.1:8080/api/productos?limit=1

// Busca todos los productos
//=>http://127.0.0.1:8080/api/productos