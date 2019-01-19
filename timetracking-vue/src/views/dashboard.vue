<template>
  <v-content>
    <v-flex blue-grey darken-4>
      <p class="text-xs-right mr-4 py-5"><a href="#">SIGN OUT</a></p>
    </v-flex>
    <v-container mx-2 >
      <v-flex>
        date
      </v-flex>
      <v-flex>
        <h1 class="text-xs-center">TOTAL TIME SPENT TODAY</h1>
        <v-flex text-xs-center>
          <v-flex>
            <h1>00 : 00</h1>
          </v-flex>
          <v-flex>
            <h4>hours</h4>
            <h4>minutes</h4>
          </v-flex>
        </v-flex>
        <v-btn block>reports</v-btn>
        <v-btn block>clock in</v-btn>
        <p class="text-xs-center">Clicking <strong>CLOCK IN</strong> button will start the time counter.</p>
      </v-flex>
    </v-container>
  </v-content>
</template>
