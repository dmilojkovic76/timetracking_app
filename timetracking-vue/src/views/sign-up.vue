<template>
  <v-container fluid>
    <v-layout column justify-center align-center>
      <v-flex>
        <v-img
          :src="require('../assets/logo.png')"
          contain
          height="200"
        ></v-img>
      </v-flex>
      <v-flex>
        <h1 class="display-2 font-weight-bold">
          <span class="green--text text--accent-2">TIME</span> TRACK.
        </h1>
      </v-flex>
      <v-flex>
        <v-form ref="form" v-model="valid" @submit.prevent="signUp">
          <v-text-field
            v-model="user.fullName"
            :rules="userNameRules"
            label="John Doe"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.email"
            :rules="emailRules"
            label="email@example.com"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :append-icon="show1 ? 'visibility_off' : 'visibility'"
            :rules="passwordRules"
            :counter="5"
            label="5+ characters"
            :type="show1 ? 'text' : 'password'"
            @click:append="show1 = !show1"
            required
          ></v-text-field>
          <v-btn
            :disabled="!valid"
            color="green accent-2"
            block
            @click="validate"
            type="submit"
          >
            Sign Up
          </v-btn>
        </v-form>
      </v-flex>
      <p>
      Already a member? <a href="/sign-in" class="green--text text--accent-2">SIGN IN</a>
      </p>
      <p>
        By clicking Sign Up, you agree to TIME TRACK's<br>
        <a href="#">Terms and Conditions</a> and <a href="">Privacy Policy</a>
      </p>
    </v-layout>
    <textarea v-model="response"></textarea>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'signUp',
  data: () => ({
    valid: false,
    show1: false,
    user: {
      fullName: '',
      email: '',
      password: '',
    },
    response: '',
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
    mounted() {
    },
    signUp() {
      if (this.valid) {
        console.log(`Form submitted with: ${this.user.fullName}, ${this.user.email} and ${this.user.password}`);
        // TODO: push the data to the server and database
        axios({
          method: 'POST',
          url: 'http://localhost:8080/api/sign-up',
          data: this.user,
          // headers: { 'content-type': 'application/json' },
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
        })
          .then((result) => {
            this.response = result.data;
            // TODO: umesto rerutinga na /sign-in, uradi auto sign-in
            this.$router.push('/sign-in'); // re-route to sign in
          }, (error) => {
            console.error(error);
          });
      }
    },
    validate() {
      // some extra validation should go here
    },
  },
};
</script>
