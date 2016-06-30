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
  TextInput,
} from 'react-native';

import React from 'react';
import FishingEventActions from '../actions/FishingEventActions';
import {connect} from 'react-redux';
import FishingEventCustomModel from '../models/FishingEventCustomModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';
import DatePicker from 'react-native-datepicker';
import FishPicker from './FishPicker';
import Sexagesimal from 'sexagesimal';
import Errors from './Errors';

import moment from 'moment';
import Strings from '../constants/Strings'

const fishingEventTypeModels = {
  "tcer": TCERFishingEventModel
}

const fishingEventActions = new FishingEventActions();

class FishingEventCustomEditor extends React.Component{
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

    renderFishingEventModelInputs(type){
      let model = FishingEventCustomModel;
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
      let validStyle = {}
      if(attribute.valid && attribute.valid.func(value) !== true){
          validStyle = styles.invalid;
      }
      switch (attribute.type) {
        case "datetime":
            if(!value){
              return (<Text>{this.state.strings.notComplete}</Text>)
            }
            return (<DatePicker
              style={[{width: 200}]}
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
                    style={validStyle}
                    onChange={(value) => {
                      this.onChangeText(attribute.id, value);
                    }}
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
          return (<TextInput
                   clearTextOnFocus={true}
                   onFocus={() => this.onChangeText(attribute.id, "")}
                   defaultValue=""
                   style={[styles.textInput, validStyle]}
                   value={value}
                   onChangeText={text => this.onChangeText(attribute.id, text)} />);
      }
    }

    renderRow(attribute){
      let value = this.props.fishingEvent[attribute.id];
      let input = this.getEditor(attribute, value);
      let rowStyle = [styles.tableRow];
      return (
        <View style={rowStyle} key={attribute.id + "editor"}>
          <View style={[styles.tableCell]}>
            <Text>{attribute.label}</Text>
          </View>
          <View style={[styles.tableCell]}>
            {input}
          </View>
        </View>
      );
    }

    renderCombinedErrors(){
      return null;
      let model = [...FishingEventCustomModel,
                   ...fishingEventTypeModels[this.props.fishingEventType]];
      return (<Errors model={model}
                      obj={this.props.fishingEvent}
                      combinedErrors={true}
              />);
    }

    render() {
      if(!this.props.fishingEvent){
        return null;
      }
      return (
        <ScrollView>
          <View style={styles.tableWrapper}>
            <View style={styles.row}>
              <View style={[styles.tableView]}>
                {this.renderFishingEventModelInputs(false)}
              </View>

            </View>
            {this.renderCombinedErrors()}
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

const styles = StyleSheet.create({
  row:{
    flexDirection: 'row'
  },
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
    width: 300,
    height: 50
  },
  tableCell: {
    width: 135,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    height: 30,
    width: 300,
    paddingLeft: 10,
  },
  invalid: {
    backgroundColor: '#FFB3BA'
  },
});


export default connect(select)(FishingEventCustomEditor);
