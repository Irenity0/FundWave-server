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

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const userCollection = client.db('FundWave').collection("users");
    const campaignCollection = client.db("FundWave").collection("campaigns");
    const donationCollection = client.db("FundWave").collection("donations");
    
    // Campaign APIs
    app.post('/campaigns', async (req, res) => {
      const newCampaign = req.body;
      console.log('Adding new campaign', newCampaign)

      const result = await campaignCollection.insertOne(newCampaign);
      res.send(result);
    });

    app.get('/campaigns', async (req, res) => {
      const cursor = campaignCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/campaigns/sorted', async (req, res) => {
      try {
        const campaigns = await campaignCollection.find().sort({ minDonation: 1 }) .toArray(); 
    
        res.json(campaigns);
      } catch (error) {
        console.error('Error fetching sorted campaigns:', error);
        res.status(500).json({ error: 'Failed to fetch sorted campaigns' });
      }
    });
    


    app.get('/campaigns/:id', async (req, res) => {
      const id = req.params.id;
    
      // Validate if `id` is a valid ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid campaign ID' });
      }
    
      const query = { _id: new ObjectId(id) };
      try {
        const result = await campaignCollection.findOne(query);
        if (!result) {
          return res.status(404).send({ error: 'Campaign not found' });
        }
        res.send(result);
      } catch (error) {
        console.error("Error retrieving campaign:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    // PUT route to update a campaign
    app.put('/campaigns/:id', async (req, res) => {
      const id = req.params.id;
  
      if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: 'Invalid campaign ID' });
      }
  
      const filter = { _id: new ObjectId(id) };
      const updatedCampaign = req.body;
  
      const campaign = {
          $set: {
              image: updatedCampaign.image,
              title: updatedCampaign.title,
              campaignType: updatedCampaign.campaignType,
              description: updatedCampaign.description,
              minDonation: updatedCampaign.minDonation,
              deadline: updatedCampaign.deadline,
              email: updatedCampaign.email,
              name: updatedCampaign.name,
          },
      };
  
      try {
          const result = await campaignCollection.updateOne(filter, campaign);
          res.send(result);
      } catch (error) {
          console.error('Error updating campaign:', error);
          res.status(500).send({ error: 'Failed to update campaign' });
      }
  });
  

    // DELETE route to delete a campaign
    app.delete('/campaigns/:id', async (req, res) => {
      const id = req.params.id; 
      const query = { _id: new ObjectId(id) };
      const result = await campaignCollection.deleteOne(query);
      res.send(result);
    });

    // Donation APIs
    app.post('/donations', async (req, res) => {
      const newDonation = req.body;
      console.log('Adding new donation', newDonation)

      const result = await donationCollection.insertOne(newDonation);
      res.send(result);
    });

    app.get('/donations', async (req, res) => {
      const cursor = donationCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // User APIs
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      console.log('creating new user', newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

  } finally {
    // Ensure the client will close when you finish/error
    // await client.close();
  }
}

// Call the run function to start the server
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
