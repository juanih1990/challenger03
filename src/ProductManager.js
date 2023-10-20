import  fs from 'fs' //para manejar archivos

class ProductManager {


    constructor() {
        this.products = []
        this.path = './productos.json'
        this.id = 0 //inicializo el id en cero
    }
    
    addTofile =(param) => {
        //cree esta funcion cuando me di cueta que lo iba a volver a usar cuando actualizara el producto, se usa en el addProduct y en UpdateProduct
        const productAjson = JSON.stringify(param, null, 2);   
         //convierto el objeto a String para poder guardar en archivo
        const promesa = fs.promises.writeFile(this.path , productAjson)
        promesa
            .then (() => {console.log("Producto guardado en archivo")} )
            .catch ( (error) => { console.log(error)})
    }
    addProduct = ({ title, price, description, code ,thumbnail,stock}) => {
        if (this.products.some(prod => prod.code === Number(code))) return
        if ( (!title || typeof(title) !== 'string' )|| (!price || typeof(price) !== 'number') || (!description || typeof(description) !== 'string') || (!code || typeof(code) !== 'number') || (!thumbnail || typeof(thumbnail) !== 'string') || (stock < 0 || typeof(stock) !== 'number' ) ) return  //el stock mayo a menos uno, es por que si pongo (!stock) el cero lo toma como true
        this.id++
        this.products.push({
            title: title,
            price: price,
            description: description,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
            id: this.id
        })
        this.addTofile(this.products)
    }
    //traigo los productos
    getProduct = async () =>{
        return  fs.promises.readFile(this.path,"utf-8")
            .then ( jsonData => JSON.parse(jsonData)  )
            .catch((error) => { console.log(error)})
    }

    getProductByid = (id) =>{
        const promesa = fs.promises.readFile(this.path,"utf-8")
        promesa
            .then((data) =>{ 
                const filterJson = JSON.parse(data)
                const filter = filterJson.find(prod => prod.id  === Number(id))
                return filter
            } )
            .then(() => console.log("El producto con id " , id , " se encuentra en el archivo"))
           .catch((error) => { console.log(error) })
    } 

    updateProduct = (id,actualizar) => {
        const promesa = fs.promises.readFile(this.path , "utf-8")
        promesa
           .then((data) =>{
              const dataJson = JSON.parse(data)
              const filter = dataJson.findIndex(prod => prod.id === Number(id))
              if (filter !== -1){
                  // si filter es distinto a -1 quiere decir que encontro un id , me va a devolver el primer elemento
                  dataJson[filter] = {...dataJson[filter] , ...actualizar}
                  this.addTofile(dataJson)   
              }  
              else{
                 console.log("El producto no se encuentra en existencia")
              }
           })
          .then(() => { 
            console.log("Leo nuevamente el archivo con el producto actualizado: \n")
            return  this.getProduct()})
          .catch((error) => {console.log(error)}) 
    }

    deleteProduct =(id) =>{
        const promesa = fs.promises.readFile(this.path,"utf-8")
        promesa
           .then((data) => {
                 const dataJson = JSON.parse(data)
                 const filter = dataJson.filter(prod => prod.id !== Number(id))
                 console.log(filter)
                 this.addTofile(filter)
           })
           .then(() => {console.log("Producto ",id ," borrado con exito")})
           .catch((error) => { console.log( error)})
    }
}
export default ProductManager
const productManager = new ProductManager()
/*
productManager.addProduct({
    code: 1001,
    title: "cerveza",
    price: 1500,
    description: "cerveza negra",
    thumbnail: "https://www.cualquiercosa.com",
    stock: 10
})

productManager.addProduct({
    code: 1002,
    title: "Fernet",
    price: 4000,
    description: "Fernet Branca",
    thumbnail: "https://www.otracosa.com",
    stock: 10
})*/

console.log("---------------------------------------")

//Para llamar a un producto por su id , descomentar estas lineas
//=>
        //console.log("Llamo a getProductByid le paso un id que existe en el arreglo: ")
        //productManager.getProductByid(1)    

//Para actualizar el precio de un producto descomentar estas lineas
//=>
        //console.log("Actualizo el precio del primer producto");
        //productManager.updateProduct(1, { price: 3500 })

//Para borrar un producto descomentar estas lineas
//=>
        //console.log("Borro un producto")
        //productManager.deleteProduct(2);

//Para leer los archivos creados descomentar getProduct, hacerlo cuando ya tengamos el archivo
//=>
        //console.log(productManager.getProduct())
        
console.log("---------------------------------------")

