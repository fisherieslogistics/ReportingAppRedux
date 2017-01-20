"use strict";

class ChatActions {

  newMessage(message, messageThread_id){
    return {
      type: 'newMessage',
      message,
      messageThread_id,
    }
  }

  tagSelected(tag) {
    return {
      type: 'tagSelected',
      tag,
    }
  }
}

export default ChatActions;
