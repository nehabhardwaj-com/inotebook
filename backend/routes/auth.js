const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
JWT_SECRET = "heyheyhey";

//Create a User using  POST:'/api/auth/createuser' . Does not require auth
router.post(
  "/createuser",
  [
    body("name", "enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    //if there are error then return bad request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check whether the  this email exist already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email is already exists." });
      }
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      //create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
          user:{
              id : user.id
          }
      }
      const authToken = jwt.sign(data, JWT_SECRET);
      console.log(authToken);
      res.json({authToken});
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error')
    }
  }
);
//Authentication of users POST:'/api/auth/login'
router.post(
    "/login",
    [
      body("email", "Enter a valid email").isEmail(),
      body("password","Password can not be blank").exists(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      //if there are error then return bad request
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    
  
    const{email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"Please try to login with correct username and password"})
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({error:"Please try to login with correct username and password"}) 
        }
        const data = {
            user:{
                id : user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.send({authToken});
    } catch (error) {
        console.log(error.message);
      res.status(500).send('Internal Server Error')
    }
});

module.exports = router;
