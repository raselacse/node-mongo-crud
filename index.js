const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbManagement:dbManagement@cluster0.3g0y0.mongodb.net/dbManagement?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res)=>{  
    // res.send('hello i m ')
    res.sendFile(__dirname + '/index.html')
})



client.connect(err => {
  const collection = client.db("dbManagement").collection("databases");
  
  app.get('/products',(req, res)=>{
    collection.find({})//.limit(1)
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })

  app.get('/product/:id', (req, res)=>{
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents)=>{
      res.send(documents[0])
    })
  })

  app.post('/addProduct',(req, res)=>{
     const product = req.body;
     collection.insertOne(product)
       .then(result =>{
         console.log('data added successfully');
         res.redirect('/');
       })
  })


  app.patch('/update/:id', (req, res)=>{
    console.log(req.body.price)
    collection.updateOne({_id: ObjectId(req.params.id)},
      {
        $set: {price: req.body.price, quantity: req.body.quantity}
      })
      .then(result =>{
        res.send(result.modifiedCount > 0);
      })
  })

  app.delete('/delete/:id', (req, res)=>{
    console.log(req.params.id)
    const deleteProduct = {_id: ObjectId(req.params.id)};
    collection.deleteOne(deleteProduct)
    .then(result =>{
      res.send(result.deletedCount > 0)
    })
  })

  // const product =  {_id: '1', name: 'honey', price: '200', quantity: '10'}
  // collection.insertOne(product)
  // .then(result =>{
  //   console.log('one product added')
  // })
  console.log('database connected')
  // perform actions on the collection object
  // client.close();
});


app.listen(3000)