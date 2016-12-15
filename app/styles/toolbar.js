import colors from './darkColors';

export default {
   master: {
     backgroundColor: colors.backgrounds.veryDark,
     flexDirection: 'row',
     height: 70,
   },
   inner:{
     alignSelf: 'stretch',
     flex: 1,
     alignItems: 'center'
   },
   detail:{
     backgroundColor: colors.backgrounds.veryDark,
     flexDirection: 'row',
     flex: 0.1,
     height: 70,
   },
   right:{
     alignSelf: 'stretch',
     flex: 0.2,
     alignItems: 'flex-end'
   },
   detailCenter: {
     paddingTop: 10,
     flex: 0.8,
     alignItems: 'flex-start',
   },
   textButton: {
     marginTop: 34,
     marginRight: 15,
     marginLeft: 22,
     width: 70,
   }
};
