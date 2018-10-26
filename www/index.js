vote = function (value) {
    fetch('vote?yes=' + value + '&cb=' + Date.now(), {
            method: 'get',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            credentials: 'include'
        })
        .then(function (data) {
            console.log('Request succeeded with response status ', data.status);
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
}

// Start the event source at the URL specified by the server
var eventSource = new EventSource('/stream', {
    withCredentials: true
})
let statusEl = document.getElementById('status');
let votesEl = document.getElementById('votes');

// On message, do something
eventSource.addEventListener('message', function (e) {
    votes = JSON.parse(e.data);
    votesEl.innerText = "Yes: " + votes.yes + ", No: " + votes.no;
}, false);

// On Connection Open
eventSource.addEventListener('open', function (e) {
    statusEl.innerText = "Connected";
}, false);

// On Connection Error
eventSource.addEventListener('error', function (e) {
    if (e.target.readyState == EventeventSource.CLOSED) {
        statusEl.innerText = "Disconnected";
    } else if (e.target.readyState == EventeventSource.CONNECTING) {
        statusEl.innerText = "Connecting...";
    }
}, false);

closeStream = function () {
    eventSource.close();
}