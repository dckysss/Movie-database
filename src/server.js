const express = require("express")
const collection = require("./mongo");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
const jwt = require('jsonwebtoken')
const jwtSecretKey = process.env.SECRET_KEY
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


app.get("/login", cors(), (req, res) => {

})

app.post("/login", async(req, res) => {
    const { name, pass } = req.body

    try {
        const user = await collection.findOne({ name: name });
        
        if (user) {
          const isPasswordValid = (pass === user.pass);

          if (isPasswordValid) {
            res.json("success");
          } else {
            res.json("invalid");
          }
        } else {
          res.json("notexist");
        }
      } catch (e) {
        res.json("fail");
      }
})

app.post("/register", async(req, res) => {
    const{name, email, pass, conPass} = req.body

    const validateEmail = (email) => {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    const data = {
        name, 
        email, 
        pass
    }

    try {
        const existingUser = await collection.findOne({name:name})

        if(existingUser) {
            res.json("exist")
        } else {
            await collection.insertMany([data]);
            res.json("success")
        }
    } catch(e) {
        res.json("fail")
    }
})

app.listen(8000,() => {
    console.log("port connected");
})