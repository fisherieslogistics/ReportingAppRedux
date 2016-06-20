'use strict';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  ScrollView,
  Switch,
  AlertIOS,
  Dimensions,
  TextInput,
} from 'react-native';

import React from 'react';
import FishingEventActions from '../actions/FishingEventActions';
import {connect} from 'react-redux';
import FishingEventModel from '../models/FishingEvent';
import TCERFishingEvent from '../models/TCERFishingEvent';
import DatePicker from 'react-native-datepicker';
import FishPicker from './FishPicker';
import Sexagesimal from 'sexagesimal';

import moment from 'moment';
import Strings from '../constants/Strings'

const fishingEventTypeModels = {
  "tcer": TCERFishingEvent
}

const fishingEventActions = new FishingEventActions();

class FishingEventEditor extends React.Component{
    constructor (props){
        super(props);
        this.state = {
          strings: Strings.english.fishingEvents[props.fishingEventType]
        }
    }

    onChangeText(name, value) {
        this.props.dispatch(
          fishingEventActions.setfishingEventValue(this.props.fishingEvent.id, name, value));
    }

    onNonFishChange(name, value){
      if(value){
        AlertIOS.alert(
          'Non Fish are you sure?',
          'You will need to fill out a Non Fish Protected Species Form in you form book',
          [
            {text: 'Cancel', onPress: () => {this.onChangeText(name, false)}, style: 'cancel'},
            {text: 'OK', onPress: () => {this.onChangeText(name, true)}}
          ]
        );
      }else{
        this.onChangeText(name, false);
      }
    }

    editLocation(editedLocation){

    }

    hideLocationEditor(){
        this.props.dispatch(
          fishingEventActions.hideLocationEditor());
    }

    showLocationEditor(){
        this.props.dispatch(
          fishingEventActions.showLocationEditor());
    }

    renderFishingEventModelInputs(type){
      let model = type ? fishingEventTypeModels[type] : FishingEventModel;
      let inputs = [];
      model.forEach((attribute) => {
          if(attribute.readOnly || attribute.hidden) {
              return;
          }
          inputs.push(this.renderRow(attribute));
      });
      return inputs;
    }

    getEditor(attribute, value){
      switch (attribute.type) {
        case "datetime":
            if(!value){
              return (<Text>{this.state.strings.notComplete}</Text>)
            }
            return (<DatePicker
              style={{width: 200}}
              date={value}
              mode="datetime"
              format="YYYY-MM-DD HH:mm"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={(datetime) => {
                this.onChangeText.bind(this)(attribute.id, new moment(datetime));
              }}
            />);
          break;
        case "product":
          return (<FishPicker
                    onChange={(value) => this.onChangeText(attribute.id, value)}
                    value={value}
                  />);
        case "location":
          if(!value){
            return (<Text>{this.state.strings.noPositon}</Text>);
          }
          return (
            <TouchableHighlight>
              <View>
                <Text>{Sexagesimal.format(value.lat, 'lat')}</Text>
                <Text>{Sexagesimal.format(value.lon, 'lon')}</Text>
              </View>
            </TouchableHighlight>
          );
        case "bool":
          return (<Switch
                    onValueChange={(bool) => this.onNonFishChange(attribute.id, bool)}
                    value={value || false} />);
        default:
          return (<TextInput clearTextOnFocus={true}
                   defaultValue=""
                   style={[styles.textInput]}
                   value={value}
                   onChangeText={text => this.onChangeText(attribute.id, text)} />);
      }
    }

    renderRow(attribute){
      let value = this.props.fishingEvent[attribute.id];
      let input = this.getEditor(attribute, value);

      return (
        <View style={[styles.tableRow]} key={attribute.id + "editor"}>
          <View style={[styles.tableCell]}>
            <Text>{attribute.label}</Text>
          </View>
          <View style={[styles.tableCell]}>
            {input}
          </View>
        </View>
      );
    }

    render() {
      if(!this.props.fishingEvent){
        return null;
      }
      return (
        <ScrollView>
          <View style={styles.tableWrapper}>
            <View style={[styles.tableView]}>
              {this.renderFishingEventModelInputs(false)}
            </View>
            <View style={[styles.tableView]}>
              {this.renderFishingEventModelInputs("tcer")}
            </View>
          </View>
        </ScrollView>
        );
    }
};

const select = (State, dispatch) => {
    let state = State.default;
    return {
      fishingEvent: state.fishingEvents.events[state.view.viewingFishingEventId - 1],
      fishingEventType: state.me.user.fishingEventType
    };
}

const styles = {
  tableWrapper: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection:'row'
  },
  tableView: {
    marginTop: 20,
    flexDirection: 'column',
    width: 350
  },
  tableRow: {
    flexDirection: 'row',
    paddingBottom: 20,
    width: 175,
    height: 50
  },
  tableCell: {
    width: 135,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    height: 30,
    width: 80,
    paddingLeft: 10,
  },
}


export default connect(select)(FishingEventEditor);
