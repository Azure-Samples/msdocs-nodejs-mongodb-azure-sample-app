

//export async function to return await fetch data from the API
export async function get(collection, id) {
    return await fetch(`/crud/${collection}/${id}`,req('GET'))
        .then(response => response.json())
}

//export async function to post data to the API
export async function post(collection, obj) {
    return await fetch(`/crud/${collection}`, req('POST', obj))
        .then(response => response.json())
}

//export async function to update data in the API
export async function put(collection, obj) {
    return await fetch(`/crud/${collection}`,req('PUT', obj))
        .then(response => response.json())
}

//export async function to update data in the API
export async function upsert(collection, arrayName, obj) {
    return await fetch(`/crud/${collection}/upsert/${arrayName}`,req('PUT', obj))
        .then(response => response.json())
}
export async function remove(collection, obj) {
    return await fetch(`/crud/${collection}/${obj._id}`,req('DELETE'))
    .then(response => response.text())
}

let req = (method, body) => { 
    if (typeof body !== 'string') body =  JSON.stringify(body)
    return {
    method: method,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    body: body
}}

//export async function to return await fetch data from the API
export async function  getNames(collection) {
    return await fetch(`/crud/${collection}/names`, req('GET'))
        .then(response => response.json())
    }
//export async function to return await fetch data from the API
export async function getByName(collection, name) {
    return await fetch(`/crud/${collection}/names/${name}`, req('GET'))
        .then(response => {
            if (response.status === 200) return response.json()
            else throw new Error(response.status)
        })
}

export const utils = {
    sessionObject: (key) => {
        let t = sessionStorage.getItem(key)
        if (t && t !== 'undefined') {
            return JSON.parse(t)
        } else {
            return false
        }
    }
}
