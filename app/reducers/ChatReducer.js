"use strict";

const initialState = {
  tagSelected: 'all',
  addConversationSelected: false,
  messageThreads: [
    {
      id: 'harry',
      tags: [],
      name: 'Mary NetShed',
      messages: [
        {
          _id: "my_id4354",
          text: "Hey Rick hope you liek the chat!",
          createdAt: new Date(),
          image: null,
          user: { name: 'Shavaun', _id: 'shavaun@fisherylogistics.com', avatar: null },
        },
        {
          _id: "my_id4444",
          text: "Mate you didn't pay for the last nets I dont want to make you a $40000 net for no money!",
          createdAt: new Date(),
          image: null,
          user: { name: 'Mary Net Shed', _id: 'mary@netshed.co.nz', avatar: null },
        },
      ],
    },
    {
      id: 'randomid',
      name: 'San Aspiring',
      tags: ['vessel'],
      messages: [
        {
          _id: "my_id4353334",
          text: "Any whales where your at bro?",
          createdAt: new Date(),
          image: null,
          user: { name: 'Shavaun', _id: 'shavaun@fisherylogistics.com', avatar: null },
        },
        {
          _id: "my_id45555444",
          text: "Yeah nah not much around",
          createdAt: new Date(),
          image: null,
          user: { name: 'Steve', _id: 'san@aspiring.com', avatar: null },
        },
      ],
      users: [
        { _id: 'shavaun@fisherylogistics.com', archived: false },
        { _id: 'san@aspiring.com', archived: false },
      ],
    },
    {
      id: 'fishy',
      name: 'Talleys',
      tags: ['shoreside'],
      messages: [
        {
          _id: "my_id",
          text: "I am silly cos I write code all day instead of swimming in the sea",
          createdAt: new Date(),
          image: null,
          user: { name: 'Rimu', _id: 'rimu@talleys.co.nz', avatar: null },
        },
        {
          _id: "my_id4",
          text: "I am Shavaun",
          createdAt: new Date(),
          image: null,
          user: { name: 'Shavaun', _id: 'shavaun@fisherylogistics.com', avatar: null },
        },
      ],
      users: [
        { _id: 'shavaun@fisherylogistics.com', archived: false },
        { _id: 'rimu@talleys.co.nz', archived: false },
      ],
    }
  ],
};

const update = (obj, change) => Object.assign({}, obj, change)

const ChatReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'newMessage':
      const thread = Object.assign({}, state.messageThreads.find(
        mt => mt.id === action.messageThread_id));
      thread.messages = [action.message, ...thread.messages];
      const threads = state.messageThreads.filter(mt => mt.id !== action.messageThread_id);
      return update(state, { messageThreads: [...threads, thread] });
    case 'tagSelected':
      return update(state, { tagSelected: action.payload });
    case 'addConversationSelected':
      return update(state, { addConversationSelected: action.payload });
    case 'createConversation':
      const threadsAdd = [...state.messageThreads];
      threadsAdd.push(action.payload);
      return update(state, { messageThreads: threadsAdd });
    case 'removeConversation':
      const threadsRemove = [...state.messageThreads];
      const index = threadsRemove.findIndex((thread) => thread.id === action.threadId);
      threadsRemove.splice(index, 1);
      return update(state, { messageThreads: threadsRemove });
  }
  return state;
};

export default ChatReducer;
