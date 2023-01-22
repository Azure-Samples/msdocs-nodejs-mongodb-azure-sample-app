export class Component {
    id
    cms
    element
    callback
    data
    constructor(element, cms, callback, html) {
        this.id = element.id
        this.cms = cms
        this.element = element
        this.callback = callback
        if (html) {
            let div = document.createElement('div')
            div.innerHTML = html
            element.appendChild(div)
        }
    }
    save(data) {
        this.cms.save()
    }
}