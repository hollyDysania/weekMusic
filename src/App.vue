<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from 'src/components/m-header/m-header'
import Tab from 'src/components/tab/tab'
import Player from 'src/components/player/player'

export default {
  name: 'App',
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style lang="stylus" scoped>
  @import 'common/stylus/variable'

  #app
    color:$color-theme
</style>
