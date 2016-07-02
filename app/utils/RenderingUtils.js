import React from 'react';

import {
  View,
  Text,
} from 'react-native';

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
  if(attribute.editorDisplay && attribute.editorDisplay.hideNull && props.obj[attribute.id] === null){
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

export {renderEditor, renderEditors, renderSingleEditor, renderCombinedEditors, getCombinedEditors};
