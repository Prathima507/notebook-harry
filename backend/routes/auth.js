const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Harry$classes';

//ROUTE 1: create a user using:POST "/api/auth/createuser". No login required
router.post('/createuser',[
    body('email','Enter a valid email').isEmail(),
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('password','Enter valid password').isLength({ min: 5 }),
],async (req, res)=>{  
  let success= false;
    //if they are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
//check whether the user with this email exists already
   try{
    let user = await User.findOne({email: req.body.email});    
    if (user) {
        return res.status(400).json({success, error:"sorry a user with this email already exists"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    //create user password
    user =await User.create({
        name: req.body.name,
        email:req.body.email,
        password: secPass,
      });
      
      const data = {
        user:{
            id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);      
      
      // res.json(user);
      success = true;
      res.json({success, authtoken});

    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal server err occured");
    }
   // res.json({"Nice":"nice"})
})

//ROUTE 2: Authenticate a user using:POST "/api/auth/login". No login required
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','password can not be blank').exists(),
],async (req, res)=>{  
  let success= false;
 //if they are errors return bad request and the errors
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
 }

const {email, password} = req.body;
try{
  let user = await User.findOne({email});
  if(!user){
    success=false;
    return res.status(400).json({error: "Please try to login with correct credentials"});
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if(!passwordCompare){
    success = false;
    return res.status(400).json({success, error: "Please try to login with correct credentials"});
  }

  const data = {
    user:{
        id: user.id
    }
  }
  const authtoken = jwt.sign(data, JWT_SECRET);
  success = true;
  res.json({success, authtoken});
} catch (error){
    console.error(error.message);
    res.status(500).send("Internal server error occured");

}

});

 //ROUTE 3: Get logged in User details : POST "/api/auth/getuser". Login required.
router.post('/getuser', fetchuser, async (req, res)=>{  
try {
const userId = req.user.id;
const user = await User.findById(userId).select("-password");
res.send(user);
}catch(error){
    console.error(error.message);
    res.status(500).send("Internal server error occured");
}
}) 
module.exports = router 