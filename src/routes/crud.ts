// import express and obj model
import express from "express";
import { model } from "mongoose";
import { get, post, put, remove, getDocument, upsert } from '../models/obj';

// create router
const router = express.Router();


// // devine crud routes
router.get("/:collection/names", async (req, res) => {
    res.send(await get(req.params.collection,{},{name:1}));
});

// // devine crud routes
router.get("/:collection/names/:name", async (req, res) => {
    const doc = await getDocument(req.params.collection,{name:req.params.name});
    if (!doc) {
        // return 404
        res.status(404).send("Not found");
    } else res.send(doc)
});
// // devine crud routes
router.get("/:collection/names/:name", async (req, res) => {
    res.send(await getDocument(req.params.collection,{name:req.params.name}));
});
// // devine crud routes
router.get("/:collection", async (req, res) => {
    res.send(await get(req.params.collection));
});

router.get("/:collection/:id", async (req, res) => {
    res.send(await getDocument(req.params.collection, {_id: req.params.id}));
});

router.post("/:collection", async (req, res) => {
    res.send(await post(req.params.collection, req.body));
});

router.put("/:collection", async (req, res) => {
    res.send(await put(req.params.collection, req.body));
});

router.put("/:collection/upsert/:arrayName", async (req, res) => {
    res.send(await upsert(req.params.collection,req.params.arrayName, req.body));
});

 router.delete("/:collection/:id", async (req, res) => {
    await remove(req.params.collection, req.params.id);
    res.send("success");
});

export default router;
