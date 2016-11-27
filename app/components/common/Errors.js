'use strict';
import{
  Text,
  View,
  StyleSheet
} from 'react-native';
import React from 'react';
import {findErrors, findCombinedErrors} from '../../utils/ModelErrors';

import colors from '../../styles/colors';

class Errors {

    constructor(props){
      this.getErrorMessages = this.getErrorMessages.bind(this)
    }

    getErrorMessages(){
      let errors = [];
      if(this.props.inputErrors){
        errors = errors.concat(findErrors(this.props.model, this.props.obj));
      }
      if(this.props.combinedErrors){
        errors = errors.concat(findCombinedErrors(this.props.model, this.props.obj));
      }
      return errors;
    }

    renderErrors(){
      return errors.map((err, i) => {return this.renderError(err, i)});
    }

    renderError(errMsg, index){
      return(
        <View style={styles.tableRow} key={errMsg + index}>
          <Text style={[textStyles.font, styles.error]}>{errMsg}</Text>
        </View>
      );
    }

    render(){
      return (
          <View style={[styles.tableView]}>
            {this.getErrorMessages()}
          </View>
      );
    }
};

const styles = StyleSheet.create({
  tableView: {
    marginTop: 0,
  },
  tableRow: {
    paddingBottom: 5,
    height: 20
  },
  error:{
    color: '#444444',
    fontSize: 12
  }
});

export default Errors;
