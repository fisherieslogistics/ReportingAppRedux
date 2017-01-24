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
    color: colors.white,
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

  getSearchResults(term){
    const results = [];
    const regExp = this.regExp(term);
    for(let i = 0; i < this.props.choices.length && results.length < MAX_AUTOSUGGEST_RESULTS; i++){
      const choice = this.props.choices[i];
      const toTest = `${choice.value}${choice.description}`;
      if(regExp.test(toTest)){
        results.push(choice);
      }
    }
    return results;
  }

  searchChoices(term){
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

  renderResult(result, i){
    const text = this.props.text || "";
    const isSelected = (result.value.toString().toUpperCase() === text.toUpperCase()) || (this.state.results === 1);
    const resultTextStyle = isSelected ? styles.resultTextSelected : styles.resultText;
    const backgroundStyle = isSelected ? styles.resultBackgroundSelected : styles.resultBackground;
    const onPress = () => this.onResultPress(result.value);
    return (
      <TouchableOpacity key={i + "_autoSuggest"}
        onPress={onPress}
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
      return this.state.results.map(this.renderResult);
    }
    return this.getSearchResults("").map(this.renderResult);
  }

  render () {
    if(!this.props.visible){
      return null;
    }
    const style =  {width: this.props.width };
    const keyboardplace = 315;
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
