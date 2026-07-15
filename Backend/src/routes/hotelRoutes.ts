import express from "express";

import {
 getHotels,
 getHotelById,
 createHotel,
 updateHotel,
 deleteHotel
} from "../controllers/hotelControllers";


import { authenticate } from "../middlewares/authMiddlewares";
import { adminOnly } from "../middlewares/roleMiddlewares";


const router = express.Router();


// PUBLIC
router.get("/", getHotels);

router.get("/:id", getHotelById);


// ADMIN
router.post(
 "/",
 authenticate,
 adminOnly,
 createHotel
);


router.put(
 "/:id",
 authenticate,
 adminOnly,
 updateHotel
);


router.delete(
 "/:id",
 authenticate,
 adminOnly,
 deleteHotel
);



export default router;