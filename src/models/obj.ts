import { Schema, model, connect } from 'mongoose';
const objSchema = new Schema<any>({ any: Schema.Types.Mixed }, { strict: false });

function getModel(collection: string) {
    return model(collection, objSchema);
}

export async function get(collection: string, query?: any, projection?: any) {
    return await getModel(collection).find(query,projection).exec();
}
export async function getDocument(collection: string, query: any) {
    return await getModel(collection).findOne(query).exec();
}
export async function post(collection: string, data: any) {
    const objModel = model(collection, objSchema)
    const obj = new objModel(data)
    return await obj.save().then((obj: any) => {return obj} ).catch((err: any) => console.log(err))
}
export async function put(collection: string, data: any) {
    await getModel(collection).findByIdAndUpdate(data._id, data).exec();
    return data;
}
export async function upsert(collection: string, arrName: string, data: any) {
    const o:any = {};
    const obj = await getModel(collection).findOne({name: data.name}, {name:1}).exec();
    o[arrName]= data[arrName]
    console.log("obj", o)
    if (obj) return await getModel(collection).findOneAndUpdate({_id:obj._id}, {$push: o}).exec();
    else return post(collection, data);
}
export async function remove(collection: string, id: string) {
    return  await getModel(collection).deleteOne({_id:id}).exec()
        .then((obj: any) => {return obj} )
        .catch((err: any) => console.log(err));
}