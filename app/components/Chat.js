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
import UserActions from '../actions/UserActions';

const userActions = new UserActions();
const chatWrapperStyle = { flex: 1, alignItems: 'stretch', paddingBottom: 50 };
const viewStyles = {
  marginLeft: 2,
  alignItems: 'flex-start',
  paddingTop: 5
};
const listTextStyle = {
  fontSize: 18,
};

class Chat extends MasterDetailView {
  constructor (props){
    super(props);
    this.onSend = this.onSend.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.state = {
      masterChoices: props.masterChoices,
    };
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
      masterChoices: nextProps.masterChoices,
      selectedDetail: nextProps.masterChoices.find(this.isDetailSelected),
    });
  }

  renderMasterToolbar() {
    const backgroundColor = colors.backgrounds.blue;
    const text = "Chat";
    const textColor = colors.white;

    const button = (
      <BigButton
        text={text}
        backgroundColor={backgroundColor}
        textColor={textColor}
        onPress={this.onMasterButtonPress }
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
    return (
      <Icon8
        name={"user"}
        size={30}
        color={colors.white}
        style={[ iconStyles, backgroundStyle ]}
      />
    );
  }

  onSend(messages = []) {
    const detail = this.state.selectedDetail;
    if(!detail){
      return;
    }
    this.sendMessage(messages[0]);
    this.setState({
      selectedDetail: Object.assign({}, detail, { messages: messages.concat(detail.messages)}),
    });
  }

  sendMessage(msg) {
    const contact = this.state.selectedDetail;
    const message = {
      text: msg.text,
      messageThread_id: contact.messageThread.id,
      organisation_id: this.props.user.organisationId,
      image: null,
    };
    this.props.dispatch(userActions.sendMessage(message));
  }

  renderDetailView() {
    if(!this.state.selectedDetail){
      return (<View />);
    }
    const messages = this.state.selectedDetail.messages;
    return (
      <View style={chatWrapperStyle}>
        <GiftedChat
          messages={messages}
          onSend={this.onSend}
          user={{
            _id: this.props.user.organisationId,
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
    masterChoices: state.me.user.contacts,
  };
}

export default connect(select)(Chat);
