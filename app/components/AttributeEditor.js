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

const Editors = (props) => {
  let inputs = [];
  let labels = []
  props.model.forEach((attribute) => {
      if(attribute.readOnly || attribute.hidden) {
          return;
      }
      inputs.push(renderEditor(attribute, props));
  });
  return <View>{ inputs }</View>;
}

const SingleEditor = ({ attribute, styles, getEditor, value, editing, editingCallback }) => {
  if(!attribute.valid) {
    throw new Error(`${attribute.id} doesn't have a validator`);
  }
  const isValid = attribute.valid.func(value);
  return (
    <View style={[styles.col, styles.inputRow]} key={attribute.id}>
        <View style={[styles.row, styles.labelRow]}>
          <Text style={styles.labelText}>
            {attribute.label}
          </Text>
          { isValid ? null : (editing ? <Text style={[styles.labelError]}>
            { attribute.valid.errorMessage }
          </Text> : <View style={styles.errorDot} />)}
        </View>
        <View style={[styles.row, styles.editorRow]}>
          {AttributeEditor(getEditor(attribute), editingCallback)}
        </View>
    </View>
  );
}

const getCombinedEditors = (attribute, model, getEditor) => {
  let editors = [{label: attribute.label, editor: getEditor(attribute) }];
  let addedEditors = attribute.editorDisplay.siblings.map((s) => {
      let attr = model.find((a) => {
                   return a.id === s;
                  });
      return {label: attr.label, editor: getEditor(attr)};
  });
  return editors.concat(addedEditors);
}

const renderCombinedEditors = (combinedEditors, styles, editingCallback, editing) => {
  return (
    <View style={[styles.col, styles.inputRow]} key={"editor" + combinedEditors.map(e => e.editor && e.editor.attribute.id).join('.')}>
      <View style={[styles.row]}>
        {combinedEditors.map((e, index) => {
          if(e.editor && !e.editor.attribute.valid) {
            throw new Error(`${e.editor.attribute.id} doesn't have a validator`);
          }
          const isValid = !e.editor || e.editor.attribute.valid.func(e.editor.value);
          return (
              <View style={[styles.rowSection]} key={"editor__" + e.label + index}>
                <View style={[styles.labelRow]}>
                  <Text style={styles.labelText}>
                    {e.label}
                  </Text>
                  { isValid ? null : (editing === e.editor.attribute.id ? <Text style={[styles.labelError]}>
                    { e.editor.attribute.valid.errorMessage }
                  </Text> : <View style={styles.errorDot} />)}
                </View>
                <View style={[styles.editorRow]}>
                  {e.editor && AttributeEditor(e.editor, (editing) => editingCallback(e.editor.attribute.id, editing))}
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
  const editing = (props.editing === attribute.id);
  if(attribute.editorDisplay && attribute.editorDisplay.editor === props.editorType){
    switch (attribute.editorDisplay.type) {
      case "single":
        return <SingleEditor
          attribute={attribute}
          styles={props.styles}
          getEditor={props.getEditor}
          value={props.values[attribute.id]}
          editing={editing}
          key={attribute.id}
          editingCallback={(editing) => props.editingCallback(attribute.id, editing)}
        />
      case "combined":
        const combinedEditors = getCombinedEditors(attribute, props.model, props.getEditor);
        return renderCombinedEditors(combinedEditors, props.styles, props.editingCallback, props.editing);
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
    this.props.editingCallback(true);
  }

  onBlur(){
    this.props.callback(this.props.attribute.id, this.getCorrectedValue(this.state.value));
    this.props.editingCallback(false);
    this.setState({
      renderedValue: this.getRenderedValue(this.state.value),
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

  getCorrectedValue(value){
    switch (this.props.attribute.type) {
      case "number":
        return isNaN(parseInt(value)) ? "0" : parseInt(value).toString();
      case "float":
        return isNaN(parseFloat(value)) ? "0.00" : parseFloat(value).toFixed(2).toString();
      default:
        return (value !== null && value !== undefined) ? value.toString() : "";
    }
  }

  getRenderedValue(value){
    return this.getCorrectedValue(value) + (this.props.attribute.unit ? " " + this.props.attribute.unit : "");
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

const AttributeEditor = ({attribute, value, onChange, extraProps, inputId}, editingCallback) => {
  if(!extraProps) {
    extraProps = {};
  }
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
            onChange(attribute.id, new moment(datetime));
          }}
          {...extraProps}
          editingCallback={editingCallback}
      />);
      break;
    case "product":
      return (<FishPicker
                onChange={(value) => {
                  onChange(attribute.id, value);
                }}
                value={value}
                name={attribute.id}
                inputId={inputId}
                {...extraProps}
                editingCallback={editingCallback}
              />);
    case "location":
        let posText = Sexagesimal.format(value.lat, 'lat') + "  " + Sexagesimal.format(value.lon, 'lon');
        return(<EditOnBlur
            attribute={attribute}
            value={posText}
            callback={onChange}
            extraProps={{editable: false}}
            inputId={inputId}
            editingCallback={editingCallback}
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
          callback={onChange}
          extraProps={extraProps}
          inputId={inputId}
          {...extraProps}
          editingCallback={editingCallback}
        />
      );
  }
}

export {renderEditor, Editors, SingleEditor, renderCombinedEditors, getCombinedEditors, AttributeEditor}
