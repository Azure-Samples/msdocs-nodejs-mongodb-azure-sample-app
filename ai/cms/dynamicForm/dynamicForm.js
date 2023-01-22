import { Component } from '/ai/cms/component.js'

export class dynamicForm extends Component {
    formData = {}
    constructor(element, cms, callback) {
        super(element, cms, callback)
        this.createForm({})
        //set element style to display: none
        this.element.style.display = 'none'

    }

    createForm(formData, callback) {
        //remove all children from this.element
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild)
        }
        this.formData = formData
        if (callback) this.callback = callback
        //if form doesn't exist return
        if (!this.element) return

        //for each key in this.formData create a form element with label and input
        for (var key in this.formData) {
            if (key === '__v') continue
            // create a row with a label and input
            var row = document.createElement('div')
            row.className = 'row'
            if (key == '_id') row.style.visibility = 'hidden'
            //create label
            var label = document.createElement('label')
            label.className = 'col-sm-2 col-form-label'
            label.style.width = '100px'
            label.innerHTML = key
            row.appendChild(label)
            //create input
            var input = document.createElement('input')
            input.className = 'form-control col-sm-10'
            input.id = key
            input.value = this.formData[key]
            row.appendChild(input)
            //add row to form
            this.element.appendChild(row)
        }
        //create button group
        var buttonGroup = document.createElement('div')
        buttonGroup.className = 'btn-group'
        buttonGroup.role = 'group'
        buttonGroup.ariaLabel = 'Basic example'
        buttonGroup.style = 'width: 300px;margin: 10px'
       //create new button
        var newButton = document.createElement('button')
        newButton.className = 'btn btn-primary'
        newButton.innerHTML = 'New'
        newButton.type = 'button'
        newButton.onclick = function () {
            populateForm(cms.this.formData)
        }

        //create submit button
        var submit = document.createElement('button')
        submit.className = 'btn btn-primary'
        submit.innerHTML = 'Submit'
        submit.type = 'button'
        // submit.onclick = addPersona

        //create delete button
        var deleteButton = document.createElement('button')
        deleteButton.type = 'button'
        deleteButton.className = 'btn btn-primary'
        deleteButton.innerHTML = 'Delete'
        deleteButton.onclick = function () {
            personasDropdown.collection.remove(JSON.parse(document.getElementById('personaDropdown').value))
        }
        var row = document.createElement('div')
        row.className = 'row'
        buttonGroup.appendChild(newButton)
        buttonGroup.appendChild(submit)
        buttonGroup.appendChild(deleteButton)
        row.appendChild(buttonGroup)
        // class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
        this.element.appendChild(row)
    }
}
