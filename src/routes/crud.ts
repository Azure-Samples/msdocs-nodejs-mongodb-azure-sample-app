// import express and obj model
import express from "express";
import { model } from "mongoose";
import { get, post, put, remove } from '../models/obj';

// create router
const router = express.Router();

// // devine crud routes
router.get("/:collection", async (req, res) => {
    res.send(await get(req.params.collection));
});

router.get("/:collection/:id", async (req, res) => {
    res.send(await get(req.params.collection, {_id: req.params.id}));
});

router.post("/:collection", async (req, res) => {
    res.send(await post(req.params.collection, req.body));
});

router.put("/:collection", async (req, res) => {
    res.send(await put(req.params.collection, req.body));
});

 router.delete("/:collection/:id", async (req, res) => {
    await remove(req.params.collection, req.params.id);
    res.send("success");
});

export default router;
// Test code
// post('testCollection', {name: 'firstName'}).then(() =>
//     get('testCollection').then((obj:any) => console.log(obj))
// );

// put('testCollection', { _id: "63bd918397f6bcdaf104f846", name: 'lastName' }).then((obj: any) =>
//        get('testCollection').then((obj:any) => console.log(obj))
// )

// remove('testCollection', "63bd918397f6bcdaf104f846").then(() =>
//         get('testCollection').then((obj:any) => console.log(obj))
// );
