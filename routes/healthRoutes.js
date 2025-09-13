import express from "express";
import { getHealth } from "../controllers/healthController.js";

const router = express.Router();

router.get("/", getHealth);

export default router;

//NEW CODE
// import express from "express";
// import { registerUser, getAllUsers } from "../controllers/healthController.js";

// const router = express.Router();

// router.post("/register", registerUser);
// router.get("/", getAllUsers);

// export default router;
