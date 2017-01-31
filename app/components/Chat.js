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
import { MasterToolbar, DetailToolbar } from './layout/Toolbar';
import { BigButton, IconButton } from './common/Buttons';
import ChatAddContact from './ChatAddContact';
import ChatActions from '../actions/ChatActions';

const chatActions = new ChatActions();

const styles = {
  chatWrapperStyle: {
    flex: 1,
    alignItems: 'stretch',
    paddingBottom: 50
  },
  viewStyles: {
    flexDirection: 'row',
    marginLeft: 2,
    alignItems: 'flex-start',
    paddingTop: 5,
  },
  listTextStyle: {
    fontSize: 18,
  },
  textInputStyle: {
    width: 500,
    marginTop: 10,
    height: 30,
    borderColor: colors.white,
    borderWidth: 1,
    color: colors.white,
  },
  detailButton: {
    height: 70,
    width: 70,
    padding: 15,
  },
  addButton: {
    backgroundColor: colors.pastelGreen,
  },
  exitButton: {
    backgroundColor: colors.red,
  },
  flex1: {
    flex: 1,
  },
  flex4: {
    flex: 4,
  },
};

class Chat extends MasterDetailView {
  constructor (props){
    super(props);

    const masterChoices = props.tagSelected !== 'all' ? props.messageThreads.filter(x =>
      x.tags.includes(props.tagSelected)) : props.messageThreads;
    this.state = {
      masterChoices,
      tagSelected: props.tagSelected,
      addConversationSelected: props.addConversationSelected,
      showModal: false,
    };
    this.onSend = this.onSend.bind(this);
    this.onMasterButtonPress = this.onMasterButtonPress.bind(this);
    this.onDetailButtonPress = this.onDetailButtonPress.bind(this);
    this.createConversation = this.createConversation.bind(this);
    this.onDeleteButtonPress = this.onDeleteButtonPress.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.messageThreads);
    this.setState({
      masterChoices: nextProps.tagSelected !== 'all' ? nextProps.messageThreads.filter(x =>
        x.tags.includes(nextProps.tagSelected)) : nextProps.messageThreads,
      selectedDetail: nextProps.messageThreads.find(this.isDetailSelected),
      tagSelected: nextProps.tagSelected,
      addConversationSelected: nextProps.addConversationSelected,
    });
  }

  getMasterDescription(choice) {
    const textColor = {
      color: this.isDetailSelected(choice) ? colors.white : colors.black,
    };
    const deleteButton = this.state.addConversationSelected ?
      (<View style={styles.flex1}>
        <IconButton
          icon='delete'
          size={25}
          onPress={() => this.onDeleteButtonPress(choice.id)}
          color={colors.red}
        />
      </View>) : null;
    return (
      <View
        style={ [listViewStyles.listRowItem, styles.viewStyles] }
        key={`${choice.id}___Chat_Page` }>
        <View style={styles.flex4}>
          <Text style={ [styles.listTextStyle, textColor] }>
            { choice.name }
          </Text>
        </View>
        { deleteButton }
      </View>
    );
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

  onMasterButtonPress() {
    this.props.dispatch(
      chatActions.tagSelected(this.state.tagSelected));
  }

  renderDetailView() {
    if(this.state.addConversationSelected) {
      return (
        <ChatAddContact
          createConversation={this.createConversation}
          deleteModal={this.state.showModal}
          closeModal={() => this.setState({showModal: false})}
          confirmDelete={this.onConfirmDelete}
        />
      );
    }
    if(this.state.selectedDetail){
      return this.renderChatConversation();
    }
    return (<View/>);
  }

  renderDetailToolbar(){
    let icon = 'plus-math';
    let style = styles.addButton;
    if(this.state.addConversationSelected) {
      icon = 'delete';
      style = styles.exitButton;
    }
    const button = (
      <IconButton
        icon={icon}
        size={40}
        onPress={ this.onDetailButtonPress }
        color={ colors.white }
        style={ [styles.detailButton, style] }
      />
    );
    return (
      <DetailToolbar
        right={ button }
      />
    );
  }

  isDetailSelected(choice) {
    return this.state.selectedDetail && (choice.id === this.state.selectedDetail.id);
  }

  onDetailButtonPress() {
    this.props.dispatch(
      chatActions.addConversationSelected(!this.state.addConversationSelected));
  }

  onSend(messages = []) {
    this.props.dispatch(
      chatActions.newMessage(messages[0], this.state.selectedDetail.id));
  }

  renderChatConversation() {
    const messages = this.state.selectedDetail.messages;
    const chat = (
      <GiftedChat
        messages={messages}
        onSend={this.onSend}
        user={{
          //id: this.props.user.organisationId,
          _id: 'shavaun',
          id: 'shavaun'
        }}
      />
    );
    return (
      <View style={styles.chatWrapperStyle}>
        <GiftedChat
          messages={messages}
          onSend={this.onSend}
          user={{
            _id: 'shavaun@fisherylogistics.com',
          }}
        />
      </View>
    );
  }

  createConversation(messageThread) {
    this.props.dispatch(
      chatActions.createConversation(messageThread));
    this.props.dispatch(
      chatActions.addConversationSelected(!this.state.addConversationSelected));
  }

  onDeleteButtonPress(id) {
    this.setState({
      showModal: true,
      id,
    });
  }

  onConfirmDelete() {
    this.setState({ showModal: false });
    this.props.dispatch(chatActions.removeConversation(this.state.id));
  }
}

const select = (State) => {
  const state = State.default;
  return {
    user: state.me.user,
    messageThreads: state.chat.messageThreads,
    tagSelected: state.chat.tagSelected,
    addConversationSelected: state.chat.addConversationSelected,
  };
}

export default connect(select)(Chat);
