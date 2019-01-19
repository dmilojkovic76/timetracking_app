<template>
  <v-container fluid>
    <v-layout column justify-center align-center>
      <v-badge>
        <v-img
          :src="require('../assets/logo.png')"
          contain
          height="200"
        ></v-img>
      </v-badge>
      <v-flex>
        <h1 class="display-2 font-weight-bold">
          <span class="primary--text">TIME</span> TRACK.
        </h1>
      </v-flex>
      <v-flex>
        <v-form ref="form" v-model="valid" @submit.prevent="signUp">
          <v-text-field
            v-model="user.fullName"
            :rules="userNameRules"
            label="John Doe"
            required
            dark
          ></v-text-field>
          <v-text-field
            v-model="user.email"
            :rules="emailRules"
            label="email@example.com"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :append-icon="showPass ? 'visibility_off' : 'visibility'"
            :rules="passwordRules"
            :counter="5"
            label="5+ characters"
            :type="showPass ? 'text' : 'password'"
            @click:append="showPass = !showPass"
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
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'signUp',
  data: () => ({
    valid: false,
    showPass: false,
    user: {
      fullName: '',
      email: '',
      password: '',
    },
    response: '',
    token: '',
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
    signUp() {
      if (this.valid) {
        console.log(`Form submitted with: ${this.user.fullName}, ${this.user.email} and ${this.user.password}`);
        // TODO: push the data to the server and database
        axios({
          method: 'POST',
          url: 'http://localhost:3000/api/sign-up',
          headers: { 'content-type': 'application/json' },
          data: this.user,
        })
          .then((suResult) => {
            this.response = suResult.status;
            console.log(this.response, suResult.data);
            if (suResult.status === 201) {
              console.log(`Korisnik kreiran, prijava za: ${this.user.email} sifra: ${this.user.password}`);
              axios({
                method: 'POST',
                url: 'http://localhost:3000/api/sign-in',
                headers: { 'content-type': 'application/json' },
                data: { email: this.user.email, password: this.user.password },
              })
                .then((siResult) => {
                  this.token = siResult.token;
                  console.log(siResult);
                  this.$router.push('/dashboard');
                }, (siError) => {
                  console.log(siError);
                });
            }
          }, (suError) => {
            console.error(suError);
          });
      }
    },
    validate() {
      // some extra validation should go here
    },
  },
};
</script>
