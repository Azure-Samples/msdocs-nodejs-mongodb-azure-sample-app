let media = {
    socialMedia:3000,
    blogs:1500,
    emails:3000,
    newsArticles:1500 
}

let characterCount = 0;
let maxLength=1000
//for each key in media add a new option to select with id=media
for (var key in media) {
    var option = document.createElement('option')
    option.value = media[key]
    option.innerText = key
    document.getElementById('media').appendChild(option)
    selectMedia()
}
function selectMedia() {
    maxLength=Number(document.getElementById('media').value)
    // set the max length of textarea with id=clipboard to value of select with id=media
    document.getElementById('clipboard').setAttribute('maxLength', maxLength)
    document.getElementById("wordcount").innerHTML = characterCount + `/${maxLength} characters`;
}

//update character count as text is typed in clipboard
document.getElementById("clipboard").addEventListener("keydown", function () {
    characterCount = document.getElementById("clipboard").value.length;
    document.getElementById("wordcount").innerHTML = characterCount + `/${maxLength} characters`;
});
// on change of select id="persona" update textarea with a prefix of text with the value of the select
// document.getElementById('persona').addEventListener('change', function () {
//     var text = document.getElementById('persona').value;
//     var clipboard = document.getElementById("clipboard")
//     clipboard.innerText = 'you are a ' + text + clipboard.innerText;
// });

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
var text = decodeURIComponent(getQueryVariable("text"));
var clipboard = document.getElementById("clipboard")
clipboard.innerText = (!text) ? text : '';

var running = false;
function submit() {
    if (running) {
        return;
    }
    running = true;
    document.getElementById("summery").innerHTML = ''
    getCompletion(clipboard.value, event => {
        console.dir(event)
        if (event.data[0].finish_reason === 'stop') {
            running = false;
        }
        //append event data to paragraph with id=summery
        document.getElementById("summery").innerHTML += event.data[0].text;
    })
}

function selectPerson() {
    var person = JSON.parse(document.getElementById('personaDropdown').value)
    delete person._id
    //update textarea with id=person with prefix of text with the value of the select
    document.getElementById('person').innerText = JSON.stringify(person);
}