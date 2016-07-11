'use strict';
import {
  View,
  Text,
  Switch,
  AlertIOS,
  TextInput,
} from 'react-native';
import React from 'react';
import FishPicker from '../components/FishPicker';
import DatePicker from 'react-native-datepicker';
import {inputStyles, textStyles} from '../styles/styles';
import Sexagesimal from 'sexagesimal';
import moment from 'moment';

const renderEditors = (props) => {
  let inputs = [];
  let labels = []
  props.model.forEach((attribute) => {
      if(attribute.readOnly || attribute.hidden) {
          return;
      }
      inputs.push(renderEditor(attribute, props));
  });
  return inputs;
}

const renderSingleEditor = (attribute, styles, getEditor) => {
  return (
    <View style={[styles.col, styles.inputRow]} key={attribute.id}>
        <View style={[styles.row, styles.labelRow]}>
          <Text style={styles.labelText}>
            {attribute.label}
          </Text>
        </View>
        <View style={[styles.row, styles.editorRow]}>
          {getEditor(attribute)}
        </View>
    </View>
  );
}

const getCombinedEditors = (attribute, model, getEditor) => {
  let editors = [{label: attribute.label, editor: getEditor(attribute)}];
  let addedEditors = attribute.editorDisplay.siblings.map((s) => {
      let attr = model.find((a) => {
                   return a.id === s;
                  });
      return {label: attr.label, editor: getEditor(attr)};
  });
  return editors.concat(addedEditors);
}

const renderCombinedEditors = (combinedEditors, styles) => {
  let getRandom = () => new Date().getTime() + Math.random();
  return (
    <View style={[styles.col, styles.inputRow]} key={"editor" + getRandom().toString() }>
      <View style={[styles.row]}>
        {combinedEditors.map((e) => {
          return (
              <View style={[styles.rowSection]} key={"editor__" + e.label + getRandom().toString()}>
                <View style={[styles.labelRow]}>
                  <Text style={styles.labelText}>
                    {e.label}
                  </Text>
                </View>
                <View style={[styles.editorRow]}>
                  {e.editor}
                </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const renderEditor = (attribute, props) => {
  if(attribute.editorDisplay && attribute.editorDisplay.hideUndefined && props.obj[attribute.id] === undefined){
    return null;
  }
  if(attribute.editorDisplay && attribute.editorDisplay.editor === props.editorType){
    switch (attribute.editorDisplay.type) {
      case "single":
        return renderSingleEditor(attribute, props.styles, props.getEditor);
        break;
      case "combined":
        const combinedEditors = getCombinedEditors(attribute, props.model, props.getEditor);
        return renderCombinedEditors(combinedEditors, props.styles);
      default:
    }
  }
}

class EditOnBlur extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      value: props.value,
      renderedValue: this.getRenderedValue(props.value),
      inputId: props.inputId
    }
  }

  componentWillReceiveProps(props){
    console.log("edit on blur");
    if(props.inputId !== this.state.inputId){
      this.setState({
        value: props.value,
        inputId: props.inputId,
        renderedValue: this.getRenderedValue(props.value)
      });
    }
  }

  onChangeText(text){
    this.setState({
      value: text,
      renderedValue: text
    })
  }

  onFocus(){

  }

  onBlur(){
    this.props.callback(this.props.attribute.id, this.state.value);
    this.setState({
      renderedValue: this.getRenderedValue(this.state.value)
    });
  }

  getKeypad(){
    switch (this.props.attribute.type) {
      case "number":
        return 'number-pad'
      case "float":
        return 'numeric'
      default:
        return 'default'
    }
  }

  getRenderedValue(value){
    switch (this.props.attribute.type) {
      case "number":
        return isNaN(parseInt(value)) ? "0" : parseInt(value).toString() + (this.props.attribute.unit ? " " + this.props.attribute.unit : "");
      case "float":
        return isNaN(parseFloat(value)) ? "0.00" : parseFloat(value).toFixed(2).toString() + (this.props.attribute.unit ? " " + this.props.attribute.unit : "");
      default:
        return (value !== null && value !== undefined) ? value.toString() : "";
    }
  }

  render(){
    return (
      <TextInput
        selectTextOnFocus={true}
        autoCorrect={false}
        autoCapitalize={'none'}
        keyboardType={this.getKeypad.bind(this)()}
        placeholderText={this.props.attribute.label}
        value={this.state.renderedValue}
        style={inputStyles.textInput}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onChangeText={this.onChangeText.bind(this)}
        {...this.props.extraProps} />
    );
  }
}

const AttributeEditor = (attribute, value, callback, extraProps = {}, inputId) => {
  //return (<View style={{paddingTop: 6}}><Text style={textStyles.font, textStyles.midLabel}>{}</Text></View>);
  switch (attribute.type) {
    case "displayOnly":
    case "datetime":
      return (
        <DatePicker
          date={value || new Date()}
          mode="datetime"
          format="YYYY-MM-DD HH:mm"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateInput: inputStyles.dateInput,
            dateIcon: inputStyles.dateIcon
          }}
          onDateChange={(datetime) => {
            callback(attribute.id, new moment(datetime));
          }}
          {...extraProps}
      />);
      break;
    case "product":
      return (<FishPicker
                onChange={(value) => {
                  callback(attribute.id, value);
                }}
                value={value}
                name={attribute.id}
                inputId={inputId}
                {...extraProps}
              />);
    case "location":
        let posText = Sexagesimal.format(value.lat, 'lat') + "  " + Sexagesimal.format(value.lon, 'lon');
        return(<EditOnBlur
            attribute={attribute}
            value={posText}
            callback={callback}
            extraProps={{editable: false}}
            inputId={inputId}
            />);
      break;
    case "bool":
      return (<Switch
                onValueChange={(bool) => callback(attribute.id, bool)}
                value={value || false}
                {...extraProps}/>);
    case "number":
    case "float":
    default:
      return (
        <EditOnBlur
          attribute={attribute}
          value={value}
          callback={callback}
          extraProps={extraProps}
          inputId={inputId}
          {...extraProps}
        />
      );
  }
}

export {renderEditor, renderEditors, renderSingleEditor, renderCombinedEditors, getCombinedEditors, AttributeEditor}
