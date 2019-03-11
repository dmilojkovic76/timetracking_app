<template>
  <v-container fluid ma-0 pa-0 text-xs-center>
    <Navbar />
    {{ srvResponce.token }}
    {{ user }}
    <v-layout row justify-center align-center mb-5>
      <v-flex xs10 sm8 md5 text-xs-left>
        {{ vreme }}
      </v-flex>
    </v-layout>
    <v-layout row justify-center align-center mb-5>
      <v-flex xs10 sm8 md5>
        <h1>TOTAL TIME SPENT TODAY</h1>
      </v-flex>
    </v-layout>
    <v-layout row justify-space-around mb-4 py-5>
        <v-layout column ml-3 pl-3>
          <v-flex>
            <h2 class="display-4">00</h2>
          </v-flex>
          <v-flex mt-3>
            <h4>HOURS</h4>
          </v-flex>
        </v-layout>
        <v-layout column shrink>
          <v-flex>
            <h2 class="display-4">:</h2>
          </v-flex>
          <v-flex>
            <h4> </h4>
          </v-flex>
        </v-layout>
        <v-layout column mr-3 pr-3>
          <v-flex>
            <h2 class="display-4">00</h2>
          </v-flex>
          <v-flex mt-3>
            <h4>MINUTES</h4>
          </v-flex>
        </v-layout>
    </v-layout>
    <v-layout row justify-center align-center>
      <v-flex xs10 sm8 md5>
        <v-btn color="grey lighten-2" block mb-5>reports</v-btn>
        <v-btn color="primary" dark block mb-5>clock in</v-btn>
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
// import axios from 'axios';
import Navbar from '@/components/Navbar.vue';

import { mapState } from 'vuex';

export default {
  name: 'dashboard',
  computed: mapState([
    'user',
    'srvResponce',
  ]),
  data: () => ({
    vreme: '',
  }),
  mounted() {
    this.sat();
  },
  methods: {
    sat() {
      // setInterval(this.vreme = new Date(), 1000);
    },
  },
  components: {
    Navbar,
  },
};
</script>
