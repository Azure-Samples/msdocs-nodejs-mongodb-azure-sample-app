//export async function to return await fetch data from the API
export async function testAI() {
    return await fetch(`/weo`, req('GET'))
        .then(response => response.json())
}

export const modelJSON = {
    "completion": {
      "id": "null",
      "object": "text_completion",
      "created": null,
      "model": "text-davinci-003",
      "choices": [
        {
          "text": "NA",
          "index": 0,
          "logprobs": null,
          "finish_reason": "stop"
        }
      ],
      "usage": {
        "prompt_tokens": 4,
        "completion_tokens": 20,
        "total_tokens": 24
      }
    },
    "config": {
      "model": "text-davinci-003",
      "prompt": "empty prompt",
      "temperature": 0.2,
      "max_tokens": 4000
    }
}
export async function weoai(prompt, from, max_tokens=4000) {
    modelJSON.config.prompt = prompt;
    modelJSON.config.from = from;
    modelJSON.config.max_tokens = max_tokens;
    return await fetch(`/weo`, req('POST', modelJSON)) 
        .then(response => {
            //check if status  of respnse  is 200
            if (response.status === 200) {
                return response.json()
            } else {
                throw new Error('Something went wrong on api server!');
            }
        }).catch(error => {
            console.error(error);
        });
}

let req = (method, body) => {
    return {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(body)
    }
}
