'use strict';
import{
  View,
  Text,
  Image,
} from 'react-native';
import React, { Component } from 'react';
import FormActions from '../actions/FormActions';
import Icon from 'react-native-vector-icons/FontAwesome';
import Helper from '../utils/Helper';
import MasterListView from './common/MasterListView';

import {connect} from 'react-redux';
import {colors, listViewStyles, textStyles, iconStyles} from '../styles/styles';

const helper = new Helper();
const formActions = new FormActions();

import Icon8 from  './common/Icon8';

class FormsList extends Component {

  constructor(props){
    super(props);
    this.getDescription = this.getDescription.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.setViewingForm = this.setViewingForm.bind(this);
    this.getIcon = this.getIcon.bind(this);
  }

  setViewingForm(form, rowId){
    this.props.dispatch(formActions.setViewingForm(form, rowId));
  }

  getFormStatus(form){
    if(!form.fishingEvents.find(f => !f.signature)){
      return {
        icon: 'cloud',
        color: colors.green
      }
    }
    if(form.signature){
      return {
        icon: 'upload-to-cloud',
        color: colors.green
      }
    }
    if(!form.fishingEvents.every(f => f.eventValid && f.productsValid)){
      return {
        icon: 'error',
        color: colors.orange
      }
    }
    return {
      icon: 'sign-up',
      color: colors.blue
    }
  }

  isSelected(form){
    return this.props.viewingForm && (this.props.viewingForm.id === form.id);
  }

  getIcon(form, isSelected){
    const status = this.getFormStatus(form, isSelected);
    const stylesThisShit = [iconStyles, {backgroundColor: status.color}];
    return (
      <Icon8
        name={status.icon}
        size={30} color="white"
        style={stylesThisShit}
      />
    );
  }

  getDescription(form, sectionId, rowId, isSelected) {
    const textStyle = isSelected ? {color: colors.white} : {};
    const details = [
      {text: form.id, style: [textStyle, {marginLeft: 12}]},
      {text: form.fishingEvents[0].datetimeAtStart.format("HH:mm"), style:  [textStyle, {marginLeft: -20}]},
      {text: form.fishingEvents.length + " Shots ", style: [textStyle, {marginLeft: -20}]},
    ];

    return details.map((detail, i) => (
      <View style={listViewStyles.listRowItemNarrow} key={"eventDetail" + i}>
        <Text style={[textStyles.font, detail.style, textStyles.listView, listViewStyles.detail]}>
          {detail.text}
        </Text>
      </View>));
  }

  render () {
    return (
      <MasterListView
        getDescription={this.getDescription}
        isSelected={this.isSelected}
        onPress={this.setViewingForm}
        dataSource={this.props.forms}
        getIcon={this.getIcon}
      />
    );
  }
}

export default FormsList;
