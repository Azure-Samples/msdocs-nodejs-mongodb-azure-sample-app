const express = require("express");
const { Router } = express;
const { body } = require("express-validator");
const { UploadModel } = require("../models/upload");
const { WritingTask } = require("../models/writingTask");
const { isAuth } = require("../middleware/is-auth");
const { UserModel } = require("../models/user");
const { sendMail } = require("../middleware/email");
const axios = require("axios");

const routes = Router();

routes.get("/", isAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const writingTasks = await WritingTask.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();
    const totalDocuments = await WritingTask.countDocuments();
    const totalPages = Math.ceil(totalDocuments / pageSize);

    const nextPage = page + 1 > totalPages ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;

    res.json({
      writingTasks,
      totalPages,
      currentPage: page,
      nextPage,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      previousPage,
      pageSize,
      totalDocuments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

routes.get("/my-tasks", isAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.id).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const writingTasks = await WritingTask.find({
      creator: req.id,
    })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();
    const totalDocuments = await WritingTask.countDocuments();
    const totalPages = Math.ceil(totalDocuments / pageSize);

    const nextPage = page + 1 > totalPages ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;

    res.json({
      writingTasks,
      totalPages,
      currentPage: page,
      nextPage,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      previousPage,
      pageSize,
      totalDocuments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

routes.get("/picked-tasks", isAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.id).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const writingTasks = await WritingTask.find({
      pickedBy: req.id,
    })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();
    const totalDocuments = await WritingTask.countDocuments();
    const totalPages = Math.ceil(totalDocuments / pageSize);

    const nextPage = page + 1 > totalPages ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;

    res.json({
      writingTasks,
      totalPages,
      currentPage: page,
      nextPage,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      previousPage,
      pageSize,
      totalDocuments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

routes.get("/:id", isAuth, async (req, res) => {
  try {
    const writingTask = await WritingTask.findById(req.params.id).exec();
    if (!writingTask) {
      return res.status(404).json({ error: "Writing task not found" });
    }
    res.json(writingTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sorry, something went wrong :/" });
  }
});

routes.post(
  "/",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("description").trim().isLength({ min: 5 }),
    body("fileId").trim().isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const upload = await UploadModel.findById(req.body.fileId).populate(
        "creator"
      );
      if (!upload) {
        return res.status(404).json({ error: "File not found" });
      }

      const user = await UserModel.findById(req.id).exec();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const uploader = upload.creator;
      const { transactionId, fileId, deadline } = req.body;
      const writingTask = new WritingTask({
        fileId,
        title: upload.title,
        description: upload.description,
        budget: upload.fileAmount,
        writingFee: upload.fileAmount * 0.5,
        deadline,
        transactionId,
        creator: req.id,
      });

      await writingTask.save();

      upload.amountReceived += upload.fileAmount * 0.8;
      await upload.save();

      uploader.wallet += upload.fileAmount * 0.8;
      await uploader.save();

      user.writingTasks.push(writingTask);
      await user.save();

      res.status(201).json(writingTask);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Sorry, something went wrong :/" });
    }
  }
);

routes.post("/verify-code", isAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.id).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { transactionId } = req.body;
    const writingTask = await WritingTask.findOne({
      transactionId,
    }).populate("pickedBy");

    if (!writingTask) {
      return res.status(404).json({ error: "Writing task not found" });
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (response.data.status === "success") {
      WritingTask.findOneAndUpdate({ status: "success" });

      user.wallet += writingTask.writingFee;

      return res.json(response);
    } else {
      WritingTask.findOneAndUpdate(
        { paycode: transactionId },
        { status: "failed" }
      );

      return res.status(400).json({
        message: "Payment failed or transactionId is wrong",
        response,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Sorry, something went wrong :/",
      message: "Error processing checks",
    });
  }
});

routes.post(
  "/pick",
  isAuth,
  [body("id").isString().isLength({ min: 2 })],
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.id).exec();
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const upload = await WritingTask.findById(req.body.id)
        .populate("creator")
        .exec();

      if (!upload) {
        return res.status(404).json({ error: "Upload not found" });
      }
      if (upload.picked) {
        return res.status(400).json({ error: "Upload already picked" });
      }

      const uploader = upload.creator;

      upload.picked = true;
      upload.pickedBy = req.id;
      await upload.save();
      sendMail(
        uploader.email,
        "Writing Task Picked",
        `<h1>Your Task of ${upload.title} was picked by ${user.firstName}.</h1>`
      );

      sendMail(
        user.email,
        "Task Picked",
        `<h1>You picked ${upload.title} by ${uploader.firstName}.</h1>`
      );
      return res.status(200).json({ message: "Upload picked successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

module.exports = routes;
