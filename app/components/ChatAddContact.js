'use strict';
import {
  View,
  Text,
  TextInput,
  Switch,
  Modal,
} from 'react-native';
import React, { Component } from 'react';
import { colors } from '../styles/styles';
import { BigButton } from './common/Buttons';
import { globalId } from '../utils/ModelUtils';

const styles = {
  container: {
    margin: 20,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: 500,
    backgroundColor: colors.white,
  },
  modalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 30,
    textAlign: 'center',
    margin: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 70,
  },
  titleText: {
    color: colors.white,
    fontSize: 40,
  },
  formText: {
    color: colors.white,
  },
  formContainer: {
    marginBottom: 20,
  },
  textInputStyle: {
    width: 500,
    marginTop: 10,
    height: 30,
    borderColor: colors.white,
    borderWidth: 1,
    color: colors.white,
  },
  tagsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  addButton: {
    width: 200,
    height: 60,
    marginTop: 20
  },
}

export default class ChatAddContact extends Component {

  constructor (props){
    super(props);
    this.state = {
      name: null,
      email: null,
      tags: {
        'vessel': false,
        'shoreside': false,
        'other': false,
      },
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleTagSwitch = this.handleTagSwitch.bind(this);
    this.createMessageThread = this.createMessageThread.bind(this);
  }

  handleNameChange(e) {
    this.setState({ name: e });
  }

  handleEmailChange(e) {
    this.setState({ email: e });
  }

  handleTagSwitch(toggle) {
    const tags = this.state.tags;
    tags[toggle] = !tags[toggle];
    this.setState({ tags });
  }

  createMessageThread() {
    const messageThread = {
      id: globalId(),
      name: this.state.name,
      tags: [],
      messages: [],
    };
    if (this.state.tags.vessel) messageThread.tags.push('vessel');
    if (this.state.tags.shoreside) messageThread.tags.push('shoreside');
    if (this.state.tags.other) messageThread.tags.push('other');
    this.props.createConversation(messageThread);
  }

  render() {
    return (
      <View>
        <View style={ styles.container }>
          <Modal
            visible={this.props.deleteModal}
            animationType='slide'
            transparent
          >
            <View style={styles.modalContainer}>
              <View style={styles.modal}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalText}>
                    Are you sure you want to delete this conversation?
                  </Text>
                  <View style={styles.modalButtons}>
                    <BigButton
                      text='Delete'
                      backgroundColor={colors.red}
                      textColor={colors.white}
                      onPress={this.props.confirmDelete}
                    />
                    <BigButton
                      text='Cancel'
                      backgroundColor={colors.blue}
                      textColor={colors.white}
                      onPress={this.props.closeModal}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
          <Text style={ styles.titleText }>Add a New Contact</Text>
          <View style={ styles.formContainer }>
            <Text style={{ color: colors.white }}>Name</Text>
            <TextInput
              style={styles.textInputStyle}
              autoCapitalize={"none"}
              autoCorrect={false}
              onChangeText={this.handleNameChange}
            />
          </View>
          <View style={ styles.formContainer }>
            <Text style={ styles.formText }>Email address</Text>
            <TextInput
              style={ styles.textInputStyle }
              autoCapitalize={"none"}
              autoCorrect={false}
              onChangeText={this.handleEmailChange}
            />
          </View>
          <View style={ styles.tagsContainer }>
            <Text style={styles.formText}>Tag as vessel</Text>
            <Switch
              id='vesselSwitch'
              onValueChange={() => this.handleTagSwitch('vessel')}
              value={this.state.tags.vessel}
            />
            <Text style={styles.formText}>Tag as shoreside</Text>
              <Switch
                onValueChange={() => this.handleTagSwitch('shoreside')}
                value={this.state.tags.shoreside}
              />
            <Text style={styles.formText}>Tag as other</Text>
              <Switch
                onValueChange={() => this.handleTagSwitch('other')}
                value={this.state.tags.other}
              />
          </View>
          <BigButton
            text="Add"
            backgroundColor={colors.pastelGreen}
            textColor={colors.white}
            onPress={ this.createMessageThread }
            style={ styles.addButton }
          />
        </View>
      </View>
    );
  }

}
