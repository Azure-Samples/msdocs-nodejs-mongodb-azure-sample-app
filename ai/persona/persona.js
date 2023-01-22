
import { PersonaDropdown } from '/ai/persona/personaDropdown.js'
import { CMS } from '/ai/collection/cms.js'
// import { Collection } from '/ai/collection/collection.js'


let cms = new CMS()
let data = cms.get('personaType').then((data) => {
    createForm(data)
    personasDropdown = new PersonaDropdown('personaDropdown', (persona) => {
        populateForm(persona)
    })
})


// var personas
var loaded = false
var personasDropdown
function createForm(personaType) {
    //if form doesn't exist return
    if (!document.getElementById('form')) return

    //for each key in personaType create a form element with label and input
    for (var key in personaType) {
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
        row.appendChild(input)
        //add row to form
        document.getElementById('form').appendChild(row)
    }
    //create new button
    var newButton = document.createElement('button')
    newButton.className = 'btn btn-primary'
    newButton.style.margin = '10px'
    newButton.innerHTML = 'New'
    newButton.onclick = function () {
        populateForm(cms.personaType)
    }

    //create submit button
    var submit = document.createElement('button')
    submit.className = 'btn btn-primary'
    submit.style.margin = '10px'
    submit.innerHTML = 'Submit'
    submit.onclick = addPersona

    //create delete button
    var deleteButton = document.createElement('button')
    deleteButton.className = 'btn btn-primary'
    deleteButton.style.margin = '10px'
    deleteButton.innerHTML = 'Delete'
    deleteButton.onclick = function () {
        personasDropdown.collection.remove(JSON.parse(document.getElementById('personaDropdown').value))
    }
    var row = document.createElement('div')
    row.className = 'row'
    row.appendChild(newButton)
    row.appendChild(submit)
    row.appendChild(deleteButton)
    document.getElementById('form').appendChild(row)

}

//on submit of form addPersona call addPersona function
function addPersona() {

    var persona = {}
    for (var key in cms.personaType) {
        let value = document.getElementById(key).value
        if (value != '') persona[key] = value
    }

    if (!persona._id) {
        personasDropdown.collection.add(persona)
    } else {
        personasDropdown.collection.update(persona)
    }
}


//on select of persona update form with persona details
function selectPersona() {
    populateForm(JSON.parse(document.getElementById('personaDropdown').value))
}

function populateForm(persona) {
    if (!persona) return
    //if form doesn't exist return
    if (!document.getElementById('form')) return


    for (var key in cms.personaType) {
        if (key == '__v') continue
        document.getElementById(key).value = (persona[key]) ? persona[key] : ''
    }
}
