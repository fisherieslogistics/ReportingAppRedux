'use strict';
import{
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import React from 'react';
import {connect} from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {colors, textStyles} from '../../styles/styles';

const MAX_AUTOSUGGEST_RESULTS = 12;
const styles = {
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
    backgroundColor: colors.white,
    borderTopColor: colors.lightestGray,
    padding: 8
  },
  resultText: {
    color: '#000',
  },
  resultTextValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  resultTextSelected: {
    color: '#000'
  },
  resultBackgroundSelected: {
    backgroundColor: colors.green
  },
  resultBackground: {
    backgroundColor: colors.green,
  },
  result: {
    height: 62,
    padding: 4,
    marginRight: 4,
    borderRadius: 8
  },
};

class AutoSuggestBar extends React.Component {

  constructor(props){
    super(props);
    this.__searchTimeout = null;
    this.renderResult = this.renderResult.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.state = {
      results: [],
      inputId: props.inputId,
    }
  }

  regExp(term){
    return new RegExp("\\b" + term.replace(/[^\w\s]/gi, ''), "gi");
  }

  getSearchResults(term = ""){
    const results = [];
    const regExp = this.regExp(term);
    for(let i = 0; i < this.props.choices.length && results.length < MAX_AUTOSUGGEST_RESULTS; i++){
      const choice = this.props.choices[i] || "";
      const toTest = `${choice.value}${choice.description}`;
      if(regExp.test(toTest)){
        results.push(choice);
      }
    }
    return results;
  }

  searchChoices(term = ""){
    this.setState({
      results: this.getSearchResults(term),
    });
  }

  onChangeText(text){
    clearTimeout(this.__searchTimeout);
    this.__searchTimeout = setTimeout(() => this.searchChoices(text));
  }

  onResultPress(value){
    this.props.eventEmitter.emit('AutoSuggestResultPress', { value, inputId: this.props.inputId });
  }

  componentWillReceiveProps(props){
    if(props.inputId !== this.props.inputId || (JSON.stringify(props.choices) !== JSON.stringify(this.props.choices))){
      this.setState({
        inputId: props.inputId,
      });
      this.onChangeText("");
      return;
    }

    if(props.text !== this.state.text){
      this.onChangeText(props.text);
    }

  }

  renderResult(resultValue = "", description = "", i){
    const text = this.props.text || "";
    const isSelected = (resultValue.toString().toUpperCase() === text.toUpperCase()) || (this.state.results === 1);
    const resultTextStyle = isSelected ? styles.resultTextSelected : styles.resultText;
    const backgroundStyle = isSelected ? styles.resultBackgroundSelected : styles.resultBackground;
    const onPress = () => this.onResultPress(resultValue);
    return (
      <TouchableOpacity key={i + "_autoSuggest"}
        onPress={onPress}
      >
        <View style={[styles.result, backgroundStyle]}>
          <Text style={[textStyles.font,resultTextStyle, styles.resultTextValue]}>
            { resultValue }
          </Text>
          <Text style={[textStyles.font, resultTextStyle]}>
            { description }
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderResults(){
    if(this.props.text && this.props.text.length){
      return this.state.results.map(({ value, description }, i) => this.renderResult(value, description, i));
    }
    return this.getSearchResults().map(({ value, description }, i) => this.renderResult(value, description, i));
  }

  render () {
    if(!this.props.visible){
      return null;
    }
    const style =  {width: this.props.width };

    let keyboardplace = 315;
    if(this.props.width === 1024){
      keyboardplace = 400;
    }
    return (
      <View style={styles.resultsBarWrapper, { bottom: keyboardplace } }>
        <View style={[styles.resultsBar, style]}>
          {this.renderResults()}
        </View>
      </View>
    );
  }
}

const select = (State) => {
  const state = State.default;
  const props = state.view.autoSuggestBar;
  return {
    visible: props.uivisible,
    choices: props.choices,
    text: props.text,
    inputId:  props.inputId,
    height: state.view.height,
    eventEmitter: state.uiEvents.eventEmitter,
  };
}

export default connect(select)(AutoSuggestBar)
