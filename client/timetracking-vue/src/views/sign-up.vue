<template>
  <v-container fluid ma-0 pa-0 text-xs-center white--text secondary>
    <v-layout row justify-center align-center>
      <NavbarSigning />
    </v-layout>
    <v-layout row justify-center align-center>
      <v-flex xs10 sm8 md5>
        <v-form ref="form" v-model="valid" @submit.prevent="dispatchSignUp()">
          <v-text-field
            v-model="user.fullName"
            :rules="userNameRules"
            label="FULL NAME"
            placeholder="John Doe"
            required
            clearable
            dark
          ></v-text-field>
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
            :append-icon="showPass ? 'visibility_off' : 'visibility'"
            :rules="passwordRules"
            :counter="8"
            label="PASSWORD"
            placeholder="5+ characters"
            :type="showPass ? 'text' : 'password'"
            @click:append="showPass = !showPass"
            required
            dark
          ></v-text-field>
          <v-btn
            :disabled="!valid"
            color="primary"
            block
            dark
            @click="validate"
            type="submit"
          >
            Sign Up
          </v-btn>
        </v-form>
      </v-flex>
    </v-layout>
    <v-layout column>
      <v-flex xs10>
      Already a member? <a href="/sign-in" class="primary--text">SIGN IN</a>
      </v-flex>
      <v-flex xs10 class="grey--text">
        By clicking Sign Up, you agree to TIME TRACK's<br>
        <strong>
          <a class="grey--text" href="#">Terms and Conditions</a>
        </strong>
        and
        <strong>
          <a class="grey--text" href="">Privacy Policy</a>
        </strong>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import NavbarSigning from '@/components/NavbarSigning.vue';

import { mapState } from 'vuex';

export default {
  name: 'signUp',
  computed: mapState([
    'user',
    'srvResponce',
  ]),
  data: () => ({
    valid: false,
    showPass: false,
    userNameRules: [
      v => !!v || 'Name is required',
    ],
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
    dispatchSignUp() {
      if (this.valid) {
        this.$store.dispatch('signUp', { fullName: this.user.fullName, email: this.user.email, password: this.user.password })
          .then((r) => {
            console.log(`Iz SignUp dispatcha vraceno ${r}`);
            if (r === 200) {
              this.$router.push('/dashboard');
            }
          });
      }
    },
    validate() {
      // some extra validation should go here
    },
  },
  components: {
    NavbarSigning,
  },
};
</script>
