<template>
  <v-container fluid ma-0 pa-0 text-xs-center white--text secondary>
    <v-layout row justify-center align-center>
      <NavbarSigning />
    </v-layout>
    <v-layout row justify-center align-center>
      <v-flex xs10 sm8 md5>
        <v-form ref="form" v-model="valid" @submit.prevent="dispatchSignIn()">
          <v-text-field
            v-model="user.email"
            :rules="emailRules"
            label="EMAIL"
            placeholder="email@example.com"
            required
            clearable
            dark
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :append-icon="show1 ? 'visibility_off' : 'visibility'"
            :rules="passwordRules"
            :counter="8"
            label="PASSWORD"
            placeholder="5+ characters"
            :type="show1 ? 'text' : 'password'"
            @click:append="show1 = !show1"
            required
            dark
            class="mb-5"
          ></v-text-field>
          <v-btn
            :disabled="!valid"
            color="primary"
            block
            dark
            @click="validate"
            type="submit"
          >
            Sign In
          </v-btn>
        </v-form>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs10 >
        Not a member? <a href="/sign-up" class="primary--text">SIGN UP</a>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import NavbarSigning from '@/components/NavbarSigning.vue';

import { mapState, mapGetters } from 'vuex';

export default {
  name: 'signIn',
  computed: {
    ...mapState([
      'user',
      'srvResponce',
    ]),
    ...mapGetters({
      user: 'getUser',
      srvResponce: 'getSrvResponce',
    }),
  },
  data: () => ({
    valid: false,
    show1: false,
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 5) || 'Password must be atleast 5 characters long',
    ],
  }),
  methods: {
    dispatchSignIn() {
      if (this.valid) {
        this.$store.dispatch('signIn', { email: this.user.email, password: this.user.password });
        // .then(() => {
        //   if (this.srvResponce.status === 200) {
        //     this.$router.push('/dashboard');
        //   }
        // });
      }
    },
    validate() {
      // some extra validation should go here
    },
  },
  watch: {
    srvResponce: (resp) => {
      // if (this.srvResponce.status === 200) {
      //   this.$router.push('/dashboard');
      // }
      console.log(`srvResponce se promenio ${resp}`);
    },
    user: (usr) => {
      console.log(`user se promenio ${usr}`);
    },
  },
  components: {
    NavbarSigning,
  },
};
</script>
