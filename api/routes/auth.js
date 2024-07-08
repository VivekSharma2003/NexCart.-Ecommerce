import express from "express"
import User from "../models/User.js"
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken"

const router = express.Router();

//REGISTER
router.post("/register", async (req,res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        isAdmin: req.body.isAdmin,
    });

    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch(err){
        res.status(500).json(err);
    }
});

//LOGIN
router.post("/login", async (req, res)=>{
    try{
        const user = await User.findOne({username: req.body.username});
        if (!user) {
            return res.status(401).json("Invalid username!");
        }

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );

        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if (OriginalPassword !== req.body.password) {
            return res.status(401).json("Wrong Password!");

        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            {expiresIn:"3d"}
        );

        const { password, ...others} = user._doc;
        res.status(200).json({...others, accessToken}); 

    }catch(err){
        res.status(500).json(err);
    }
});

export default router;