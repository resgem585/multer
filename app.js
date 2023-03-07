// Llamar a las dependencias
const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
//Ruta de los archivos
const path =require('path')

// Creamos el Storage Engine

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb){
        // HAcemos un timesamps, La funcion regresa nombre + fecha + extension del archivo
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) 
    }
})

// inicializamos upload

const upload = multer ({
    storage: storage,
    limits: {fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
}).single('myImage') // Solo subimos un archivo 

// Checamos el tipo de archivo
function checkFileType(file, cb) {
    // Lista de archivos permitidos
    const filetypes = /jpeg|jpg|png|gif/

    // Verificar la extension del archivo
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    // Verificamos el mimetype
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
    cb(null, true)
    } else {
    cb('Error: Solo se permiten subir imagenes')
    }
}
// inicializamos la app
const app = express()
const port = 3000

//EJS
app.set('view engine', 'ejs')


// carpeta publica
app.use(express.static('./public'))

app.get('/', (req, res)=> res.render('index'))

app.post('/upload', (req, res) => {
    //res.send('test')
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            })
        } else {
            //console.log(req.file)
            //res.send('test')
            if (req.file == undefined) {
                res.render('index', {
                    msg: "Error: No seleccionaste un archivo"
                })
            } else {
                res.render('index', {
                    msg: "Archivo subido correctamente",
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })
})



app.listen(port, () => console.log(`Servidor ejecutandose en el puerto ${port}`))

