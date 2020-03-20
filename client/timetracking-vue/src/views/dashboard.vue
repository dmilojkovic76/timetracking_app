<template>
  <v-container fluid ma-0 pa-0 text-xs-center>
    <Navbar />
    <v-layout row justify-center align-left mb-5>
      <v-flex xs10 sm8 md5 text-xs-left>
        <span class="grey--text">
          <strong>{{ vreme.dan }}</strong> {{ vreme.datum }} {{ vreme.mesec }}, {{ vreme.vreme }}
        </span>
      </v-flex>
    </v-layout>
    <v-layout row justify-center align-center mb-5>
      <v-flex xs10 sm8 md5>
        <h1>TOTAL TIME SPENT TODAY</h1>
      </v-flex>
    </v-layout>
    <v-layout row justify-space-around mb-4 py-5>
        <v-layout row ml-3 pl-3 justify-end>
          <div>
              <h2 class="display-4">00</h2>
              <h4>HOURS</h4>
          </div>
        </v-layout>
        <v-layout column shrink>
          <v-flex>
            <h2 class="display-4">:</h2>
          </v-flex>
        </v-layout>
        <v-layout row mr-3 pr-3 align-start>
          <div>
            <h2 class="display-4">00</h2>
            <h4>MINUTES</h4>
          </div>
        </v-layout>
    </v-layout>
    <v-layout row justify-center align-center>
      <v-flex xs10 sm8 md5>
        <div v-show='timer'>{{ timer }}</div>
        <v-btn color="grey lighten-2" block mb-5 href="/reports">
          reports
        </v-btn>
        <v-btn color="primary" dark block mb-5 @click="clockBtnClick()">
          {{ isRunning ? "clock out":"clock in" }}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout justify-center align-center>
      <p class="text-xs-center grey--text">
        Clicking <strong>CLOCK IN</strong> button will start the time counter.
      </p>
    </v-layout>
  </v-container>
</template>

<script>
// eslint-disable-next-line import/no-unresolved
import Navbar from '@/components/Navbar.vue';

import { mapState, mapGetters } from 'vuex';

const moment = require('moment');

export default {
  name: 'dashboard',
  computed: {
    ...mapState([
      'user',
      'timer',
      'srvResponce',
      'token',
    ]),
    ...mapGetters({
      user: 'getUser',
      timer: 'getTimer',
      srvResponce: 'getSrvResponce',
      token: 'getToken',
    }),
  },
  data: () => ({
    vreme: {
      dan: '',
      datum: '',
      mesec: '',
      vreme: '',
    },
    isRunning: false,
  }),
  mounted() {
    this.$options.interval = setInterval(this.sat, 1000);
  },
  beforeDestroy() {
    clearInterval(this.$options.interval);
  },
  methods: {
    sat() {
      this.vreme.dan = moment().format('dddd');
      this.vreme.datum = moment().format('DD');
      this.vreme.mesec = moment().format('MMMM');
      this.vreme.vreme = moment().format('HH:mm');
    },
    clockBtnClick() {
      let payload = {};
      if (this.isRunning === false) {
        // this.isRunning = true;
        payload = {
          userId: this.user.id,
          startTime: new Date(),
        };
        this.$store.dispatch('timerStart', { ...payload })
          .then((res) => {
            console.log(`Dashboard clock is running: ${this.isRunning}`);
            console.log(res.data);
            this.isRunning = !this.isRunning;
          })
          .catch((err) => {
            console.error('Doslo je do greke prilikom komunikacije sa bazom!');
            console.error(err);
            console.error('Server je odgovorio sa:');
            console.error(this.srvResponce.responce.message);
          });
      } else {
        // this.isRunning = false;
        payload = {
          userId: this.user.id,
          timerId: this.timer.id,
          startTime: this.timer.startTime,
          endTime: new Date(),
        };
        this.$store.dispatch('timerStop', { ...payload })
          .then((res) => {
            console.log(`Dashboard clock is running: ${this.isRunning}`);
            console.log(res.data);
            this.isRunning = !this.isRunning;
          })
          .catch((err) => {
            console.error('Doslo je do greke prilikom komunikacije sa bazom!');
            console.error(err);
            console.error('Server je odgovorio sa:');
            console.error(this.srvResponce.responce.message);
          });
      }
    },
  },
  components: {
    Navbar,
  },
};
</script>
