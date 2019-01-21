import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';

// import colors from 'vuetify/es5/util/colors';

// BOJE
/*
PlavaPozadina: #202630,
SvetloZelena: #06c363,
TamnoZelena: #086646,
SvetloSiva: #e7e7e7,
TamnoSiva: #a9a9a9,
Crvena: #eb6363,
*/

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#06c383', // orginalno - '#1976D2', - svetlo zelena
    secondary: '202630', // originalno - '#424242', - Plava pozadina
    accent: '#82B1FF',
    error: '#eb6363', // originalno - '#FF5252', - Crvena
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
  },
});
