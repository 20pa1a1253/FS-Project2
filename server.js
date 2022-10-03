const express=require("express");
const app=express();

const admin=require("firebase-admin");
const credentials=require("./key.json");
admin.initializeApp({
    credential:admin.credential.cert(credentials)
});
const db=admin.firestore();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.post('/create', async(req,res)=>{
    try{
        console.log(req.body);
        const id=req.body.email;
        const data={
            email:req.body.email,
            firstNmae:req.body.firstNmae,
            lastName:req.body.lastName
        };
        const response=await db.collection("users").add(data);
        res.send(response);
    } catch(error){
        res.send(error);
    }
})
app.get('/read/all',async(req,res)=>{
    try{
        const userid=db.collection("users");
        const response=await userid.get();
        let responsearr=[];
        response.forEach(doc=>{
            responsearr.push(doc.data());
        });
        res.send(responsearr);
    } catch(error){
        res.send(error);
    }
});
app.get('/read/:id',async(req,res)=>{
    try{
        const usersid=db.collection("users").doc(req.params.id);
        const response=await usersid.get();
        
        res.send(response.data());
    } catch(error){
        res.send(error);
    }
});
app.post('/update',async(req,res)=>{
    try{
        const id=req.body.id;
        const newfirstnmae="hary";
        const usersid=await db.collection("users").doc(id)
        .update({
            firstNmae:newfirstnmae
        });
        res.send(usersid);
    } catch(error){
        res.send(error);
    }
});
app.delete('/delete/:id', async(req, res)=>{
    try{
        const response=await db.collection("users").doc(req.params.id).delete();
        res.send(response);
    } catch(error){
        res.send(error);
    }
})
const PORT=3000;
app.listen(PORT,()=>{
    console.log('server running at port'+PORT);
})