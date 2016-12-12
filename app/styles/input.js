import colors from './darkColors';

export default {
  dateText: {
    fontSize: 22,
    flex: 1,
    color: colors.green,
    width: 190,
    marginRight: 10,
    textAlign: 'right'
  },
  textInput: {
    fontSize: 20,
    flex: 1,
    color: colors.green,
    height: 20,
    marginTop: 8,
  },
  locationContainer: {
    backgroundColor: colors.backgrounds.dark,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dateIcon: {
    height: 0,
    opacity: 0,
  },
  dateInput: {
    borderWidth: 0,
    height: 25,
    flex: 1,
    flexDirection: 'row',
  },
  dateInputInvisible: {
    height: 0,
    width: 0,
    opacity: 0,
  },
  label:{
    fontWeight: "500",
    color: "#b0b0b0",
    fontSize: 20
  }
}
