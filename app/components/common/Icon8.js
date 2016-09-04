/**
 * Icon8 icon set component.
 * Usage: <Icon8 name="icon-name" size={20} color="#4F8EF7" />
 */

import { createIconSet } from 'react-native-vector-icons';
const glyphMap = {
  'cloud': 61696,
  'delete': 61697,
  'error': 61698,
  'fishing': 61699,
  'fishing-boat': 61700,
  'fishing-boat-filled': 61701,
  'fishing-filled': 61702,
  'form': 61703,
  'form-filled': 61704,
  'ok': 61705,
  'plus-math': 61706,
  'settings': 61707,
  'settings-filled': 61708,
  'sign-up': 61709,
  'upload-to-cloud': 61710,
  'user': 61711,
};

/*
.icons8-cloud:before { content: "\f100"; }
.icons8-delete:before { content: "\f101"; }
.icons8-error:before { content: "\f102"; }
.icons8-fishing:before { content: "\f103"; }
.icons8-fishing-boat:before { content: "\f104"; }
.icons8-fishing-boat-filled:before { content: "\f105"; }
.icons8-fishing-filled:before { content: "\f106"; }
.icons8-form:before { content: "\f107"; }
.icons8-form-filled:before { content: "\f108"; }
.icons8-ok:before { content: "\f109"; }
.icons8-plus-math:before { content: "\f10a"; }
.icons8-settings:before { content: "\f10b"; }
.icons8-settings-filled:before { content: "\f10c"; }
.icons8-sign-up:before { content: "\f10d"; }
.icons8-upload-to-cloud:before { content: "\f10e"; }
.icons8-user:before { content: "\f10f"; }
*/



let Icon8 = createIconSet(glyphMap, 'Reporting-App', 'Reporting-App.ttf');

module.exports = Icon8;
module.exports.glyphMap = glyphMap;
