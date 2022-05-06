const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


// Middleware
app.use(cors());
app.use(express.json());


// Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.toxng.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run()
{
    try{
        await client.connect();
        const booksCollection = client.db('BookPile').collection('books');


        // GET API for all books
        app.get('/books', async(req,res)=>{
            const query = {};
            const cursor = booksCollection.find(query);
            const books = await cursor.toArray();
            res.send(books);
        })


        // GET API for selected book
        app.get('/books/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const book = await booksCollection.findOne(query);
            res.send(book);
        });


        // POST API for add new book
        app.post('/add_book', async(req,res) => {
            const newBook = req.body;
            const insertBook = await booksCollection.insertOne(newBook);
            res.send(insertBook);
        })


        // GET API for selected book
        app.put('/books/:id', async (req, res) => {
            const id = req.params.id;
            const updateQuantity = req.body;
            const query = { _id: ObjectId(id) };
            const options = {upsert: true};
            const updateBookInfo = {
                $set: {
                    quantity: updateQuantity.quantity
                }
            };
            const book = await booksCollection.updateOne(query,updateBookInfo,options);
            res.send(book);
        });


    }
    finally
    {

    }
}

run().catch(console.dir);


// Main route
app.get('/', (req,res) => {
    res.send("BookPile server is running");
})


app.listen( port , () => {
    console.log('BookPile port is ',port);
})