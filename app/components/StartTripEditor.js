'use strict';
import {
} from 'react-native';

import React from 'react';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TripModel from '../models/TripModel';
import ModelEditor from './common/ModelEditor';
import TripActions from '../actions/TripActions';
import ports from '../constants/ports';

const portChoices = [];
Object.keys(ports).forEach((k) => ports[k].forEach((p) => {
        portChoices.push({value:p, description: k, render: () => ({value: k, description: p })});
      }));
const tripActions = new TripActions();

class StartTripEditor extends React.Component {

  constructor(props){
    super(props);
    this.getEditorProps = this.getEditorProps.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getExtraProps = this.getExtraProps.bind(this);
    this.state = {
      portChoices: this.getPortChoices(props),
    }
  }

  onChange(name, value){
    switch (name) {
      case "endDate":
        const date = this.props.trip.startDate.clone().add(parseInt(value), "days");
        this.props.dispatch(tripActions.updateTrip(name, date));
        break;
      default:
        if(this.props.trip[name] !== value){
          this.props.dispatch(tripActions.updateTrip(name, value));
        }
        break
    }
  }

  getPortChoices(){
    return portChoices;
  }

  getDayChoices(startDate) {
    const choices = [...Array(14).keys()].map((i) => {
      const date = startDate.clone().add(i, "days");
      return {
        value: i,
        description: date.format("MMM Do YY"),
      };
    });
    return choices;
  }

  getEditorProps(attribute) {
    const extraProps = this.getExtraProps(attribute);
    const value = this.props.trip[attribute.id];
    const inputId = `${attribute.id}__tripstart__`;
    return {
      attribute,
      value,
      inputId,
      onChange: this.onChange,
      extraProps,
    };
  }

  getExtraProps(attribute){
    const extraProps = {
      inputId: `${attribute.id}__tripstart__`,
      value: this.props.trip[attribute.id] || "",
    };
    switch (attribute.id) {
      case "startPort":
        extraProps.choices = this.state.portChoices;
        break;
      case "endPort":
        extraProps.choices = this.state.portChoices;
        break;
      case "startDate":
        extraProps.mode = "date";
        extraProps.format = "Do MM YYYY";
        break;
      case "endDate":
        const date = this.props.trip.startDate;
        const endDate = this.props.trip.endDate;
        extraProps.sortResultsBy = (a, b) => parseInt(a.value) - parseInt(b.value);
        extraProps.choices = this.getDayChoices(date.clone());
        const days = moment.duration(endDate.diff(date)).asDays();
        extraProps.value = days.toString();
        extraProps.maxResults = 15;
        extraProps.showAll = true;
        break;
    }
    return extraProps;
  }

  render() {
    return (
      <KeyboardAwareScrollView
        viewIsInsideTabBar
        extraHeight={ 150 }
        bouncesZoom={false}
        alwaysBounceVertical={false}
      >
        <ModelEditor
          getEditorProps={ this.getEditorProps }
          model={ TripModel }
          modelValues={ this.props.trip }
          index={ 1 }
          onChange={ this.onChange }
        />
      </KeyboardAwareScrollView>
    );
  }
}

export default StartTripEditor;
