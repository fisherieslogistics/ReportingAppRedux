'use strict';
import{
  View,
  Text,
  Image,
} from 'react-native';
import React from 'react';
import FormActions from '../actions/FormActions';
import Icon from 'react-native-vector-icons/FontAwesome';
import Helper from '../utils/Helper';
import MasterListView from './MasterListView';

import {connect} from 'react-redux';
import {colors, listViewStyles, textStyles, iconStyles} from '../styles/styles';

const helper = new Helper();
const formActions = new FormActions();

import Icon8 from  './Icon8';

class FormsList extends React.Component {

    setViewingForm(form, rowId){
      this.props.dispatch(formActions.setViewingForm(form, rowId));
    }

    getFormStatus(form){
      if(!form.fishingEvents.find(f => !f.signature)){
        return {
          icon: 'cloud',
          color: colors.midGray
        }
      }
      if(form.signature){
        return {
          icon: 'upload-to-cloud',
          color: colors.green
        }
      }
      if(form.fishingEvents.find(f => !f.eventValid)){
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

    isSelected(form, rowId){
      return this.props.viewingForm && (this.props.viewingForm.id === form.id);
    }

    getIcon(form, isSelected){
      let status = this.getFormStatus(form, isSelected);
      return (<Icon8 name={status.icon} size={30} color="white"  style={[iconStyles, {backgroundColor: status.color}]}/>)
    }

    getDescription(form, sectionId, rowId, isSelected) {
      let idStyle = isSelected ? {color: colors.white} : {color: colors.black};
      let textStyle = isSelected ? {color: colors.white} : {};
      let details = [
        {text: form.id, style: [textStyle, {marginLeft: 12}]},
        {text: form.fishingEvents[0].datetimeAtStart.format("HH:mm"), style:  [textStyle, {marginLeft: -20}]},
        {text: form.fishingEvents.length + " Shots ", style: [textStyle, {marginLeft: -20}]},
      ];

      return details.map((detail, i) => {
        return (
        <View style={listViewStyles.listRowItemNarrow} key={"eventDetail" + i}>
          <Text style={[textStyles.font, detail.style, textStyles.listView, listViewStyles.detail]}>
            {detail.text}
          </Text>
        </View>);
      });
    }

    render () {
      return (
        <MasterListView
          getDescription={this.getDescription.bind(this)}
          isSelected={this.isSelected.bind(this)}
          onPress={this.setViewingForm.bind(this)}
          dataSource={this.props.forms}
          getIcon={this.getIcon.bind(this)}
        />
      );
    }
};

export default FormsList;
