<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <!-- <v-btn :to="{ name: 'sign-in' }">SignIn</v-btn> -->
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  mounted() {
    // if not authenticated then go to signin page
    // TODO: add stuff to check for auth.
    this.$router.push('/sign-in');
  },
};
</script>
