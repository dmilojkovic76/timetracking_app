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
        <v-form ref="form" v-model="valid" @submit.prevent="signIn">
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
            Sign In
          </v-btn>
        </v-form>
      </v-flex>
      Not a member? <a href="/sign-up" class="green--text text--accent-2">SIGN UP</a>
    </v-layout>
    <textarea v-model="response"></textarea>
  </v-container>
</template>

<script>
export default {
  name: 'signIn',
  data: () => ({
    valid: false,
    show1: false,
    user: {
      email: '',
      password: '',
    },
    response: '',
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
    signIn() {
      if (this.valid) {
        console.log(`Form submitted with: ${this.user.email} and ${this.user.password}`);
        // TODO: push the data to the server and database
        this.$router.push('/dashboard');
      }
    },
    validate() {
      // some extra validation should go here
    },
  },
};
</script>
