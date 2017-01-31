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
    const tags = ['all', 'vessel', 'shoreside', 'other'];
    let index = tags.indexOf(tag);
    if (index + 1 > (tags.length - 1)) {
      index = 0;
    } else {
      index++;
    }
    const nextTag = tags[index];
    return {
      type: 'tagSelected',
      payload: nextTag,
    }
  }

  addConversationSelected(payload) {
    return {
      type: 'addConversationSelected',
      payload,
    }
  }

  createConversation(messageThread) {
    return {
      type: 'createConversation',
      payload: messageThread,
    }
  }

  removeConversation(messageThread_id) {
    return {
      type: 'removeConversation',
      threadId: messageThread_id,
    }
  }
}

export default ChatActions;
