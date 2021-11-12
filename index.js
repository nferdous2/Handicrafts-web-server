
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
    res.send('Running Tour server')
});

async function run() {
    try {
        await client.connect();
        const database = client.db("buy_sell");
        const productsCollection = database.collection("products");

        // get api
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        // post api
        app.post('/products/user', async (req, res) => {
            const product = req.body;
            console.log('post api', product);
            const result = await productsCollection.insertOne(product);
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