const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const swaggerUI = require('swagger-ui-express');
const docSwag = require('./swagger');
const userRoutes = require('./Router/userRoutes');
const contactRoutes = require('./Router/contactRoutes')
const cors = require('cors');
const app = express();
const port = 8080;

app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));





app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docSwag));

app.use('/users', userRoutes);

app.use('/contact', contactRoutes);

app.get('/', (req, res) => {
      res.send('Hello from our server!')
})




const username = process.env.MONGO_USERNAME;
console.log(username);
const password = process.env.MONGO_PASSWORD;
console.log(password);


const PDO = mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.jh9jfus.mongodb.net/MyContacts?retryWrites=true&w=majority&appName=Cluster0`).then(() => console.log("base de donnée connecté")).catch((e) => console.error(e));

app.listen(port, () => {
      console.log('server listening on port 8080')
})