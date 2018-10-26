var APPLICATION_JSON_HEADER = {
  "Content-type": "application/json; charset=UTF-8"
};
var statusEl = document.getElementById("status");
var votesEl = document.getElementById("votes");
var multimessagelistEl = document.getElementById("multimessagelist");
var messageTextAreaEl = document.getElementById("messageTextArea");
var connectEl = document.getElementById("connectButton");
var eventListEl = document.getElementById("eventList");
var eventTextAreaEl = document.getElementById("eventTextArea");

vote = function(value) {
  fetch("vote?yes=" + value + "&cb=" + Date.now(), {
    method: "get",
    headers: APPLICATION_JSON_HEADER,
    credentials: "include"
  })
    .then(function(data) {
      console.log("Request succeeded with response status ", data.status);
    })
    .catch(function(error) {
      console.log("Request failed", error);
    });
};

multimessage = function() {
  var messages = [];
  var message = messageTextAreaEl.value;
  if (message) {
    messages = message.split("\n");
  } else {
    alert("Please enter a message to be sent!");
    return;
  }

  fetch("multimessage", {
    method: "post",
    headers: APPLICATION_JSON_HEADER,
    mode: "cors", // no-cors, cors, *same-origin
    cache: "no-cache",
    credentials: "include",
    body: JSON.stringify(messages)
  })
    .then(function(data) {
      console.log("Request succeeded with response status ", data.status);
    })
    .catch(function(error) {
      console.log("Request failed", error);
    });
};

sendEvent = function(data) {
  data = {
    event: "myEvent",
    data: { text: "" }
  };
  var message = eventTextAreaEl.value;
  if (message) {
    data.data.text = message;
  } else {
    alert("Please enter a message to be sent!");
    return;
  }

  fetch("event", {
    method: "post",
    headers: APPLICATION_JSON_HEADER,
    mode: "cors", // no-cors, cors, *same-origin
    cache: "no-cache",
    credentials: "include",
    body: JSON.stringify(data)
  })
    .then(function(data) {
      console.log("Request succeeded with response status ", data.status);
    })
    .catch(function(error) {
      console.log("Request failed", error);
    });
};

// Start the event source at the URL specified by the server
var eventSource = createSSEConnection();

function createSSEConnection() {
  var eventSourceNew = new EventSource("/stream", {
    withCredentials: true
  });

  // On message, do something
  eventSourceNew.addEventListener(
    "message",
    function(e) {
      var message = JSON.parse(e.data);

      if (message.hasOwnProperty("yes") || message.hasOwnProperty("no")) {
        votesEl.innerText = "Yes: " + message.yes + ", No: " + message.no;
      } else {
        addItemToMultimessage(message);
      }
    },
    false
  );

  eventSourceNew.addEventListener(
    "myEvent",
    function(e) {
      // not parsing it on purpose since it is a json object and we want to show it as text
      var message = e.data; //JSON.parse(e.data);
      addItemToEvents(message);
    },
    false
  );

  // On Connection Open
  eventSourceNew.addEventListener(
    "open",
    function(e) {
      statusEl.innerText = " Connected";
    },
    false
  );

  // On Connection Error
  eventSourceNew.addEventListener(
    "error",
    function(e) {
      if (e.target.readyState == EventSource.CLOSED) {
        statusEl.innerText = " Disconnected";
      } else if (e.target.readyState == EventSource.CONNECTING) {
        statusEl.innerText = " Connecting...";
      }
    },
    false
  );

  return eventSourceNew;
}

function reEstablishConnection() {
  if (!eventSource || eventSource.readyState === 2) {
    eventSource = createSSEConnection();
    connectEl.setAttribute("disabled", "");
  }
}

function createListItem(text) {
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(text));
  return li;
}

function addListItemToList(listElement, listItemElement) {
  listElement.appendChild(listItemElement);
}

function addItemToList(list) {
  return function addItem(text) {
    var li = createListItem(text);
    addListItemToList(list, li);
  };
}

var addItemToMultimessage = addItemToList(multimessagelistEl);
var addItemToEvents = addItemToList(eventListEl);

closeStream = function() {
  eventSource.close();
  eventSource = null;
  connectEl.removeAttribute("disabled");
  statusEl.innerText = " Disconnected";
};
