import { Router } from "express";
import {
    loginUser,
    logoutUser,
    signupUser,
    changeCurrentPassword,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/signup").post(signupUser)
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/change-password").patch(verifyJWT, changeCurrentPassword)

export default router