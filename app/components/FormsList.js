'use strict';
import{
  View,
  Text,
  Image,
} from 'react-native';
import React from 'react';
import {connect} from 'react-redux';
import FormActions from '../actions/FormActions';
import Strings from '../constants/Strings.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import Helper from '../utils/Helper';
import FishingEventModel from '../models/FishingEventModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';
import MasterListView from './MasterListView';

import {colors, listViewStyles, textStyles, iconStyles} from '../styles/styles';
import {cloudWhite, uploadCloudWhite, signUpWhite, errorWhite} from '../icons/PngIcon';

const helper = new Helper();
const Lang = Strings.english;

const fishingEventModel = FishingEventModel.concat(TCERFishingEventModel);
const formActions = new FormActions();


class FormsList extends React.Component {

    setViewingForm(form, rowId){
      this.props.dispatch(formActions.setViewingForm(form));
    }

    getFormStatus(form){
      if(!form.fishingEvents.find(f => !f.signature)){
        return {
          icon: cloudWhite,
          color: colors.midGray
        }
      }
      if(form.signature){
        return {
          icon: uploadCloudWhite,
          color: colors.green
        }
      }
      if(form.fishingEvents.find(f => !f.productsValid)){
        return {
          icon: errorWhite,
          color: colors.orange
        }
      }
      return {
        icon: signUpWhite,
        color: colors.blue
      }
    }

    isSelected(form, rowId){
      return this.props.viewingForm && (this.props.viewingForm.id === form.id);
    }

    getIcon(form, isSelected){
      let status = this.getFormStatus(form, isSelected);
      return (<View style={[iconStyles, {backgroundColor: status.color}]}>
                <Image source={status.icon} style={{}} />
              </View>)
    }

    getDescription(form, sectionId, rowId, isSelected) {
      let idStyle = isSelected ? {color: colors.white} : {color: colors.black};
      let textStyle = isSelected ? {color: colors.white} : {};
      let details = [
        {text: form.id, style: textStyle},
        {text: form.fishingEvents[0].datetimeAtStart.format("HH:mm"), style:  textStyle},
        {text: form.fishingEvents.length + " Shots ", style: textStyle},
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
