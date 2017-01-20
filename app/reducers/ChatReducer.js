"use strict";

const initialState = {
  tagSelected: 'fisherylogistics',
  messageThreads: [
    {
      id: 'rimuandrick',
      name: 'Rimu and Mike',
      tags: [],
      messages: [
        {
          _id: "my_id4354",
          text: "Hey Rick hope you liek the chat!",
          createdAt: new Date(),
          image: null,
          user: { name: 'Rimu and Mike', _id: 'rimuandrick', avatar: null },
        },
      ],
      users: [
        {_id: 'rimuandrick', name: 'Rimu and Mike', avatar: null },
      ],
    },
    {
      id: 'toothfish',
      name: 'San Aspiring',
      tags: ['vessel'],
      messages: [
        {
          _id: "my_id4353334",
          text: "Any whales where your at bro?",
          createdAt: new Date(),
          image: null,
          user: { name: 'Shavaun', _id: 'shavaun', avatar: null },
        },
        {
          _id: "my_id45555444",
          text: "Yeah nah not much around",
          createdAt: new Date(),
          image: null,
          user: { name: 'Steve', _id: 'steve', avatar: null },
        },
      ],
      users: [
        { name: 'Shavaun', _id: 'shavaun', avatar: null },
        { name: 'Steve', _id: 'steve', avatar: null },
      ]
    },
    {
      id: 'something',
      name: 'Talleys',
      tags: ['shoreside'],
      messages: [
        {
          _id: "my_id",
          text: "I am silly cos I write code all day instead of swimming in the sea",
          createdAt: new Date(),
          image: null,
          user: { name: 'Rimu', _id: 'pppct', avatar: null },
        },
        {
          _id: "my_id4",
          text: "I am Shavaun",
          createdAt: new Date(),
          image: null,
          user: { name: 'Shavaun', _id: 'shavaun', avatar: null },
        },
      ],
      users: [
        { name: 'Shavaun', _id: 'shavaun', avatar: null },
        { name: 'Rimu', _id: 'pppct', avatar: null },
      ]
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
      return update(state, { tagSelected: action.tag });
  }
  return state;
};

export default ChatReducer;
