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

import {colors, listViewStyles, textStyles} from '../styles/styles';
import {cloud, uploadCloudGreen, signUpOrange, signUpBlue, signUpGray, signUpWhite} from '../icons/PngIcon';

const helper = new Helper();
const Lang = Strings.english;

const fishingEventModel = FishingEventModel.concat(TCERFishingEventModel);
const formActions = new FormActions();


const formDescs = {
  started: {
    icon: signUpOrange
  },
  incompleteEvents:{
    icon: signUpGray
  },
  signed: {
    icon: uploadCloudGreen
  },
  submitted:{
    icon: cloud
  },
}

class FormsList extends React.Component {

    setViewingForm(form, rowId){
      this.props.dispatch(formActions.setViewingForm(form));
    }

    getFormStatus(form){
      if(form.submitted){
        return formModelMeta.submitted;
      }
      if(form.signed){
        return formDescs.signed;
      }
      if(form.fishingEvents.find(f => !f.productsValid)){
        return formDescs.incompleteEvents;
      }
      return formDescs.started;
    }

    isSelected(form, rowId){
      return this.props.viewingForm && (this.props.viewingForm.id === form.id);
    }

    getIcon(form, isSelected){
      let status = this.getFormStatus(form);
      let icon = isSelected ? signUpWhite : status.icon;
      return (<Image source={icon} style={{opacity: 0.5}}/>);
    }

    getDescription(form, sectionId, rowId, isSelected) {
      let textStyle = isSelected ? textStyles.active : textStyles.dark;
      let details = [
        {text: form.id, style: textStyles.black},
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