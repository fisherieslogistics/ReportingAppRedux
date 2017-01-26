'use strict';
import {
  View,
  Text,
  TextInput,
  Switch,
} from 'react-native';

import React from 'react';
import {connect} from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import MasterDetailView from './layout/MasterDetailView';
import Icon8 from '../components/common/Icon8';
import { colors, iconStyles, listViewStyles } from '../styles/styles';
import { MasterToolbar, DetailToolbar } from './layout/Toolbar';
import { BigButton, IconButton } from './common/Buttons';
// import UserActions from '../actions/UserActions';
import ChatActions from '../actions/ChatActions';

const chatActions = new ChatActions();
// const userActions = new UserActions();
const chatWrapperStyle = { flex: 1, alignItems: 'stretch', paddingBottom: 50 };
const viewStyles = {
  marginLeft: 2,
  alignItems: 'flex-start',
  paddingTop: 5
};
const listTextStyle = {
  fontSize: 18,
};

const textInputStyle = {
  width: 500,
  marginTop: 10,
  height: 30,
  borderColor: colors.white,
  borderWidth: 1,
  color: colors.white,
};

const tags = ['all', 'shoreside', 'vessel', 'other', 'archived'];

class Chat extends MasterDetailView {
  constructor (props){
    super(props);

    const masterChoices = props.tagSelected !== 'all' ? props.messageThreads.filter(x =>
      x.tags.includes(props.tagSelected)) : props.messageThreads;

    this.state = {
      masterChoices,
      tagSelected: props.tagSelected,
      addConversationSelected: true,
    };
    this.onSend = this.onSend.bind(this);
    this.onMasterButtonPress = this.onMasterButtonPress.bind(this);
    this.onDetailButtonPress = this.onDetailButtonPress.bind(this);
  }

  getMasterDescription(choice) {
    const textColor = {
      color: this.isDetailSelected(choice) ? colors.white : colors.black,
    };
    return (
      <View
        style={ [listViewStyles.listRowItem, viewStyles] }
        key={`${choice.id}___Chat_Page` }>
        <Text style={ [listTextStyle, textColor] }>
          { choice.name }
        </Text>
      </View>
    );
  }

  isDetailSelected(choice) {
    return this.state.selectedDetail && (choice.id === this.state.selectedDetail.id);
  }

  componentWillReceiveProps(nextProps) {
    console.log('Props received');
    this.setState({
      masterChoices: nextProps.tagSelected !== 'all' ? nextProps.messageThreads.filter(x =>
        x.tags.includes(nextProps.tagSelected)) : nextProps.messageThreads,
      selectedDetail: nextProps.messageThreads.find(this.isDetailSelected),
      tagSelected: nextProps.tagSelected,
      addConversationSelected: nextProps.addConversationSelected,
    });
  }

  onMasterButtonPress() {
    let index = tags.indexOf(this.state.tagSelected);
    if (index + 1 > (tags.length - 1)) {
      index = 0;
    } else {
      index++;
    }
    const nextTag = tags[index];
    this.props.dispatch(
      chatActions.tagSelected(nextTag));
  }

  onDetailButtonPress() {
    console.log('Button pressed');
    console.log(this.props.addContactSelected);
    this.props.dispatch(chatActions.addConversationSelected(this.props.addConversationSelected));
  }

  renderMasterToolbar() {
    const backgroundColor = colors.blue;
    const text = `${this.props.tagSelected.charAt(0).toUpperCase()}${this.props.tagSelected.slice(1)}`
    const textColor = colors.white;

    const button = (
      <BigButton
        text={text}
        backgroundColor={backgroundColor}
        textColor={textColor}
        onPress={ this.onMasterButtonPress }
      />
    );
    return(
      <MasterToolbar
        center={ button }
      />
    );
  }

  renderMasterIcon(choice){
    const isSelected = this.isDetailSelected(choice);
    let backgroundStyle = { backgroundColor: colors.blue, color: colors.white };
    if(isSelected){
      backgroundStyle = { backgroundColor: colors.white, color: colors.blue };
    }
    let icon = 'user';
    if (choice.tags.includes('vessel')) {
      icon = 'fishing-boat';
    }
    return (
      <Icon8
        name={icon}
        size={30}
        color={colors.white}
        style={[ iconStyles, backgroundStyle ]}
      />
    );
  }

  onSend(messages = []) {
    this.props.dispatch(
      chatActions.newMessage(messages[0], this.state.selectedDetail.id));
    this.forceUpdate();
  }

  renderChatConversation() {
    const messages = this.state.selectedDetail.messages;
    return (
      <View style={chatWrapperStyle}>
        <GiftedChat
          messages={messages}
          onSend={this.onSend}
          user={{
            //id: this.props.user.organisationId,
            _id: 'shavaun@fisherylogistics.com',
          }}
        />
      </View>
    );
  }

  renderAddContactView() {
    return (
      <View>
        <View style={{ margin: 20 }}>
          <Text style={{ color: colors.white, fontSize: 40 }}>Add a New Contact</Text>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: colors.white }}>Name</Text>
            <TextInput
              style={textInputStyle}
              autoCapitalize={"none"}
              autoCorrect={false}
              onChangeText={this.handleNameChange}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: colors.white, }}>Email address</Text>
            <TextInput
              style={textInputStyle}
              autoCapitalize={"none"}
              autoCorrect={false}
              onChangeText={this.handleEmailChange}
            />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <Text style={{ color: colors.white }}>Tag as vessel</Text><Switch/>
            <Text style={{ color: colors.white }}>Tag as shoreside</Text><Switch/>
            <Text style={{ color: colors.white }}>Tag as other</Text><Switch/>
          </View>
          <BigButton
            text="Add"
            backgroundColor={colors.blue}
            textColor={colors.white}
            onPress={ null }
            style={{ width: 200, height: 60, marginTop: 20 }}
          />
        </View>
      </View>
    );
  }

  renderDetailView() {
    // if(this.state.addContactSelected) {
    //   return this.renderAddContactView();
    // }
    // if(!this.state.selectedDetail){
    //   return (<View/>);
    // }
    //return this.renderChatConversation();
    return this.renderAddContactView();
  }

  renderDetailToolbar(){
    const button = (
      <IconButton
        icon='plus-math'
        onPress={ this.onDetailButtonPress }
        color={ colors.lightestGray }
        style={{
          backgroundColor: colors.green,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: colors.green,
          marginTop: 20,
          marginRight: 20,
        }}
      />
    );
    return (
      <DetailToolbar
        right={ button }
      />
  );
  }

}

const select = (State) => {
  const state = State.default;
  return {
    user: state.me.user,
    messageThreads: state.chat.messageThreads,
    tagSelected: state.chat.tagSelected,
  };
}

export default connect(select)(Chat);
