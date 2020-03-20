<template>
  <v-container fluid ma-0 pa-0 text-xs-center white--text secondary>
    <v-layout row justify-center align-center>
      <NavbarSigning />
    </v-layout>
    <v-layout row justify-center align-center>
      <v-flex xs10 sm8 md5>
        <div v-show="loading" class="lds-ripple"><div></div><div></div></div>
        <v-form v-show="!loading" ref="form" v-model="valid" @submit.prevent="dispatchSignUp()">
          <v-text-field
            v-model="user.fullName"
            :rules="userNameRules"
            label="FULL NAME"
            placeholder="John Doe"
            @focus="hasErrorState = false"
            @keydown="hasErrorState = false"
            required
            clearable
            dark
          ></v-text-field>
          <v-text-field
            v-model="user.email"
            :rules="emailRules"
            label="EMAIL"
            placeholder="email@example.com"
            @focus="hasErrorState = false"
            @keydown="hasErrorState = false"
            required
            clearable
            dark
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :append-icon="showPassword ? 'visibility_off' : 'visibility'"
            :rules="passwordRules"
            :counter="8"
            label="PASSWORD"
            placeholder="5+ characters"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            @focus="hasErrorState = false"
            @keydown="hasErrorState = false"
            required
            dark
          ></v-text-field>
          <v-alert
            :value="hasErrorState"
            type="error"
          >
            {{ hasErrorState }}
          </v-alert>
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
// eslint-disable-next-line import/no-unresolved
import NavbarSigning from '@/components/NavbarSigning.vue';

import { mapState } from 'vuex';

export default {
  name: 'signUp',
  computed: mapState([
    'user',
    'srvResponce',
  ]),
  data: () => ({
    loading: false,
    hasErrorState: false,
    valid: false,
    showPassword: false,
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
        this.loading = true;
        this.$store.dispatch('signUp', { fullName: this.user.fullName, email: this.user.email, password: this.user.password })
          .then((resp) => {
            if (resp.status === 201) {
              this.$store.dispatch('signIn', { email: this.user.email, password: this.user.password })
                .then((res) => {
                  if (res.status === 200) {
                    this.loading = false;
                    this.$router.push('/dashboard');
                  }
                });
            }
          })
          .then(() => { this.loading = false; })
          .catch((err) => {
            this.loading = false;
            this.hasErrorState = this.srvResponce.responce.message;
            if (process.env.DEVELOPMENT) console.log(err);
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

<style scoped>
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 28px;
    left: 28px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: -1px;
    left: -1px;
    width: 58px;
    height: 58px;
    opacity: 0;
  }
}
</style>
