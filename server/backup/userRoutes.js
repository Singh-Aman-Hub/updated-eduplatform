const express= require('express')
const router= express.Router();
const User = require('../models/user');
const authMiddleware = require('../auth')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const JWT_SECRET= "helloWorld"
console.log("JWT_SECRET:", JWT_SECRET);

router.get('/', (req,res)=>{
    try{
        res.status(200).json("What the hell it is working! Welcome to the TO_DO_LIST server")
    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.post('/register', async (req, res) => {
  try {
    const { name, email, student,password ,image} = req.body;
    let imgBuffer = null;
    let contentType= null;
    if(image){
      const matches = image.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).send("Invalid image format");
      }
      contentType = matches[1];
      imgBuffer = Buffer.from(matches[2], "base64");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser){
        console.log(existingUser);
        return res.status(400).json({ msg: "User already exists says Aman" + existingUser});
    } 

    const hashedPwd = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, student ,password: hashedPwd ,
      image:{
        data:imgBuffer,
        contentType,
      },
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        student: newUser.student,
        student:newUser.student,
      }
    });
    
  } catch (err) {
    // console.log(name,email,password)
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/protected', authMiddleware,async (req, res) => {
  try{
    const user=await User.findById(req.user);
      res.json({msg: `Hola ${user.name+" "},`,
      name: user.name,
      email: user.email,
      student:user.student,
      image: user.image? `data:${user.image.contentType};base64,${user.image.data.toString("base64")}`: null,
      });
  }catch(err){
      res.status(500).json(err+"Brooo!")
  }
});

router.get('/allUsers',authMiddleware,async(req,res)=>{
    try{
        const data= await User.find();
        res.status(200).json(data);
    }catch(err){
        res.status(500).json({error: err.message})
    }
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id,student:user.student, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





module.exports= router