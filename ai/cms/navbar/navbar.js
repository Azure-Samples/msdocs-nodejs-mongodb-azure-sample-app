import { Component } from '/ai/cms/component.js'
import { html } from '/ai/cms/navbar/html.js'

export class navbar extends Component {
    constructor(element, cms, callback) {
        super(element, cms, callback)
        this.element.innerHTML = html
    }
}