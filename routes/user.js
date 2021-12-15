require("express-async-errors");
const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");
const validationMiddleWare = require("../middlewares/validationMiddleware");
const User = require("../models/user");
const customError = require("../helpers/customError");

//get all users
router.get("/", authenticationMiddleware, async (req, res, next) => {
  let userList = await User.find();
  if (!userList) {
    throw customError(400, "get usersdata faild ");
  }
  res.json({ message: "get usersdata sucess ", userList });
});
//get by id********************************************
router.get("/:id", async (req, res, next) => {
  let userId = req.params.id;
  let user = await User.findById(userId);
  if (!user) {
    throw customError(400, "get userdata by id faild");
  }
  res.json({ message: "get userdata by id sucess", user });
});
//regsiter*********************************************

router.post(
  "/register",
  validationMiddleWare(
    check("passward")
      .isLength({
        min: 5,
      })
      .withMessage("2 chars at least ")
      .withMessage("must contain a number")
  ),
  async (req, res, next) => {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email, password });
    await newUser.save();
    if (!newUser) {
      throw customError(400, "register faild");
    }
    res.json({ message: "register sucsess", newUser });
  }
);
//login*******************************************************
router.post("/login", async (req, res, next) => {
  let { username, password } = req.body;
  let user = await User.findOne({ username }).populate("userPosts");
  if (!user) {
    throw customError(400, "user name  worng");
  }
  let isMatch = await user.comparePassword(password, user.password);
  if (!isMatch) {
    throw customError(400, " password worng");
  }
  const token = await user.generateUserToken();
  if (!token) {
    throw customError(400, "no token generated");
  }
  res.json({ message: "login sucess", user, token });
});
/****update user********************************* */
router.patch(
  "/:id",
  authenticationMiddleware,
  validationMiddleWare(
    check("passward")
      .isLength({
        min: 5,
      })
      .withMessage("2 chars at least ")
      .withMessage("must contain a number")
  ),
  async (req, res) => {
    let userId = req.params.id;
    let { username, email, password } = req.body;
    let updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        password,
        email,
      },
      {
        new: true, // to return new record after updated
        runValidators: true,
        omitUndefined: true, //untill doesn't update undefined
      }
    );
    if (!updatedUser) {
      throw customError(400, "userUpdated faild");
    }
    res.json({ message: "userUpdated success", updatedUser });
  }
);

/****************delete user by id ************************* */
router.delete("/:id", authenticationMiddleware, async (req, res) => {
  let userId = req.params.id;
  let user = await User.findByIdAndDelete(userId);
  //    let deletetedUser={...user._doc,isDeleted:true}
  if (!user) {
    throw customError(400, "delete user faild ");
  }
  res.send({ messsage: "delete user success " });
});
module.exports = router;
