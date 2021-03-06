const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require('knex')

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
});

db.select('*').from('users');


app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send("Up and running Face-Recognition-API");
});

app.post('/signin',
    signin.handleSignIn(db, bcrypt)
)

app.post('/register', (req, res) => {
    register.handleRegister(req, res, db, bcrypt)
})

app.get('/profile/:id', (req, res) => {
    profile.handleProfileGet(req, res, db);
})

app.put('/image', (req, res) => {
    image.handleImage(req, res, db);
})

app.post('/imageUrl', (req, res) => {
    image.handleApiCall(req, res, db);
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on ${process.env.PORT}`);
})