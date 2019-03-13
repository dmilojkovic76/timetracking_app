import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    darkTheme: true,
    user: {
      fullName: '',
      email: '',
      password: '',
    },
    srvResponce: {
      token: '',
      responce: '',
      resStatus: '',
    },
  },
  actions: {
    signIn({ commit }, _data) {
      return new Promise((resolve, reject) => {
        axios({ // prvo pozivam DB server i saljem mu podatke koji su stigli od sign-in komponente
          method: 'POST',
          url: 'http://localhost:3000/api/users/sign-in',
          headers: { 'content-type': 'application/json' },
          data: _data,
        })
          .then((siResult) => { // kada se vrate podaci sa DB servera
            commit('setResponce', { responce: siResult }); // postavi taj odgovor u state
            commit('setResStatus', { resStatus: siResult.status }); // postavi status tog odgovora u state
            if (siResult.status === 200) { // ako je status 200, tj uspesno pronadjen korisnik
              commit('setActiveToken', { token: siResult.data.token }); // postavi token u state
              commit('setActiveUser', { user: siResult.data.user }); // i postavi podatke korisnika u state
            }
            resolve(siResult);
          }, (siAxiosErr) => {
            reject(siAxiosErr);
          });
      }, (siError) => { // ako se desila bilo koja greska, ovo se izvrsava
        console.log('Vuex SignIn action error:');
        console.log(siError);
      });
    },
    signUp({ commit, state }, _data) {
      return new Promise((resolve, reject) => {
        axios({ // prvo pozivam DB server i saljem mu podatke koji su stigli od sign-up komponente
          method: 'POST',
          url: 'http://localhost:3000/api/users/sign-up',
          headers: { 'content-type': 'application/json' },
          data: _data,
        })
          .then((suResult) => { // kada se vrate podaci sa DB servera
            commit('setResponce', { responce: suResult }); // postavi taj odgovor u state
            commit('setResStatus', { resStatus: suResult.status }); // postavi status tog odgovora u state
            if (suResult.status === 201) { // ako je status 201, tj uspesno kreiran korisnik
              this.signIn(commit, state, { email: this.user.email, password: this.user.password })
                .then((ret) => {
                  resolve(ret);
                });
            }
          }, (suAxiosErr) => {
            reject(suAxiosErr);
          });
      }, (suError) => { // ako se desila bilo koja greska, ovo se izvrsava
        console.log('Vuex SignIn action error:');
        console.error(suError);
      });
    },
  },
  mutations: { // Ovako postavljene rade
    setActiveUser: (state, { user }) => {
      Vue.set(state, 'user', user);
    },
    setActiveToken: (state, { token }) => {
      Vue.set(state.srvResponce, 'token', token);
    },
    setResponce: (state, { responce }) => {
      Vue.set(state.srvResponce, 'responce', responce);
    },
    setResStatus: (state, { resStatus }) => {
      Vue.set(state.srvResponce, 'resStatus', resStatus);
    },
  },
  getters: {
    getUser: state => state.user,
    getSrvResponce: state => state.srvResponce,
  },
});
