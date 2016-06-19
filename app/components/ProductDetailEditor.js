'use strict';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView
} from 'react-native';

import React from 'react';

//import FishPicker from './FishPicker';
import {connect}  from 'react-redux';
//import ErrorChecker from '../classes/ErrorChecker';
//import config from '../constants/config';
import CatchActions from '../actions/CatchActions';
//import Validator from '../reducers/Validator';
//import NumberTextInput from './NumberTextInput';
//const sizes = config.sizes;
const catchActions = new CatchActions();
//const errorChecker = new ErrorChecker();

//import inputStyle from '../styles/inputField';
//import styles from '../styles/style';
//import catchStyle from '../styles/CatchDetailStyles';

class ProductDetailEditor extends React.Component {

    constructor(){
      super();
      this.invalidSpecies = {};
    }

    getErrors(){
      let errs = errorChecker.catchesUnique(this.props.fishingEvent.catches) ? false : true;
      console.log(errs);
      return errs;
    }

    onClose () {
        if(this.getErrors()){
            return;
        }
        this.props.dispatch(catchActions.errors(null))
        this.props.onClose();
    }

    onSpeciesChange(value, index) {
      value = index == 8 ? "other": value;
      this.props.changeCatchSpecies(this.props.fishingEvent.id,
                                    index, value);
    };

    onWeightChange(value, index) {
      this.props.changeCatchWeight(this.props.fishingEvent.id,
                                   index, value);
    };

    onCategoryNumberOfChange(name, value, index) {
      this.props.changeCategoryNumOf(
          name, this.props.fishingEvent.id,
          index, value
      );
    }

    renderRow(product, index){
      return (
        <View style={[styles.tableRow]} key={"productRow" + index}>
          <View style={[styles.tableCell]}>
            <TextInput clearTextOnFocus={true} defaultValue="" style={[styles.textInput]} value={product.code}/>
          </View>
          <View style={[styles.tableCell]}>
            <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} value={product.estimatedWieght} />
          </View>
          {this.props.customInputs.map((ci)=>
            (<View style={[styles.tableCell]} key={ci.label + "header"}>
              <TextInput clearTextOnFocus={true} defaultValue="" style={[styles.textInput]} value={ci.value} />
            </View>)
          )}
        </View>);
    }

    renderHeaders(){
      return (
        <View style={[styles.tableRow]}>
          <View style={[styles.tableCell]}>
            <Text>Species</Text>
          </View>
          <View style={[styles.tableCell]}>
            <Text>Weight</Text>
          </View>
          { this.props.customInputs.map((ci)=>(
            <View style={[styles.tableCell]} key={ci.label+"value"}>
              <Text>{ci.label}</Text>
            </View>)
          ) }
        </View>
      )
    }

    render () {
      return(
      <ScrollView style={styles.productsScroll}>
        <View style={[styles.tableView]}>
          {this.renderHeaders()}
          {this.props.products.map((p, i) => this.renderRow(p, i))}
        </View>
      </ScrollView>);
    }
};

const select = (State) => {
  let state = State.default;
  return {
    customInputs: state.me.user.customInputs.product
  }
}

const styles = {
  productsScroll:{
    height: 600
  },
  tableView: {
    marginTop: 20,
    flex: 1,
    paddingBottom: 200
  },
  tableRow: {
    flexDirection: 'row',
    paddingBottom: 20,
  },
  tableCell: {
    width: 105,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    height: 30,
    width: 80,
    paddingLeft: 10,
  },
}


export default connect(select)(ProductDetailEditor);
