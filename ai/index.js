import { Collection } from '/ai/collection/collection.js'
import { PersonaDropdown } from '/ai/persona/personaDropdown.js'

let media = {
    tweet: 4000-280,
    blogs:4000-500*5,
    emails:4000-125*5,
    newsArticles:4000-2500
}

let characterCount = 0;
let maxLength=1000
var attribues
var person
let text = decodeURIComponent(getQueryVariable("text"));
let clipboard = document.getElementById("clipboard")
let personaTextArea = document.getElementById('person')
//assign submitButton to button with id=submit
let submitButton = document.getElementById('submit')
//assign mediaType to value of select with id=media
let mediaType = document.getElementById('media')

clipboard.innerText = (!text) ? text : '';
var running = false;
var token = localStorage.getItem('openai_key')       
var historyCollection = new Collection(token, (history) => {
    console.log(history)
})
//for each key in media add a new option to select with id=media
for (var key in media) {
    var option = document.createElement('option')
    option.value = media[key]       
    option.innerText = key
    document.getElementById('media').appendChild(option)
    selectMedia()
}

//update character count as text is typed in clipboard
clipboard.addEventListener("keydown", function () {
    characterCount = document.getElementById("clipboard").value.length;
    document.getElementById("wordcount").innerHTML = characterCount + `/${maxLength} characters`;
});
//on submit of form call submit function
submitButton.addEventListener('click', submit)
//on change of select with id=media call selectMedia function
mediaType.addEventListener('change', selectMedia)

function selectMedia() {
 
    maxLength=Number(document.getElementById('media').value)
    // set the max length of textarea with id=clipboard to value of select with id=media
    clipboard.setAttribute('maxLength', maxLength)
    document.getElementById("wordcount").innerHTML = characterCount + `/${maxLength} characters`;
}


// if localstorage has 'openai_key' hide div with id=openai_key_div
if (localStorage.getItem('openai_key')) {
    document.getElementById('openai_key_div').style.display = 'none';
    document.getElementById('not_openai_key_div').style.display = 'block';
}
// if localstorage doesn't have 'openai_key' show div with id=openai_key_div
else {
    document.getElementById('openai_key_div').style.display = 'block';
    document.getElementById('not_openai_key_div').style.display = 'none';
}

// on click of button with id=saveKey, set localstorage 'openai_key' to value of input with id=openai_key
function saveKey() {
    localStorage.setItem('openai_key', document.getElementById('openai_key').value);
    document.getElementById('openai_key_div').style.display = 'none';
    document.getElementById('not_openai_key_div').style.display = 'block';
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}
//get query parameter called text and put it in paragraph with id=clipboard
//url decode clickedElement.clickedElement and put it in variable text

function submit() {
    if (running) {
        return;
    }
    running = true;
    document.getElementById("summery").innerHTML = ''
    let prompt = clipboard.value
    let persona = `create a ${mediaType.textContent} written by ${personaTextArea.value} about`
    //get a length of the prompt
    let promptLength = prompt.length
    prompt = persona.substring(0,maxLength-prompt.length-1) + prompt
    let size = 4000 - maxLength
    getCompletion(prompt, size, event => {
        if (event.data[0].finish_reason === 'stop') {
            running = false; 
            var completion = document.getElementById("summery").innerHTML
            var historyEntry = {
                prompt: prompt,
                completion: completion,
                persona: person.name
            }
            historyCollection.add(historyEntry)
        }
       
        //append event data to paragraph with id=summery
        document.getElementById("summery").innerHTML += event.data[0].text;
    })
}

function selectPerson() {
    person = JSON.parse(document.getElementById('personaDropdown').value)
    delete person._id
    attribues=JSON.stringify(person)
    //remove quotes from string
    attribues=attribues.replace(/['"{}]+/g, '')
    //remove the string '__v:0'
    attribues=attribues.replace(/__v:0/g, '')
    //remove the string ',,'
    attribues=attribues.replace(/,,/g, ',')
    //consolidate last 3 commands in a single regex

    //update textarea with id=person with prefix of text with the value of the select
    personaTextArea.innerText = attribues
}

function updateTextLength() {

}

// selectPerson
// window.addEventListener("load", onload);

var personasDropdown = new PersonaDropdown('personaDropdown', (persona) => {
    selectPerson(persona)
})