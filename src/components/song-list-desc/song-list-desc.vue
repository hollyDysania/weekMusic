
<template>
<!-- 歌单详情 -->
  <transition name="slide">
    <music-list></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'src/components/music-list/music-list'
export default {
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active
  transition: all 0.3s

.slide-enter, .slide-leave-to
  transform: translate(100%, 0, 0)
</style>

