module.exports = function(req, res, next) {
  var MESSAGE_TYPE = {
    COMMENT: ": ",
    DATA: "data: ",
    EVENT: "event: "
  };

  var HEARTBEAT_MSG = "";

  /**
   * @description sets up the response with the headers needed for server sent events,
   * as well as the HTTP Status code in the response
   */
  function sseSetup() {
    res.writeHead(200, {
      "Content-type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*"
    });
  }

  /**
   * @description send data to the client
   */
  function sseSend(data) {
    _sendData(data);
  }

  function sseSendEvent(eventName, data) {
    var eventMessage = MESSAGE_TYPE.EVENT + eventName + "\n";
    res.write(eventMessage);
    _sendData(data);
  }

  /**
   * @description  send back a comment in order to keep the connection alive, this is a heartbeat
   **/
  function sseHeartbeat() {
    console.log("Heartbeat sent!");
    _sendResponse(res, MESSAGE_TYPE.COMMENT, HEARTBEAT_MSG);
  }

  function _sendResponse(res, type, data, lineTerminator) {
    lineTerminator = lineTerminator || "\n\n";
    // If a line doesn't contain a colon, the entire line is treated as the field name with an empty value string.
    res.write(type + JSON.stringify(data) + lineTerminator);
  }

  function _sendData(data) {
    if (Array.isArray(data)) {
      data.forEach(function(d, ) {
        _sendResponse(res, MESSAGE_TYPE.DATA, d);
      });
    } else {
      _sendResponse(res, MESSAGE_TYPE.DATA, data);
    }
  }

  res.sseSetup = sseSetup;
  res.sseSend = sseSend;
  res.sseHeartbeat = sseHeartbeat;
  res.sseSendEvent = sseSendEvent;

  // pass on to the next middleware if any
  next();
};
