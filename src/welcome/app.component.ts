// import { Component } from '@angular/core';
import { Configuration, OpenAIApi } from "openai";
// import { from, map, Observable, Observer, tap } from 'rxjs';
// import { HttpClient, HttpContext, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';

// import { SseClient } from 'ngx-sse-client';
import { ar } from 'date-fns/locale';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
export class AppComponent {
  title = 'ai';
  prompt = 'I am building a web application. What frontend frameworks should I use, and what are their pros and cons?';
  configuration: any
  // observable to hold the completion response
  // result$: Observable<Event>;

  constructor() {
    // private sseClient: SseClient) {
    let completion = {
      model: "text-davinci-003",
      prompt: this.prompt,
      temperature: 0,
      max_tokens: 25,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stream: true
    }
    let count = 0

      // let aresult$ = this.sseClient.stream('https://api.openai.com/v1/completions', { keepAlive: true, reconnectionDelay: 1_000, responseType: 'event' }, { 
      //   body: completion,
      //   headers: new HttpHeaders({
      //     'Accept': 'event-stream',
      //     'Authorization': `Bearer ${localStorage.getItem('key')}`
      //   })
      //  }, 'POST')
      //  .pipe(
      //     map((event: any) => {

      //       console.info(`SSE request with type "${event.type}""`);
      //       //check if the event is an object
      //       if (event.data === ' [DONE]') {
      //         console.log('|'+event.data+'|')
      //         aresult$.unsubscribe()
      //       } else {
      //         let data = JSON.parse(event.data)
      //         console.dir(data.choices[0].text)
      //         //append data.choices[0].text to div with id="output"
      //         document.getElementById('output')!.innerHTML += data.choices[0].text
      //       }
      //     if (count++ > 50) {
      //       aresult$.unsubscribe()
      //     }
      //     // aresult$.remove()
      //  })).subscribe()


  }
}
