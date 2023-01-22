import { Component } from '/ai/cms/component.js'

export class radio extends Component {
    constructor(element, cms, callback) {
        super(element, cms, callback)
        if (cms.page.data[this.id]) {
            this.setOptions(cms.page.data[this.id], this.callback)
        }
    }
    setOptions(options, callback) {
        this.callback = callback
        if (!Array.isArray(options)) {
            Object.keys(options).forEach(key => {
                this.initButtons(this.id, key, options[key])
            })
        } else {
            options.forEach(obj => {
                if (typeof obj == 'string') obj = JSON.stringify(obj) 
                this.initButtons(obj.id, obj.name, obj.value)
            })
        }
    }
    setButtons(target) {
        let id = target.getAttribute('for')
        let t = target.parentElement.querySelector(`#${id}`)
        let parent = target.parentElement
        let children = parent.children
        for (let i = 0; i < children.length; i++) {
            children[i].checked = false;
        }
        t.checked = true
        return t.value
    }
    initButtons(id, name, value) {
        let radio = document.createElement('input')
        radio.type = 'radio'
        radio.classList.add('btn-check')
        radio.name = name  
        radio.value = value
        radio.id = id
        radio.autocomplete = 'off'

        let label = document.createElement('label')
        label.classList.add('btn')
        label.classList.add('btn-outline-primary')
        label.setAttribute('for', id)
        label.innerHTML = name
        
        this.element.appendChild(radio)
        this.element.appendChild(label)


        label.addEventListener('click', (event) => {
            if (this.callback) {
                this.callback(event.target.innerHTML, this.setButtons(event.target))
            }
        })
    }
}