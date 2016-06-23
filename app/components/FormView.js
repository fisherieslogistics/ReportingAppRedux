'use strict';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ListView,
  Image
} from 'react-native';

import React from 'react';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import {connect} from 'react-redux';
import Helper from '../utils/Helper';
import FormModel from '../models/FormModel';
import TCERFormModel from '../models/TCERFormModel';
import fishingEventModel from '../models/FishingEventModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';
import FormActions from '../actions/FormActions';
import FormsList from './FormsList';

const formActions = new FormActions();
const helper = new Helper();

class FormView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
          form: null
        };
    }
    renderFormsListView(){
      return (
        <View style={[styles.masterView]}>
          <FormsList
            dispatch={this.props.dispatch}
            forms={this.state.ds.cloneWithRows([...this.props.currentTrip.forms])}
            onSelect={this.setForm.bind(this)}
          />
        </View>
      );
    }
    setForm(form){
      this.setState({form: form});
    }

    renderRepeating(_val, parts, key, allText){
      _val.forEach((v) => {
        this.renderMultiple(v, parts, key, allText);
      });
    }

    renderMultiple(_val, parts, key, allText){
      parts.forEach((p, i) => {
        let val = p.resolve(_val);
        let y = p.y;
        if(p.ymultiple){
          y += (p.ymultiple * (i + 1));
        }
        allText.push(this.renderText(val, p.x, y, p.textStyle, p.viewStyle, key));
      });
    }

    renderValue(obj, meta, k, isFishingEvent, index, allText){
      let m = meta.printMapping[k];
      let val = obj[k];
      if(m.resolve && val){
        val = m.resolve(val);
      }
      let exists = (k in obj) ? true : false;
      let needed = (isFishingEvent && m.resolveFromEvents) ? false : true;
      if(exists && needed){
        if(m.multiple && obj[k]){
          this.renderMultiple(obj[k], m.parts, k, allText);
        }else if(m.repeating && obj[k].length) {
          this.renderRepeating(obj[k], m.parts, k, allText);
        }else{
          allText.push(this.renderText(val, m.x + xMultiplier, m.y, m.textStyle, m.viewStyle, k));
        }
      }
    }

    renderObj(obj, meta, isFishingEvent, index){
      let allText = [];
      Object.keys(meta.printMapping).forEach((k) => {
        this.renderValue(obj, meta, k, isFishingEvent, index, allText);
      });
      return allText;
    }
    renderText(val, x, y, _textStyle, _viewStyle, key){
      let textStyle = [styles.text];
      let viewStyle = [styles.textWrapper, {left: x, top: y}];
      if(textStyle){
        textStyle.push(_textStyle);
      }
      if(_viewStyle){
        viewStyle.push(_viewStyle);
      }
      x += 200;
      console.log(val, x, y);
      return (
        <View style={viewStyle} key={key + x + y}>
          <Text style={textStyle}>{"" + (val || key)}</Text>
        </View>);
    }
    renderFishingEvents(){
      let allText = [];
      this.state.form.fishingEvents.forEach((f, i) => {
        allText = allText.concat(this.renderObj(f, this.state.form.meta, true, i));
      });
      return allText;
    }
    renderForm(){
      return this.renderObj(this.state.form, this.state.form.meta);
    }
    render() {
      //let formText = this.state.form ? this.renderForm() : null;
      let eventsText = this.state.form ? this.renderFishingEvents() : null;
      return (
        <View style={styles.row}>
          <View style={styles.col}>
            {this.renderFormsListView.bind(this)()}
          </View>
          <View style={styles.col}>
            <Image source={require('../images/TCER.png')} style={styles.bgImage}>
              <View style={styles.form}>
                {eventsText}
              </View>
            </Image>
          </View>
        </View>
      );
    }
};

const select = (State, dispatch) => {
    let state = State.default;
    return {
      currentTrip: state.forms.currentTrip,
      pastTrips: state.forms.pastTrips,
      viewingForm: state.forms.viewingForm,
      formModel: state.forms.formModel,
      user: state.me.user,
      vessel: state.me.vessel
    };
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  col: {
    flexDirection: 'column'
  },
  form: {
    height: 595,
    width: 842,
  },
  textWrapper: {
    position: 'absolute'
  },
  text: {
    color: 'black'
  },
  listRowItemNarrow: {
    width: 35,
    flexDirection: 'column'
  },
  listRowItem:{
    flexDirection: 'column'
  },
  listRow: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 7,
    paddingBottom: 7,
    borderColor: '#ccc',
    borderRightWidth: 1,
    borderLeftWidth: 1
  },
  selectedListRow: {
    backgroundColor: '#eee',
  },
  bgImage: {
      flex: 1,
      resizeMode: "stretch",
      height: 595,
      width: 842,
  },
});

module.exports = connect(select)(FormView);
