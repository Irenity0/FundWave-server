require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oo5u4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");


    const userCollection = client.db('FundWave').collection("users");
    const campaignCollection = client.db("FundWave").collection("campaigns");
    
    // campaign apis
    app.post('/campaigns', async (req, res) => {
      const newCampaign = req.body;
      console.log('Adding new campaign', newCampaign)

      const result = await campaignCollection.insertOne(ne);
      res.send(result);
  });

    app.get('/campaigns', async (req, res) => {
      const cursor = campaignCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  });
    
    
    // user apis
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      console.log('creating new user', newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });



  

  




    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('moni moni')
})

app.listen(port, () => {
    console.log(`server running at: ${port}`);
})