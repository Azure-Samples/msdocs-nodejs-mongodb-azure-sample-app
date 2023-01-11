#! /usr/bin/env node
function makeJsonDecoder() {
    return new TransformStream({
        start(controller) {
            controller.buf = ''
            controller.pos = 0
        },
        transform(chunk, controller) {
            //split chunk into lines
            let lines = chunk.split('\n')
            //loop through lines
            for (let i = 0; i < lines.length; i++) {
                //if line is not empty
                if (lines[i] !== '') {
                    if (lines[i] === 'data: [DONE]') {
                        controller.terminate()
                        return
                    }
                    //parse line as JSON
                    let jline = JSON.parse(lines[i].substring(5))
                    //enqueue parsed line
                    controller.enqueue(jline)
                }
            }
        }
    })
}
function makeWriteableEventStream(eventTarget) {
    return new WritableStream({
        start(controller) {
            eventTarget.dispatchEvent(new Event('start'))
        },
        write(message, controller) {
            eventTarget.dispatchEvent(
                new MessageEvent(
                    message.object,
                    { data: message.choices }
                )
            )
        },
        close(controller) {
            eventTarget.dispatchEvent(new Event('close'))
        },
        abort(reason) {
            eventTarget.dispatchEvent(new Event('abort', { reason }))
        }
    })
}

function getCompletion(myPrompt, callback) {

    const eventTarget = new EventTarget()
    const jsonDecoder = makeJsonDecoder()
    const eventStream = makeWriteableEventStream(eventTarget)

    eventTarget.addEventListener('text_completion', callback)
    
    fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "event-stream",
            'Authorization': `Bearer ${openai_key}`
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: myPrompt,
            temperature: 0.5,
            max_tokens: 1024,
            n: 1,
            stop: 'none',
            stream: true
        })
    })
        .then(function (response) {
            let res = response.body
                .pipeThrough(new TextDecoderStream())
                .pipeThrough(jsonDecoder)
                .pipeTo(eventStream)
        }).catch(error => {
            eventTarget.dispatchEvent(
                new Event('error', { detail: error }))
        });
}

// nodejs function for command line interface
function cli() {
    // get all arguments as a string
    const args = process.argv.slice(2).join(' ')
    console.log(args)

    //if argements are passed, use them as prompt
    if (args) {
        getCompletion(args, (event) => {
            if (event.data[0].finish_reason !== 'stop' )
                process.stdout.write(event.data[0].text)
        })
        return
    } 

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    })
    // if key is not set, prompt for key and store in environment variable OPENAI_KEY
    if (!key) {
        // tell the user to set OPENAI_KEY environment variable 
        console.log('Please set OPENAI_KEY environment variable to your OpenAI API key')
    }
    readline.question('Prompt: ', (prompt) => {
        getCompletion(prompt, (event) => {
            if (event.data[0].finish_reason !== 'stop' ) 
                 process.stdout.write(event.data[0].text)
        })
        readline.close()
    })
}

//if localstorage is available, use it to store key
if (typeof localStorage !== 'undefined')  var openai_key = localStorage.getItem('openai_key') 
else {
    var openai_key = process.env.OPENAI_KEY
    process.env.NODE_NO_WARNINGS = 1
    cli()
}