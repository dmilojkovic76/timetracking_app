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
      id: '',
    },
    timer: {
      id: '',
      userId: '',
      startTime: '',
      endTime: '',
    },
    srvResponce: {
      responce: '',
      resStatus: '',
    },
    token: '',
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
            commit('setResponce', { responce: siAxiosErr.response.data }); // postavi odgovor u state
            commit('setResStatus', { resStatus: siAxiosErr.response.status }); // postavi status odgovora u state
            reject(siAxiosErr);
          });
      }, (siError) => { // ako se desila bilo koja greska, ovo se izvrsava
        console.log('Vuex SignIn action vratio nepredvidjenu gresku:');
        console.error(siError);
      });
    },
    signUp({ commit }, _data) {
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
              resolve(suResult);
            }
            reject(suResult);
          }, (suAxiosErr) => {
            commit('setResponce', { responce: suAxiosErr.response.data }); // postavi odgovor u state
            commit('setResStatus', { resStatus: suAxiosErr.response.status }); // postavi status odgovora u state
            reject(suAxiosErr);
          });
      }, (suError) => { // ako se desila bilo koja greska, ovo se izvrsava
        console.log('Vuex SignIn action nepredvidjena greska:');
        console.error(suError);
      });
    },
    signOut({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          commit('setResponce', { responce: '' });
          commit('setResStatus', { resStatus: '' });
          commit('setActiveToken', { token: '' });
          commit('setActiveUser', { user: '' });
          commit('setTimer', { timer: '' });
          resolve();
        } catch (error) {
          reject(error);
        }
      }, (signOutErr) => {
        console.log('Vuex signOut action nepredvidjena greska');
        console.log(signOutErr);
      });
    },
    timerStart({ commit }, _data) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          url: 'http://localhost:3000/api/timers/',
          headers: { 'content-type': 'application/json' },
          data: _data,
        })
          .then((startTimerRes) => {
            commit('setResponce', { responce: startTimerRes }); // postavi taj odgovor u state
            commit('setResStatus', { resStatus: startTimerRes.status }); // postavi status tog odgovora u state
            if (startTimerRes.status === 201) {
              const timerObj = {
                id: startTimerRes.data.timer._id,
                startTime: startTimerRes.data.timer.startTime,
                userId: startTimerRes.data.timer.userId,
              };
              commit('setTimer', { timer: timerObj });
              resolve(startTimerRes);
            }
            reject(startTimerRes);
          }, (startTimerAxiosErr) => {
            reject(startTimerAxiosErr);
          });
      }, (startTimerErr) => {
        console.log('Vuex timerStart action nepredvidjena greska');
        console.log(startTimerErr);
      });
    },
    timerStop({ commit }, _data) {
      console.log('Vuex timerStop _data payload:');
      console.log(_data);
      return new Promise((resolve, reject) => {
        axios({
          method: 'PUT',
          url: `http://localhost:3000/api/timers/${_data.timerId}`,
          headers: { 'content-type': 'application/json' },
          data: _data,
        })
          .then((timerStopRes) => {
            if (timerStopRes.status === 201) {
              const timerObj = {
                id: timerStopRes.data.timer._id,
                startTime: timerStopRes.data.timer.startTime,
                endTime: timerStopRes.data.timer.endTime,
                userId: timerStopRes.data.timer.userId,
              };
              commit('setTimer', { timer: timerObj });
              resolve(timerStopRes);
            }
            reject(timerStopRes);
          }, (timerStopAxiosErr) => {
            reject(timerStopAxiosErr);
          });
      }, (stopTimerErr) => {
        console.log('Vuex timerStop action nepredvidjena greska');
        console.log(stopTimerErr);
      });
    },
  },
  mutations: { // Ovako postavljene rade
    setResponce: (state, { responce }) => {
      Vue.set(state.srvResponce, 'responce', responce);
    },
    setResStatus: (state, { resStatus }) => {
      Vue.set(state.srvResponce, 'resStatus', resStatus);
    },
    setActiveUser: (state, { user }) => {
      Vue.set(state, 'user', user);
    },
    setActiveToken: (state, { token }) => {
      Vue.set(state, 'token', token);
    },
    setTimer: (state, { timer }) => {
      Vue.set(state, 'timer', timer);
    },
  },
  getters: {
    getSrvResponce: state => state.srvResponce,
    getUser: state => state.user,
    getToken: state => state.token,
    getTimer: state => state.timer,
  },
});
