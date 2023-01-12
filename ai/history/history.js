
import { PersonaDropdown } from '/ai/persona/personaDropdown.js'
import { Collection } from '/ai/collection/collection.js'

var personasDropdown = new PersonaDropdown('personaDropdown', (persona) => {
    console.log( JSON.stringify(persona))
    })
var token = localStorage.getItem('openai_key')        
var historyCollection = new Collection(token, (history) => {
    console.log(history)
})
var records = historyCollection.get().then( (history) => {
    //for each record in history call addRecord function
    history.forEach((record) => {
        addRecord(record)
    })
})
function addRecord(record) {
    //create a new li element with record.persona as the text
    var li = document.createElement('li')
    //create a new div with record.persona
    var persona = document.createElement('div')
    persona.innerText = record.persona
    //create a new div with record.prompt
    var prompt = document.createElement('div')
    prompt.innerText = record.prompt
    
    //create a new div with record.completion hidden
    var completion = document.createElement('div')
    completion.innerText = record.completion
    completion.style.visibility = 'hidden'
    //append div to li
    li.appendChild(persona)
    li.appendChild(prompt)
    li.appendChild(completion)
    //on click of li toggle visibility of completion
    li.addEventListener('click', function() {
        if (completion.style.visibility == 'hidden') {
            completion.style.visibility = 'visible'
        } else {
            completion.style.visibility = 'hidden'
        }   
    })
    //append li to ul with id=history
    document.getElementById('historyList').appendChild(li)
}