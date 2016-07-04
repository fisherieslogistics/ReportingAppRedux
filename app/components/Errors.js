'use strict';
import{
  Text,
  View,
  StyleSheet
} from 'react-native';
import React from 'react';
import {findErrors, findCombinedErrors} from '../utils/ModelErrors';

class Errors {

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
            {this.getErrorMessages.bind(this)()}
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
    color: "red",
    fontSize: 12
  }
});

export default Errors;
