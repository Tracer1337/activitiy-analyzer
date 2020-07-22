<template>
  <v-app :style="{ background: $vuetify.theme.themes.dark.background }">
    <v-app-bar
      app
      color="background"
      dark
      :style="{ boxShadow: 'none' }"
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Index</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>