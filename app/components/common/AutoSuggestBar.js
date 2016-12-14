'use strict';
import{
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import React from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {colors, textStyles} from '../../styles/styles';

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

class AutoSuggestBar extends React.Component {

    constructor(props){
      super(props);
      this.__searchTimeout = null;
      this.renderResult = this.renderResult.bind(this);
      this.renderResults = this.renderResults.bind(this);
      this.setup = this.setup.bind(this);
      this.getSearchResults = this.getSearchResults.bind(this);
      const { valueStore, descriptionStore, sortedValues } = this.setup(props.choices);
      this.state = {
        focus: false,
        valueStore,
        descriptionStore,
        results: [],
        sortedValues,
        inputId: props.inputId,
      }
    }

    addSearchable(value, description, index, valueStore, descriptionStore) {
      valueStore[value] = index;
      descriptionStore[value] = description;
    }

    setup(choices){
      const values = {};
      const desc = {};
      choices.forEach((c, i) => {
        this.addSearchable(c.value, c.description, i, values, desc)
      });
      return {
        valueStore: values,
        descriptionStore: desc,
      }
    }

    initSuggestions(choices){
      const { valueStore, descriptionStore } = this.setup(choices);
      this.setState({
        valueStore,
        descriptionStore,
        inputId: this.props.inputId,
      });
    }

    componentWillUpdate(newProps){
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

    getSearchResults(term){
      const results = [];
      const regExp = this.regExp(term);
      const vStore = this.state.valueStore;

      Object.keys(vStore).forEach((k, i) => {
        if(results.length <= this.props.maxResults &&
          (regExp.test(k) || regExp.test(this.state.descriptionStore[k]))){
            results.push(this.props.choices[vStore[k]]);
        }
      });

      if(this.props.sortResultsBy){
        results.sort(this.props.sortBy);
      }
      if(!term || !term.length){
        const favs = this.props.favourites[this.props.name] || [];
        return favs.map(f => this.props.choices.find(r => r.value === f)).concat(results);
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
      this.props.eventEmitter.emit('AutoSuggestResultPress', {name: this.state.name, value, inputId: this.props.inputId});
    }

    shouldComponentUpdate(props) {
      return !!props.choices;
    }

    componentWillReceiveProps(props){
      if(props.inputId !== this.props.inputId || (props.choices.length !== this.props.choices.length)){
        this.initSuggestions(props.choices, props.favourites);
        this.setState({
          inputId: props.inputId
        });
        this.onChangeText("");
        return;
      }

      if(props.text !== this.state.text){
        this.onChangeText(props.text);
      }

    }

    renderResult(result, i){
      const blank = "";
      const text = this.props.text || blank;
      if(!(result && result.value.toString())){
        return null;
      }
      const isSelected = (result.value.toString().toUpperCase() === text.toUpperCase()) || (this.state.results === 1);
      const resultTextStyle = isSelected ? styles.resultTextSelected : styles.resultText;
      const backgroundStyle = isSelected ? styles.resultBackgroundSelected : styles.resultBackground;
      return (
        <TouchableOpacity key={i + "_autoSuggest"}
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
        return this.state.results.map(this.renderResult);
      }
      return this.getSearchResults("").map(this.renderResult);
    }

    render () {
      if(!this.props.visible){
        return null;
      }
      return (
        <View style={styles.resultsBarWrapper}>
          <View style={[styles.resultsBar, {width: this.props.width}]}>
            {this.renderResults()}
          </View>
          <KeyboardSpacer />
        </View>
      );
    }
}

export default AutoSuggestBar
