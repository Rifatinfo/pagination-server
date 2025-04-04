const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

const app = express() 
app.use(cors())
app.use(express.json())



// const uri = "mongodb+srv://Gym-schedule:<db_password>@cluster0.i1uhr.mongodb.net/?appName=Cluster0";
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.i1uhr.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


const productCollection = client.db('emaJohnDB').collection('products');

app.get('/products', async(req, res) => {
    console.log(req.query);
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    const result = await productCollection.find()
    .skip(page * size)
    .limit(size)
    .toArray();
    res.send(result);
})

app.get('/ProductsCounts', async (req, res) => {
    const count = await productCollection.estimatedDocumentCount();
    res.send({count})
})

app.get('/', (req, res) => {
  res.send('Pagination!')
})

app.listen(port, () => {
  console.log(`Pagination on port ${port}`)
})





