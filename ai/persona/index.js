const personaType = {
        "_id": "string",
        "name": "", 
        "age": "", 
        "gender": "", 
        "Location": "", 
        "Socio_economic_status": "",
        "Preferences": "", 
        "Hobbies": "", 
        "Past_behaviors": "",
        "Attitudes": "", 
        "Beliefs": "", 
        "Lifestyle_choices": "",
        "Driving_forces": "", 
        "Aspirations": "",
        "Short_term_objectives": "", 
        "Long_term_ambitions": "",
        "Pain_points": "", 
        "Roadblocks": "", 
        "Struggles": "",
        "Frequency": "", 
        "Spend_amounts": "", 
        "Online_vs_in_store": "",
        "Navigation": "", 
        "Understanding": "", 
        "Usage": "",
        "Social_platforms": "", 
        "Search_preferences": "", 
        "Email_habits": ""
}
var personas
var loaded = false

function createForm() {
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
        populateForm(personaType)
    }

    //create submit button
    var submit = document.createElement('button')
    submit.className = 'btn btn-primary'
    submit.style.margin = '10px'
    submit.innerHTML = 'Submit'
    submit.onclick = addPersona

    var row = document.createElement('div')
    row.className = 'row'
    row.appendChild(newButton)
    row.appendChild(submit)
    document.getElementById('form').appendChild(row)

}


//onload fetch personas from crud rest api and update persona dropdown
function onload() {
    if (loaded) return
    loaded = true
    createForm()

    //get personas from local storage
    personas = JSON.parse(localStorage.getItem('personas'))
    if (personas == null) {
        fetch('/crud/persona').then(response => response.json()).then(lpersonas => {
            console.log('personas', lpersonas)
            personas = lpersonas;
            updatePersonas()
            
        })
    } else {
        updatePersonas()
    }
}
//on submit of form addPersona call addPersona function
function addPersona() {

    var persona = {}
    for (var key in personaType) {
        let value = document.getElementById(key).value
        if (value != '') persona[key] = value
    }
        

    if (!persona._id) {
    fetch('/crud/persona', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(persona)
    })
        .then(response => response.json())
        .then(data => {
            updatePersonas(data)
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    } else {
        //put persona to crud rest api
        fetch('/crud/persona', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(persona)
        })
            .then(response => response.json())
            .then(data => {
                updatePersonas(data)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}


//on select of persona update form with persona details
function selectPersona() {
    populateForm(JSON.parse(document.getElementById('personaDropdown').value))
}

function populateForm(persona) {

    //if form doesn't exist return
    if (!document.getElementById('form')) return

    for (var key in persona) {
        if (key == '__v') continue
        document.getElementById(key).value = persona[key]
    }
}
function updatePersonas(person) {
    if (person) {
        //if personas has person with same id update it
        if (personas.find(p => p._id == person._id)) {
            personas = personas.map(p => {
                if (p._id == person._id) return person
                return p
            })
        } else {
            //else add person to personas
            personas.push(person)
        }
    }
    localStorage.setItem('personas', JSON.stringify(personas))

    //update persona dropdown
    var personaDropdown = document.getElementById('personaDropdown')
    personaDropdown.innerHTML = ''
    for (var persona of personas) {
        var option = document.createElement('option')
        option.value = JSON.stringify(persona)
        option.text = persona.name
        personaDropdown.appendChild(option)
    }
    selectPersona()
}