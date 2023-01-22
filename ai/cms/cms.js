// Description: CMS class to fetch data from the API

import { Collection } from '/ai/collection/collection.js'
import { utils } from '/ai/collection/document.js'

export class CMS {
    page = {}
    classes = {}
    cms
    constructor() {
        this.initPage()
        this.cms = new Collection('cms')
        //change body visibility to visible
        document.body.style.visibility = 'visible'
    }

    async save() {
        this.page.data.name = this.page.meta.id
        let method = (this.page.data._id) ? 'PUT' : 'POST'
        return await fetch(`/crud/cms`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.page.data)
        }).then(response => response.json()).catch(() => {
            console.log("error");
        }).then((data) => {
            sessionStorage.setItem(data.name, JSON.stringify(data))
            return data
        })
    }
    initPage() {
        //update page with data from page all meta tags
        let pageMetaElements = document.getElementsByTagName('meta')
        this.page.meta = {}
        for (let i = 0; i < pageMetaElements.length; i++) {
            this.page.meta[pageMetaElements[i].name] = pageMetaElements[i].content
        }
        this.page.title = document.title
        this.page.url = window.location.href
        this.page.path = window.location.pathname
        this.id = this.page.meta.id
        this.page.data = {}

    }
    async initComponents() {

        this.page.data = utils.sessionObject(this.page.meta.id)
        if (!this.page.data) {
            await this.cms.getByName(this.page.meta.id).then((data) => {
                //save data to sessionStorage
                sessionStorage.setItem(this.page.meta.id, JSON.stringify(data))
                this.page.data = data
            })
        }

        //get all the elements with the cms class
        this.page.elements = document.getElementsByClassName('cms')
        this.page.componentObject = {}
        // if this.page.data is empty then create a new object
        if (!this.page.data) {
            this.page.data = {
                name: this.page.meta.id,
                title: this.page.title,
                url: this.page.url,
                path: this.page.path,
                elements: {}
            }
        }
        //for each element load modules

        for (let i = 0; i < this.page.elements.length; i++) {
            let element = this.page.elements[i]
            let id = element.id
            let modules = element.getAttribute('data-modules')
            let components = {}
            if (modules && components[modules] === undefined) {
                components[modules] = await import(`/ai/cms/${modules}/${modules}.js`)
            }
            if (components[modules]) {
                this.classes[modules] = components[modules][modules]
                this.page.componentObject[id] = new this.classes[modules](element, this)
            } else {
                element.innerText = this.page.data[element.id]
                if (this.page.data.links && this.page.data.links[element.id]) {
                    // create an onclick event for the element that will set the href
                    // to the link in this.page.data.links[element.id] 
                    element.onclick = () => {
                        window.location.href = this.page.data.links[element.id]
                    }
                }
                //if element attribute data-for move the element into the element with the id of data-for
                if (element.getAttribute('data-for')) {
                    document
                        .getElementById(element.getAttribute('data-for'))
                        .appendChild(element)
                        
                }
            }
        }
        this.isEdit()
    }
    //TODO refactor out
    async isEdit() {
        if (localStorage.getItem('enableEditor') !== 'true') return
        let cmsEdit = await import(`/ai/cms/edit/edit.js`)
        let editor = new cmsEdit.CMSEditor(this)
    }
    findElement(id) {
        for (let i = 0; i < this.page.elements.length; i++) {
            let element = this.page.elements[i]
            if (element.id === id) {
                return element
            }
        }
    }

}