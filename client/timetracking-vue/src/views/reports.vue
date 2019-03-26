<template>
  <v-container fluid ma-0 pa-0 text-xs-center>
    <Navbar />
    <v-layout row justify-center align-left mb-5>
      <v-flex xs10 sm8 md5 text-xs-left>
        <h1>This is an Reports page</h1>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

import { mapState, mapGetters } from 'vuex';

// const moment = require('moment');

export default {
  name: 'reports',
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
  data() {
    return {

    };
  },
  methods: {

  },
  components: {
    Navbar,
  },
};
</script>
