//create javascript class
export class Collection {
    collection;
    watchCallback;
    constructor(lcollection, lwatchCallback) {
        this.collection = lcollection;
        this.watchCallback = lwatchCallback;

        let data = localStorage.getItem(this.collection);
        if (data == null || data.length < 3 
        ) {
            this.get()
        } else {
            if (this.watchCallback) this.watchCallback(JSON.parse(data))
        }
    }
    //function to fetch data from the API
    async get() {
        return await fetch(`/crud/${this.collection}`)
            .then(response =>response.json())
            .then( data => {
                localStorage.setItem(this.collection, JSON.stringify(data))
                if (this.watchCallback) this.watchCallback(data)
                return data
            })
    }

    //function to post data to the API
    async add(obj) {
        return await fetch(`/crud/${this.collection}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        }).then(response => response.json())
        .then( data => {
            localStorage.setItem(this.collection, JSON.stringify(data))
            if (this.watchCallback) this.watchCallback(data)
            return data
        })
    }
    //function to update data in the API
    async update(obj) {
        return await fetch(`/crud/${this.collection}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        }).then(response => response.json())
        .then( data => {
            localStorage.setItem(this.collection, JSON.stringify(data))
            if (this.watchCallback) this.watchCallback(data)
            return data
        })
    }
    async remove(obj) {
        let id = obj._id;
        return await fetch(`/crud/${this.collection}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            if (this.watchCallback) this.get()
            return response
        });
    }
}