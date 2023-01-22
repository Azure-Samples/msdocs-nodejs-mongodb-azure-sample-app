import { Component } from '/ai/cms/component.js'
import { html } from '/ai/cms/popup/html.js'

export class popup extends Component {
    popup
    constructor(element, cms, callback) {
        super(element, cms, callback)
        this.element.innerHTML = html
        let options = {
            keyboard: false
        }
        //create a custom event listenr on window to open the popup
        this.element.addEventListener('openModel', function (e) {
            console.log(e.detail.id)
            let popup = new bootstrap.Modal(document.getElementById('myModal'), options)
             popup.show()
        })

    }

}