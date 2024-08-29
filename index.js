const express = require('express');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose')
const router = express.Router();
const bodyParser = require('body-parser');
const UserSchema = require('./models/User.js');

// requiered for environment variables
dotenv.config();

// middleware to requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// connect to the bd
const uri = process.env.URI;

// check the connection
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// I took it from the MongoDB website
async function run() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);

        // Verify the connection
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // Now will put the routes of the services
        app.use(router);

        // Check successful connection
        app.get('/', (req, res) => {
            res.send('Hello World');
        });

        // GET users
        router.get('/user', async (req, res) => {
            try {
                const data = await UserSchema.find();
                res.send(data);
            } catch (err) {
                console.error('Error retrieving data:', err);
                res.status(500).send('Error retrieving data: ' + err.message);
            }
        });
    
        // POST users
        router.post('/user', async (req, res) => {
            let newUser = new UserSchema({
                nombre: req.body.nombre,
                apellidos: req.body.apellidos,
                correo: req.body.correo,
                telefono: req.body.telefono,
                password: req.body.password,
            })
            try {
                const data = await newUser.save();
                res.send('saved successfully: ' + data)
            } catch (err) {
                console.error('Error saving user:', err);
                res.status(500).send('Error saving user: ' + err.message);
            }
        })        

        // start the server after establishing the connection
        app.listen(port, () => {
            console.log('Listening on ' + port);
        });


    } catch (err) {
        console.error("MongoDB connection error: ", err)
    }
}

run()