# Server Sent Events

## Running locally
* npm install
* npm start
* navigate to http://localhost:3000 on your browser

## IE Notes

* There is no way to see the events coming from the server in dev tools (make it hard to debug). 
* Timeout happens after 45000 ms:
  * No activity within 45000 milliseconds. Reconnecting.


## Polyfills included for IE

* event-source-polyfill
* whatwg-fetch
* promise-polyfill 


### References

* [Using Server Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)


