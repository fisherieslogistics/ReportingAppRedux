'use strict';
import{
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  ListView,
  RecyclerViewBackedScrollView
} from 'react-native';
import React from 'react';
import {connect} from 'react-redux';
import FormActions from '../actions/FormActions';
import Strings from '../constants/Strings.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import Helper from '../utils/Helper';
import FishingEventModel from '../models/FishingEventModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';

import colors from '../styles/colors';
import styles from '../styles/listView';

const helper = new Helper();
const Lang = Strings.english;

const fishingEventModel = FishingEventModel.concat(TCERFishingEventModel);
const formActions = new FormActions();

import MasterListView from './MasterListView';

const formDescs = {
  started: {
    icon: "pencil",
    color: colors.orange,
  },
  signed: {
    icon: "cloud-upload",
    color: colors.white,
  },
  submitted:{
    icon: "cloud",
    color: colors.gray
  },
}

class FormsList extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        selectedRowId: false
      }
    }

    setViewingForm(form, rowId){
      this.setState({
        selectedRowId: rowId
      });
      this.props.dispatch(formActions.setViewingForm(form));
    }

    getFormStatus(form){
      if(form.submitted){
        return formModelMeta.submitted;
      }
      if(form.signed){
        return formDescs.signed;
      }
      return formDescs.started;
    }

    isSelected(form, rowId){
      return (rowId === this.state.selectedRowId);
    }

    getIcon(form){
      let status = this.getFormStatus(form);
      return (<Icon name={status.icon} size={20} color={status.color} />);
    }

    renderDescription(form, sectionId, rowId) {
      let formNum = parseInt(rowId) + 1;
      let details = [
        {text: "Form " + formNum, style: styles.blackText},
        {text:" ", style: {}},
        {text: form.fishingEvents.length + " Shots ", style: styles.lightText},
      ];

      return details.map((detail, i) => {
        return (
        <View style={styles.listRowItemNarrow} key={"eventDetail" + i}>
          <Text style={[detail.style]}>
            {detail.text}
          </Text>
        </View>);
      });
    }

    render () {
      return (
        <MasterListView
          renderDescription={this.renderDescription.bind(this)}
          isSelected={this.isSelected.bind(this)}
          onPress={this.setViewingForm.bind(this)}
          dataSource={this.props.forms}
          getIcon={this.getIcon.bind(this)}
        />
      );
    }
};

export default FormsList;
