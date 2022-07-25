//npm install express mongoose ejs dotenv
//npm install nodemon --save-dev
//"start": 'nodemon server.js'


//DECLARE VARIABLES
const express = require('express')
const app = express()
const PORT = 8008;
const mongoose = require('mongoose')
require('dotenv').config()
const shoppinglist =  require('./models/shoppinglist')

//MIDDLEWARE
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

//CONNECT TO DATABASE
mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    () => {console.log('Connected to DB!')}
)

//GET
app.get('/', async (req,res) => {
    try {
        shoppinglist.find({}, (err,items) => {
            res.render('index.ejs', {
                shoppinglist: items

            })
        })
    } catch (error) {
        res.status(500).send({message: error.message})
    }
})

//POST
app.post('/', async (req,res) => {
    const listItem = new shoppinglist(
        {
            item: req.body.item,
            quantity: req.body.quantity
        });
    try {
        await listItem.save();
        console.log(listItem)
        res.redirect('/')
    } catch(err) {
        if (err) return res.status(500).send(err)
        res.redirect('/')
    }
})

//UPDATE
app
    .route('/edit/:id')
    .get((req,res) => {
        const id = req.params.id;
        shoppinglist.find({}, (err, items) => {
            res.render('edit.ejs', {
                shoppinglist: items, idItem: id });
            });
    })
            
    .post((req,res) => {
        const id = req.params.id
        shoppinglist.findByIdAndUpdate(
            id, 
            {
                item: req.body.item,
                quantity: req.body.quantity
            },
            err => {
                if (err) return res.status(500).send(err);
                res.redirect('/');
            });
    });

//DELETE

app
    .route('/remove/:id')
    .get((req,res) => {
        const id = req.params.id
        shoppinglist.findByIdAndRemove(id, err => {
            if (err) return res.status(500).send(err);
            res.redirect('/')
        })
    })



//LISTEN
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))