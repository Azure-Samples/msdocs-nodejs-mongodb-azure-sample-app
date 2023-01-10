import { Schema, model, connect } from 'mongoose';
const objSchema = new Schema<any>({ any: Schema.Types.Mixed }, { strict: false });

function getModel(collection: string) {
    return model(collection, objSchema);
}

export async function get(collection: string, query?: any) {
    if (query) {
        return await getModel(collection).find(query).exec();
    } else {
        return  await getModel(collection).find().exec();
    }
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
export async function remove(collection: string, id: string) {
    return  await getModel(collection).deleteOne({_id:id}).exec()
        .then((obj: any) => {return obj} )
        .catch((err: any) => console.log(err));
}