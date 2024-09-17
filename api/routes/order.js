import express from "express"
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from "./verifyToken.js";
import Order from "../models/Order.js"

const router = express.Router();

//CREATE

router.post("/", verifyToken, async (req, res)=>{
    const newOrder = new Order(req.body)

    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    }catch(err){
        res.status(500).json(err);
    }
});

//UPDATE

router.put("/:id", verifyTokenAndAdmin, async (req, res)=> {
    
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
        res.status(200).json(updatedOrder);
    } catch (err){
        res.status(500).json(err);
    }
});

//DELETE

router.delete("/:id", verifyTokenAndAdmin, async (req, res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been deleted...");
    }catch(err){
        res.status(500).json(err);
    }
});

// //GET USER ORDERS

router.get("/find/:userId", verifyTokenAndAuthorization ,async (req, res)=>{
    try{
        const orders = await Order.find({ userId: req.params.userId });
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }
});

//GET ALL 

router.get("/", verifyTokenAndAdmin, async (req, res)=>{
    try{
        const orders = await Order.find();
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    total: { $sum: "$sales" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        const formattedIncome = income.map((item) => ({
            month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
            total: item.total,
        }));

        res.status(200).json(formattedIncome);
    } catch (err) {
        res.status(500).json(err);
    }
}); 

export default router;