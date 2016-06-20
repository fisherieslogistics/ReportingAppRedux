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
import {connect}  from 'react-redux';
import CatchActions from '../actions/CatchActions';
import FishPicker from './FishPicker';
const catchActions = new CatchActions();

class ProductDetailEditor extends React.Component {

    constructor(){
      super();
    }

    onChangeSpecies(value, index) {
      this.props.dispatch(catchActions.changeSpecies(this.props.fishingEventId,
                                                    index, value));
    };

    onChangeWeight(value, index) {
      this.props.dispatch(catchActions.changeWeight(this.props.fishingEventId,
                                                    index, value));
    };

    onCustomChange(name, value, index) {
      this.props.dispatch(catchActions.changeCustom(name, this.props.fishingEventId,
                                                    index, value));
    }

    getCustomInput(customInput, value, index){
        switch (customInput.type) {
          case 'string':
            return (<TextInput
                      clearTextOnFocus={true}
                      defaultValue=""
                      onChangeText={(text) => {
                        this.onCustomChange(customInput.name, text, index);
                      }}
                      style={[styles.textInput]}
                      value={value} />);
            break;
          case 'number':
            return (<TextInput
                      clearTextOnFocus={true}
                      defaultValue=""
                      keyboardType="numeric"
                      onChangeText={(text)=>{
                        if(isNaN(text)){
                          this.onCustomChange(customInput.name, "", index);
                          return;
                        }
                        this.onCustomChange(customInput.name, text, index);
                      }}
                      style={[styles.textInput]}
                      value={value} />);
        }

    }

    renderRow(product, index){
      return (
        <View style={[styles.tableRow]} key={"productRow" + index}>
          <View style={[styles.tableCell]}>
            <FishPicker
                onChange={(value) => this.onChangeSpecies(value, index)}
                value={product.code}
            />
          </View>
          <View style={[styles.tableCell]}>
            <TextInput clearTextOnFocus={true}
                       onChangeText={(weight) => {
                         if(isNaN(weight)){
                           this.onChangeWeight("", index);
                         }else{
                           this.onChangeWeight(weight, index);
                         }
                       }}
                       keyboardType={'numeric'}
                       style={[styles.textInput]}
                       value={product.weight} />
          </View>
          {this.props.customInputs.map((ci)=>
            (<View style={[styles.tableCell]} key={ci.label + "header"}>
              {this.getCustomInput(ci, product[ci.name], index)}
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
      if(!this.props.fishingEventId){
        return null;
      }
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
    customInputs: state.me.user.customInputs.product,
    fishingEventId: state.view.viewingFishingEventId,
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
