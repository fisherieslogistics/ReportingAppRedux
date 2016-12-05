'use strict';
import {
  StyleSheet,
  View,
  Text,
  AlertIOS,
  TouchableOpacity,
  TextInput,
  PickerIOS,
} from 'react-native';

import React from 'react';
import moment from 'moment';
import TripActions from '../actions/TripActions';
import TripModel from '../models/TripModel';
import Helper from '../utils/Helper';
import colors from '../styles/colors';
import {textStyles, inputStyles} from '../styles/styles';
import {LongButton} from './common/Buttons';
import {AttributeEditor} from './common/AttributeEditor';
import PortPicker from './PortPicker';
import UserActions from '../actions/UserActions';
import PlaceholderMessage from './common/PlaceholderMessage';
import ViewActions from '../actions/ViewActions';

const viewActions = new ViewActions();
const userActions = new UserActions();
const helper = new Helper();
const tripActions = new TripActions();
const PickerItemIOS = PickerIOS.Item;

class StartTripEditor extends React.Component {

  render(){
    time = time || new moment(new Date().getTime());
    let placeTimeStyle = StyleSheet.create({
      wrapper:{
        backgroundColor: colors.pastelGreen,
        flex: 0.5,
        alignItems: 'flex-start',
        paddingLeft: 5
      },
    });
    let dateAttr = TripModel.find((a) => a.id == timeType);
    let dateProps = {
      customStyles: {
        dateIcon: {
          height: 0,
          opacity: 0
        },
        dateInput:{
          borderWidth: 0,
          opacity: 0,
          flexDirection: 'row',
          flex: 1,
        },
      },
      disabled: false
    };
      let dateStyle = [textStyles.font];


    return (
      <View style={[styles.halfway, styles.placeAndTime]}>
        <View style={{left: -22,}}>
          <View>
             <Text style={{color: colors.blue}}>
              {timeType === 'startDate'? 'Start Time' : 'Estimated Return Time'}
            </Text>
              <Text style={[textStyles.font, {fontSize: 16}]}>{!time || isNaN(time.unix()) ? "  " : time.format("DD MMM HH:mm") }</Text>
              <Text style={[dateStyle, {color: colors.darkGray, fontSize: 12, top: 2}]}>{ (!time || isNaN(time.unix()) ) ? "Select date" : time.fromNow() }</Text>
          </View>
         <View style={{ position: 'absolute', top: 14, borderBottomWidth: 1, borderColor: colors.gray}}>
          {AttributeEditor({
            attribute: dateAttr,
            value: time,
            onChange: onChangeTime,
            extraProps: dateProps
          }, () => { console.warn('This should store that we are editing a field')})}
          </View>
        </View>
        <View style={[{width: 120, left: 13, marginTop: 20, marginBottom: 10, borderBottomWidth: 1, borderColor: colors.gray }]}>
               <Text style={{color: colors.blue}}>
              {timeType === 'startDate'? 'Start Port' : 'End Port'}
            </Text>
          <PortPicker
            name={portType + "__picker"}
            choices={choices}
            portType={portType}
            value={port || ""}
            placeholder={"Select a port"}
            textStyle={{color: colors.black}}
            style={{borderBottomWidth: 1, borderColor: colors.midGray }}
            onChange={(value) => onChangePort(portType, value)}
            inputId={"TripEditor__" + portType}
            disabled={false}
          />
        </View>
      </View>);
    }
}
