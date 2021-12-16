require("express-async-errors");
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");
const ownerAuthorizationMiddleware = require("../middlewares/ownerAuthorizationMiddleware");
const customError = require("../helpers/customError");
const express = require("express");
const router = express.Router();

const Post = require("../models/Post");

//get all Posts/********************************************** */
router.get("/", authenticationMiddleware, async (req, res, next) => {
  let postList = await Post.find().populate("postedBy");
  if (!postList) {
    throw customError(400, "get all posts failed");
  }
  res.json({ message: "get all posts success", postList });
});

//get post by id**********************************************
router.get("/:id",authenticationMiddleware,async (req, res, next) => {
  let postId = req.params.id;
  let post = await Post.findById(postId);
  if (!post) {
    throw customError(400, "get post by id faild");
  }
  res.json({ message: "get post by id success ", post });
});

//create new post*******************************************************
router.post("/newpost", authenticationMiddleware, async (req, res, next) => {
  let { postTitle, postBody} = req.body;
  //const  {_doc:{_id:userCurrentId}}=req.currentUser

  //let userId=userCurrentId.toHexString()
  //console.log("eeeeeeeeeeee",req.currentUser)
  let postedBy=req.currentUser;
  let newPost = new Post({ postTitle, postBody, postedBy });
  await newPost.save();
  if (!newPost) {
    throw customError(400, "new post created failed");
  }
  res.json({ message: "new post created sucsess", newPost });
});

//update post by id******************************************
router.patch(
  "/:id",
  authenticationMiddleware,
  ownerAuthorizationMiddleware,
  async (req, res, next) => {
    let PostId = req.params.id;
    let { postTitle, postBody} = req.body;
   let postedBy=req.currentUser.id;
    let post = await Post.findByIdAndUpdate(
      PostId,
      {
        postTitle,
        postBody,
        postedBy,
      },
      {
        new: true, // to return new record after updated
        runValidators: true,
        omitUndefined: true, //untill doesn't update undefined
      }
    );
    if (!post) {
      throw customError(400, "post updated faild");
    }
    res.json({ message: "post updated sucsess", post });
  }
);

//delete post************************************
router.delete(
  "/:id",
  authenticationMiddleware,
  ownerAuthorizationMiddleware,
  async (req, res, next) => {
    let postId = req.params.id;
    let post = await Post.findByIdAndDelete(postId);
    //console.log("Post",Post);
    // let deletetedPost={...Post._doc,isDeleted:true}
    // console.log(deletetedPost);
    if (!post) {
      throw customError(400, "post delated faild");
    }
    res.send({ message: "post deleted", post });
  }
);
module.exports = router;
