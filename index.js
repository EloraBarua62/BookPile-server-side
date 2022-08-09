const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken')



// Middleware
app.use(cors());
app.use(express.json());



// verifyJWT function
// function verifyJWT(req, res, next){
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).send({ message: 'Your access is unauthorized to BookPile' });
//     }


//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRECT, (err, decoded) => {
//         if (err) {
//             console.log(token)
//             return res.status(403).send({ message: 'BookPile authority forbid your access' })
//         }
//         console.log('decoded', decoded);
//         req.decoded = decoded;
//         next();
//     });
// }


//     // console.log('inside verify function', authHeader);
//     // next();
// }



// Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.toxng.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const booksCollection = client.db('BookPile').collection('books');


        // GET API for get token
        // app.get('/login' , async(req,res) => {
        //     const user = req.body;
        //     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        //         expiresIn:'5d'
        //     });
        //     console.log(accessToken)
        //     res.send(accessToken);
        // })


        // app.post('/login', (req, res) => {
        //     const user = req.body;
        //     const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5d' })
        //     res.send({
        //         success: true, accessToken: accessToken
        //     });
        //     // if (user.email=='elorabarua62@gmail.com' && user.password == 'elora12345') {
        //     //     const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
        //     //     res.send({
        //     //         success: true, accessToken: accessToken
        //     //     });
        //     // }
        //     // else {
        //     //     res.send({ success: false });
        //     // }

        // })

        // GET API for all books
        app.get('/books', async (req, res) => {
            const query = {};
            const cursor = booksCollection.find(query);
            const books = await cursor.toArray();
            res.send(books);
        })


        // GET API for selected book
        app.get('/books/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const book = await booksCollection.findOne(query);
            res.send(book);
        });


        // POST API for add new book
        app.post('/add_book', async (req, res) => {
            const newBook = req.body;
            const insertBook = await booksCollection.insertOne(newBook);
            res.send(insertBook);
        })


        // GET API for selected book
        app.put('/books/:id', async (req, res) => {
            const id = req.params.id;
            const updateQuantity = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateBookInfo = {
                $set: {
                    quantity: updateQuantity.quantity
                }
            };
            const book = await booksCollection.updateOne(query, updateBookInfo, options);
            res.send(book);
        });


        // GET API for load items of logged in user
        // app.get('/my_items' ,  async(req,res) => {
        //     const email = req.query.email;
        //     const criteria = {email:email};
        //     const cursor = await booksCollection.find(criteria);
        //     const books = await cursor.toArray();
        //     res.send(books);
        // })


        // // GET API for load items of logged in user
        // app.get('/my_items' , verifyJWT ,  async(req,res) => {
        //     // const authHeader = req.headers.authorization;
        //     // console.log(authHeader);
        //     const email = req.query.email;
        //     const criteria = {email:email};
        //     const cursor = await booksCollection.find(criteria);
        //     const books = await cursor.toArray();
        //     res.send(books);
        // })



        app.get('/my_items/:email', async(req, res) => {
            
            const email = req.params.email;
            const criteria = { email: email };
            const cursor =  booksCollection.find(criteria);
            const books = await cursor.toArray();
            res.send(books);   
            // console.log(req.headers.authorization);
            // res.send({ header: 'get' })

        })


        app.delete('/books/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const book = await booksCollection.deleteOne(query);
            res.send(book);
        })


    }
    finally {

    }
}


run().catch(console.dir);




// Main route
app.get('/', (req, res) => {
    res.send("BookPile server is running");
})





app.listen(port, () => {
    console.log('BookPile port is ', port);
})