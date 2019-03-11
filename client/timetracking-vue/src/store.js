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
      axios({
        method: 'POST',
        url: 'http://localhost:3000/api/users/sign-in',
        headers: { 'content-type': 'application/json' },
        data: _data,
      })
        .then((siResult) => {
          commit('setResponce', { responce: siResult });
          commit('setResStatus', { resStatus: siResult.status });
          if (siResult.status === 200) {
            commit('setActiveToken', { token: siResult.data.token });
          }
        }, (siError) => {
          console.log('Vuex SignIn action error:');
          console.log(siError);
        });
    },
    signUp({ commit, state }, _data) {
      axios({
        method: 'POST',
        url: 'http://localhost:3000/api/users/sign-up',
        headers: { 'content-type': 'application/json' },
        data: _data,
      })
        .then((suResult) => {
          console.log('Vuex SignUp action result:');
          console.log(suResult);
          if (suResult.status === 201) {
            this.signIn(commit, state, { email: this.user.email, password: this.user.password })
              .then((ret) => {
                console.log('Vuex auro-SignIn posle SignUp action result:');
                console.log(ret);
              });
          }
        }, (suError) => {
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
