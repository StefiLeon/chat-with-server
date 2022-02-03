//IMPORTS
import express from 'express';
import cors from 'cors';
import __dirname, { normalizedMessages } from './utils.js';
import { Server } from 'socket.io';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import ios from 'socket.io-express-session';
import { authorService, messageService } from './services/chatServices.js';
import initializePassportConfig from './services/passport-config.js';
import passport from 'passport';
import dotenv from 'dotenv';

//DOTEVN
dotenv.config();

//EXPRESS
const app = express();
const PORT = process.env.PORT || 8081;
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en ${PORT}`);
})
server.on('error', (error) => console.log(`Error en el servidor: ${error}`));

//SESSION
const baseSession = (session({
    store:MongoStore.create({mongoUrl: process.env.MONGO_URI}),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    cookie: { maxAge: process.env.EXPIRES*1000 }
}))

export const io = new Server(server);

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(express.static(__dirname+'/public'));
app.use(baseSession);
io.use(ios(baseSession));
initializePassportConfig();
app.use(passport.initialize());
app.use(passport.session());

//RUTAS
app.get('/currentUser', (req, res) => {
    res.send(req.session.author)
    if(req.session.author){
        res.status(200)
    } else {
        res.status(403)
    }
})

app.post('/register', async (req, res) => {
    let author = req.body;
    let result = await authorService.save(author);
    console.log('hola');
    res.send({status:"success", message:"Usuario creado", author: result})
})

app.post('/login', async (req, res) => {
    let {email, password} = req.body;
    if(!email || !password) return res.status(400).send({error:"Faltan datos."})
    const author = await authorService.getBy({email:email});
    if(!author) return res.status(404).send({error:"Usuario no encontrado."})
    if(author.password !== password) {
        return res.status(400).send({error:"Contraseña incorrecta."})
    }
    req.session.author = {
        alias: author.alias,
        email: author.email
    }
    res.send({status:"logged"})
})

app.get('/auth/facebook', passport.authenticate('facebook', {scope:['email']}), (req, res) => {
    console.log("callback")
})

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect:'/failPage'
}), (req, res) => {
    res.redirect('/profile/')
})

app.get('/info', (req, res) => {
    res.send({
        argumentos:process.argv,
        plataforma: process.platform,
        version_node: process.version,
        memoria: process.memoryUsage().rss,
        path: process.execPath,
        id: process.pid,
        folder: process.cwd()
    })
})

// app.get('/api/randoms', (req, res) => {

//     let numbers = req.query.q;
//     res.send(numbers)
// })

//WEBSOCKETS
io.on('connection', socket => {
    socket.broadcast.emit('thirdConnection', 'Alguien se ha unido al chat');
    socket.on('message', async data => {
        const author = await authorService.findByAlias(socket.handshake.session.author.alias);
        let message = {
            author: author._id,
            text: data.message
        }
        await messageService.save(message);
        const messages = await messageService.getAll();
        const objectToNormalize = await messageService.normalizeData();
        const normalizedData = normalizedMessages(objectToNormalize);
        console.log(JSON.stringify(normalizedData, null, 2))
        io.emit('message', normalizedData);
    })
})