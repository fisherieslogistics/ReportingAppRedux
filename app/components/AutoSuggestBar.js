'use strict';
import{
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableHighlight
} from 'react-native';

import React from 'react';
import speciesCodes from '../constants/speciesCodes.json';
let {height, width} = Dimensions.get('window');
import inputStyle from '../styles/inputStyle';

class AutoSuggestBar extends React.Component {

    constructor(props){
      super(props);
      this.__searchTimeout = null;
      this.state = {
        text: "",
        focus: false,
        valueStore: {},
        descriptionStore:{},
        choices: [],
        results: [],
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

    regExp(term){
      return new RegExp("\\b" + term, "gi");
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
      if(!text.length){
        this.setState({
          text: ""
        });
        return;
      }
      this.setState({
        text: text
      });
      this.__searchTimeout = setTimeout(() => this.searchChoices(text));
    }

    componentWillMount(){
      this.initSuggestions(this.props.choices, this.props.favourites);
    }

    valueChanged(value){
      this.props.onChange(value);
    }

    onFocus(){
      this.setState({
        focus: true
      })
    }

    onBlur(){
      this.setState({
        focus: false
      })
    }

    renderResult(resultIndex){
      let result = this.state.choices[resultIndex];
      return (
        <TouchableHighlight
          onPress={() => this.onChangeText(result.value)}
        >
          <View style={styles.result} key={resultIndex + "pppp"}>
            <Text style={styles.resultText, styles.resultTextValue}>
              {result.value.toUpperCase()}
            </Text>
            <Text style={styles.resultText}>
              {result.description}
            </Text>
          </View>
        </TouchableHighlight>);
    }

    renderResults(){
      if(this.state.text.length){
        return this.state.results.map(this.renderResult.bind(this));
      }else{
        return this.state.choices.slice(0, this.props.maxResults).map((r, i) => {
          return this.renderResult(i);
        });
      }
    }

    render () {
      let bar = null;
      if(this.state.focus){
        bar = (<View style={styles.resultsBar}>
                 {this.renderResults.bind(this)()}
               </View>);
      }
      return (
        <View style={[styles.row]}>
          <TextInput
            style={[inputStyle.textInput]}
            onFocus={this.onFocus.bind(this)}
            onBlur={this.onBlur.bind(this)}
            onChangeText={this.onChangeText.bind(this)}
            value={this.state.text}
            maxLength={3}
            autoCapitalize={'none'}
            autoCorrect={false}
          />
          {bar}
        </View>
      );
    }
}

const styles = StyleSheet.create({
  row:{
    flexDirection: 'row',
    flex: 1,
  },
  resultsBar: {
    position: 'absolute',
    height: 80,
    top: 162,
    paddingTop: 4,
    left: -324,
    width: width,
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  resultText: {
    color: "white"
  },
  resultTextValue: {
    fontSize: 20,
    fontWeight: '600'
  },
  result: {
    height: 72,
    backgroundColor: "blue",
    padding: 4,
    marginRight: 4,
  },
});

export default AutoSuggestBar
