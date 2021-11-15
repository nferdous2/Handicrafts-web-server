const express = require("express");
const app = express();
require('dotenv').config();
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require('mongodb');
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yhxur.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const port = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send('Running Decore And craft server')
});
app.get('/try', (req, res) => {
    res.send('working')
});


async function run() {
    try {
        await client.connect();
        const database = client.db("buy_sell");
        const productsCollection = database.collection("products");
        const usersCollection = database.collection('users');
        const addReviewCollection = database.collection('review')
        // get api
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        //post for add register users
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
        //making admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: "admin" } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result)
        })

        //get review
        app.get('/review', async (req, res) => {
            const cursor = productsCollection.find({});
            const review = await cursor.toArray();
            res.send(review);
        });
        //add review
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await addReviewCollection.insertOne(review);
            console.log(result);
            res.json(result)

        });
        //orders handle
        app.post('/myOrders', async (req, res) => {
            const orders = req.body;
            const result = await addReviewCollection.insertOne(orders);
            console.log(result);
            res.json(result)

        });
        //delete api
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}


client.connect(err => {
    const collection = client.db("test").collection("devices");
    client.close();
});

run().catch(console.dir);
app.listen(port, () => {
    console.log('Running ', port);
})