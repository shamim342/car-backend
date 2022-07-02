const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const objectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();


const port = 5000;

// middle ware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q8coo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("carMachanic");
        const serviceCollection = database.collection('services');

        // get api
        app.get('/services', async(req,res)=>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // ?get single 
        app.get('/services/:id' , async(req,res)=>{
            const id =req.params.id;
            const query = {_id:objectId(id)};
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

        // ?post 
      app.post('/services' ,async (req , res)=>{
          const service = req.body;
          console.log('post api' , service);
          const result = await serviceCollection.insertOne(service);
          console.log(result);
          res.send(result)
      })

    //   delete
    app.delete('/services/:id', async(req,res)=>{
        const id = req.params.id;
        const qurey = {_id:objectId(id)}
        const result = await serviceCollection.deleteOne(qurey);
        res.json(result);
    })


    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/' , (req,res)=>{
    res.send('hello world');
})

app.listen(port , ()=>{
    console.log('car- server');
})