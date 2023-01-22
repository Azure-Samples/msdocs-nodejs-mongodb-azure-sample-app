import { get, post, put, remove, getNames, getByName, upsert } from '/ai/collection/document.js'

//create javascript class
export class Collection {
    collection
    callback

    constructor(collection, callback) {
        this.callback = callback;
        this.collection = collection;
    }

    get(id = '') {
        let data = localStorage.getItem(this.collection + id);
        if (data == null || data.length < 3) {
            return get(this.collection, id)
                .then(data => {
                    localStorage.setItem(this.collection + id, JSON.stringify(data))
                    if (this.callback) this.callback(data)
                    return data
                })
        } else {
            if (this.callback) this.callback(JSON.parse(data))
            return JSON.parse(data)
        }
    }

    //function to post data to the API
    add(obj) {
        post(this.collection, obj).then(data => {
            if (this.callback) {
                localStorage.removeItem(this.collection)
                this.get(data._id)
            }
        })
    }
    //function to update data in the API
    async update(obj) {
        put(this.collection, obj).then(data => {
            if (this.callback) {
                localStorage.removeItem(this.collection + obj._id)
                localStorage.removeItem(this.collection)
                this.get(obj._id)
            }
        })
    }
    async upsert(obj, arrayName) {
        upsert(this.collection, arrayName, obj).then(data => {
            if (this.callback) {
                localStorage.removeItem(this.collection + obj._id)
                localStorage.removeItem(this.collection)
                this.get(obj._id)
            }
        })
    }
    async remove(obj) {
        remove(this.collection, obj).then(data => {
            if (this.callback) {
                localStorage.removeItem(this.collection+obj._id)
                localStorage.removeItem(this.collection)
                this.get()
            }
        })
    }
    async getNames() {
        return await getNames().then(data => {
            if (this.callback) this.callback(data)
            return data
        })
    }
    async getByName(name) {
        return await getByName(name).then(data => {
            if (this.callback) this.callback(data)
            return data
        }) .catch(err => {
            console.error(err)
        })
    }

}

