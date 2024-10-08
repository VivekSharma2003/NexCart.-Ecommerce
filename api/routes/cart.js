import express from "express"
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from "./verifyToken.js";
import Cart from "../models/Cart.js"

const router = express.Router();

//CREATE

router.post("/", verifyToken, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id });

        if (cart) {
            cart.products = req.body.products;
            cart = await cart.save();
        } else {
            const newCart = new Cart({
                userId: req.user._id,
                products: req.body.products,
            });
            cart = await newCart.save();
        }

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});


//UPDATE

router.put("/:id", verifyTokenAndAuthorization, async (req, res)=> {
    
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
        res.status(200).json(updatedCart);
    } catch (err){
        res.status(500).json(err);
    }
});

//DELETE

router.delete("/:id", verifyTokenAndAuthorization, async (req, res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted...");
    }catch(err){
        res.status(500).json(err);
    }
});

// //GET USER CART

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/find", verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});


//GET ALL 

router.get("/", verifyTokenAndAdmin, async (req, res)=>{
    try{
        const carts = await Cart.find();
        res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err);
    }
});    

export default router;