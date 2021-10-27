var express = require('express');
const app = express();
const bodyParser=require('body-parser');
const dotenv=require('dotenv')
dotenv.config()
const port=process.env.PORT||8210;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//const mongourl = "mongodb://localhost:27017"
const mongourl = "mongodb+srv://edureka123:1234@cluster0.nbutl.mongodb.net/zomato?retryWrites=true&w=majority"

var db;

//get
app.get('/',(req,res) => {
    res.send("Welcome to Node Api1")
})

//category
app.get('/location',(req,res) =>{
    db.collection('location').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/cuisine',(req,res) =>{
    db.collection('cuisine').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/restaurant',(req,res) =>{
    var query = {}
    if(req.query.cityId){
        query={city:req.query.cityId}
    }else if(req.query.mealtype){
        query={"type.mealtype":req.query.mealtype}
    }
    db.collection('restaurant').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


app.get('/filter/:mealType',(req,res) => {
    var sort={cost:1};
    var skip=0;
    var limit=100000;
    if(req.query.sortkey){
        sort={cost:req.query.sortkey}
    }
    if(req.query.skip&&req.query.limit){
        skip=Number(req.query.skip);
        limit=Number(req.query.limit);
    }
    var mealType = req.params.mealType;
    var query = {"type.mealtype":mealType};
    if(req.query.cuisine){
        query = {"type.mealtype":mealType,"Cuisine.cuisine":req.query.cuisine }
    }
    else if(req.query.lcost && req.query.hcost){
        var lcost=Number(req.query.lcost);
        var hcost=Number(req.query.hcost);
        query={$and:[{cost:{$gt:lcost,$lt:hcost}}]}
    }
    db.collection('restaurant').find(query).sort(sort).skip(skip).limit(limit).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

// restaurant Details
app.get('/details/:id',(req,res) => {
    var id = req.params.id
    db.collection('restaurents').find({_id:id}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
    /*
    db.collection('restaurents').findOne({_id:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
    */
})
app.post('/placeOrder',(req,res) => {
    console.log(req.body);
    db.collection('orders').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send("Order Placed")
    })
})

app.get('/viewOrder',(req,res) => {
    var query = {}
    if(req.query.email){
        query = {email:req.query.email}
    }
    db.collection('orders').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/viewOrder/:id',(req,res) => {
    var id = mongo.ObjectId(req.params.id);
    db.collection('orders').find({_id:id}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/viewOrder',(req,res) => {
    var email = req.query.email;
    db.collection('orders').find({email:email}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})



app.delete('/deleteOrder',(req,res) => {
    db.collection('orders').remove({},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/restaurant/:cityId',(req,res) =>{
    var cityId=req.params.cityId;
    console.log("cityId>>>>",cityId)
    db.collection('restaurant').find({city:cityId}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
//query
app.get('/restaurant',(req,res) =>{
    var cityId=req.query.cityId?req.query.cityId:"2";
    console.log("cityId>>>>",cityId)
    db.collection('restaurant').find({city:cityId}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/restaurant',(req,res) =>{
    var query = {}
    if(req.query.cityId){
        query={city:req.query.cityId}
    }else if(req.query.mealtype){
        query={"type.mealtype":req.query.mealtype}
    }
    db.collection('restaurant').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


app.get('/restaurant',(req,res) =>{
    var cityId=req.query.cityId?req.query.cityId:"2";
    console.log("cityId>>>>",cityId)
    db.collection('restaurant').find({city:cityId}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/quicksearch',(req,res) =>{
    db.collection('mealtype').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.put('/updateStatus/:id',(req,res) => {
    var id = mongo.ObjectId(req.params.id);
    var status = 'Pending';
    var statuVal = 2
    if(req.query.status){
        statuVal = Number(req.query.status)
        if(statuVal == 1){
            status = 'Accepted'
        }else if (statuVal == 0){
            status = 'Rejected'
        }else{
            status = 'Pending'
        }
    }
    db.collection('orders').updateOne(
        {_id:id},
        {
            $set:{
               "status": status
            }
        }, (err,result) => {
            if(err) throw err;
            res.send(`Your order status is ${status}`)
        }
    )
})

        
MongoClient.connect(mongourl, (err,client) => {
    if(err) console.log("Error While Connecting");
    db = client.db('zomato');
    app.listen(port,()=>{
        console.log(`listening on port no ${port}`)
    });
})
