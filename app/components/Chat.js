'use strict';
import {
  View,
  Text,
} from 'react-native';

import React from 'react';
import {connect} from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import MasterDetailView from './layout/MasterDetailView';
import Icon8 from '../components/common/Icon8';
import { colors, iconStyles, listViewStyles } from '../styles/styles';
import { MasterToolbar } from './layout/Toolbar';
import { BigButton } from './common/Buttons';
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

const tags = ['all', 'shoreside', 'vessel'];

class Chat extends MasterDetailView {
  constructor (props){
    super(props);

    const masterChoices = props.tagSelected !== 'all' ? props.messageThreads.filter(x =>
      x.tags.includes(props.tagSelected)) : props.messageThreads;

    this.state = {
      masterChoices,
      tagSelected: props.tagSelected,
    };
    this.onSend = this.onSend.bind(this);
    this.onMasterButtonPress = this.onMasterButtonPress.bind(this);
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
    this.setState({
      masterChoices: nextProps.tagSelected !== 'all' ? nextProps.messageThreads.filter(x =>
        x.tags.includes(nextProps.tagSelected)) : nextProps.messageThreads,
      selectedDetail: nextProps.messageThreads.find(this.isDetailSelected),
      tagSelected: nextProps.tagSelected,
    });
  }

  onMasterButtonPress() {
    let index = tags.indexOf(this.state.tagSelected);
    if (index + 1 > 2) {
      index = 0;
    } else {
      index++;
    }
    const nextTag = tags[index];
    this.props.dispatch(
      chatActions.tagSelected(nextTag));
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

  renderDetailView() {
    if(!this.state.selectedDetail){
      return (<View/>);
    }
    const messages = this.state.selectedDetail.messages;
    return (
      <View style={chatWrapperStyle}>
        <GiftedChat
          messages={messages}
          onSend={this.onSend}
          user={{
            //id: this.props.user.organisationId,
            _id: 'shavaun',
          }}
        />
      </View>
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
