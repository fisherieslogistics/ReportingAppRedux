'use strict';
import{
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity
} from 'react-native';

import React from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import UserActions from '../../actions/UserActions';

import {colors, textStyles} from '../../styles/styles';

const userActions = new UserActions();

class AutoSuggestBar extends React.Component {

    constructor(props){
      super(props);
      this.__searchTimeout = null;
      this.state = {
        focus: false,
        valueStore: {},
        descriptionStore:{},
        choices: [],
        results: [],
        name: "",
        inputId: null
      }
    }

    addSearchable(value, description, index, valueStore, descriptionStore){
      valueStore[value] = index,
      descriptionStore[value] = description;
    }

    initSuggestions(choices, favourites){
      let values = {};
      let desc = {};
      let ratingOrNegative = (a) => {
        let iA = favourites.indexOf(a);
        return iA === -1 ? iA : (favourites.length - iA);
      }
      choices = choices.sort((a, b) => {
        return ratingOrNegative(b.value) - ratingOrNegative(a.value);
      });
      choices.forEach((c, i) => this.addSearchable(c.value, c.description, i, values, desc));
      this.setState({
        valueStore: values,
        descriptionStore: desc,
        choices: choices
      });
    }

    componentWillUpdate(newProps, newState){
      if(newProps.name !== this.props.name){
        return true;
      }
      if(newProps.inputId !== this.props.inputId){
        return true;
      }
      if(newProps.choices.length !== this.props.choices.length){
        return true;
      }
      return false;
    }

    regExp(term){
      return new RegExp("\\b" + term.replace(/[^\w\s]/gi, ''), "gi");
    }

    searchChoices(term){
      let results = [];
      const regExp = this.regExp(term);
      const vStore = this.state.valueStore;
      Object.keys(vStore).forEach((k, i) => {
        if(results.length <= this.props.maxResults &&
          (regExp.test(k) || regExp.test(this.state.descriptionStore[k]))){
            results.push(this.state.valueStore[k]);
        }
      });
      this.setState({
        results: results
      });
    }

    onChangeText(text){
      clearTimeout(this.__searchTimeout);
      this.__searchTimeout = setTimeout(() => this.searchChoices(text));
    }

    onResultPress(value){
      this.props.eventEmitter.emit('AutoSuggestResultPress', {name: this.state.name, value: value, inputId: this.props.inputId});
    }

    componentWillReceiveProps(props){
      //use a name change to tell it to re initialise
      if(props.name !== this.state.name || Object.keys(this.state.valueStore).length !== [...new Set(props.choices)].length){
        this.initSuggestions(props.choices, props.favourites);
        this.setState({
          name: props.name
        });
        this.onChangeText("");
        return;
      }
      if(props.text !== this.state.text){
        this.onChangeText(props.text);
      }
    }

    renderResult(resultIndex){
      let result = this.state.choices[resultIndex];
      const blank = "";
      let text = this.props.text || blank;
      if(!(result && result.value)){
        return null;
      }
      let isSelected = (result.value.toUpperCase() === text.toUpperCase());
      let resultTextStyle = isSelected ? styles.resultTextSelected : styles.resultText;
      let backgroundStyle = isSelected ? styles.resultBackgroundSelected : styles.resultBackground;
      return (
        <TouchableOpacity key={resultIndex + "autoSuggest"}
          onPress={() => this.onResultPress(result.value)}
        >
          <View style={[styles.result, backgroundStyle]}>
            <Text style={[textStyles.font,resultTextStyle, styles.resultTextValue]}>
              {result.value}
            </Text>
            <Text style={[textStyles.font,resultTextStyle]}>
              {result.description}
            </Text>
          </View>
        </TouchableOpacity>);
    }

    renderResults(){
      if(this.props.text.length){
        return this.state.results.map(this.renderResult.bind(this));
      }else{
        return this.state.choices.slice(0, this.props.maxResults).map((r, i) => {
          return this.renderResult(i);
        });
      }
    }

    render () {
      if(!this.props.visible){
        return null;
      }
      return (
        <View style={styles.resultsBarWrapper}>
          <View style={[styles.resultsBar, {width: this.props.width}]}>
            {this.renderResults.bind(this)()}
          </View>
          <KeyboardSpacer />
        </View>
      );
    }
}

const styles = StyleSheet.create({
  row:{
    flexDirection: 'row',
    flex: 1,
  },
  resultsBarWrapper: {
    position: 'absolute',
    bottom: 0
  },
  resultsBar: {
    height: 80,
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    borderTopWidth: 1,
    backgroundColor: "#fff",
    borderTopColor: colors.lightestGray,
    padding: 8
  },
  resultText: {
    color: "white"
  },
  resultTextValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  resultTextSelected: {
    color: colors.white
  },
  resultBackgroundSelected: {
    backgroundColor: colors.blue
  },
  resultBackground: {
    backgroundColor: colors.lightBlue
  },
  result: {
    height: 62,
    padding: 4,
    marginRight: 4,
    borderRadius: 8
  },
});

export default AutoSuggestBar
