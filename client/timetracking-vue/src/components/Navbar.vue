<template>
  <v-layout align-center justify-space-between row secondary mb-5>
    <v-flex ml-2>
      <v-btn flat dark v-if="hasHistory" @click="goBack()">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-btn flat dark v-if="!hasHistory" :disabled="!hasHistory" @click="goBack()">
        <p></p>
      </v-btn>
    </v-flex>
    <v-flex shrink align-self-center text-xs-center>
      <v-img
        :src="require('../assets/logo.jpg')"
        position="center bottom"
        height="61"
        width="131"
      ></v-img>
    </v-flex>
    <v-flex text-xs-right mr-2>
      <a href="http://" @click="signOut()" v-show="user.id">SIGN OUT</a>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Navbar',
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
      hasHistory: false,
    };
  },
  beforeMount() {
    if (this.token === '') this.$router.push('/sign-in');
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    signOut() {
      this.$store.dispatch('signOut');
      this.$router.push('/sign-in');
    },
  },
};
</script>
