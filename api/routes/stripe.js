import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);

router.post("/payment", async (req, res) => {
    try {
        const payment = await stripe.charges.create({
            source: req.body.tokenId,
            amount: req.body.amount,
            currency: "inr",
        });
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;

