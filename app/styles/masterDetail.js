import colors from './darkColors';

export default {
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: colors.backgrounds.dark,
  },
  col: {
    flexDirection: 'column',
    flex: 1
  },
  row: {
    flexDirection: 'row',
    flex: 1
  },
  background:{
    backgroundColor: colors.backgrounds.dark,
  },
  master: {
    flexDirection: 'column',
    alignSelf: 'stretch',
  },
  detail:{
    flex: 0.7,
    flexDirection: 'column',
  },
};
