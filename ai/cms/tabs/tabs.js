import { Component } from '/ai/cms/component.js'
import { html } from '/ai/cms/tabs/html.js'

export class tabs extends Component {
    constructor(element, cms, callback) {
        super(element, cms, callback)
        //get children of element
        var children = this.element.children
        //create ul element
        var ul = document.createElement('ul')
        ul.className = 'nav nav-tabs'
        //for each child of element
        for (var i = 0; i < children.length; i++) {
            //create li element
            var li = document.createElement('li')
            li.className = 'nav-item'

            //create a element
            var a = document.createElement('a')
            a.className = 'nav-link'
            a.href = '#'+children[i].getAttribute('id')
            
            //set a innerHTML to child attribute name
            a.innerHTML = children[i].getAttribute('name')
            window.addEventListener('hashchange', function () {
                //get location hash from window.location.href and split on # and get second element which is tab
                this.setTab(window.location.href.split('#')[1])
            }.bind(this))

            //add a to li
            li.appendChild(a)
            //add li to ul
            ul.appendChild(li)
        }
        //add ul to top of element
        this.element.insertBefore(ul, this.element.firstChild)

        if (window.location.href.split('#')[1]){
            this.setTab(window.location.href.split('#')[1])
        } else {
            this.setTab(children[1].getAttribute('id'))
        }
    }
    setTab(id) {
        //for children of ul find a with href = "#id" and set class to active
        var children = this.element.children[0].children
        for (var i = 0; i < children.length; i++) {
            if (children[i].children[0].href.includes(id)) {
                children[i].children[0].className = 'nav-link active'
            } else {
                children[i].children[0].className = 'nav-link'
            }
        }
        //for children of element find child with id = id and set style to display: block
        var children = this.element.children
        for (var i = 1; i < children.length; i++) {
            if (children[i].id == id) {
                children[i].style.display = 'block'
            } else {
                children[i].style.display = 'none'
            }
        }
    }
}