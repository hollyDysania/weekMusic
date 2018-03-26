<template>
    <transition name="slide">
        <div class="singer-detail"></div>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import {getSingerDetail} from 'src/api/singer'
import {ERR_OK} from 'src/api/config'
import jsonp from 'common/js/jsonp'
import {commonParams, options} from 'src/api/config'

export default {
  computed: {
      ...mapGetters([
          'singer'
      ])
  },
  created() {
      this._getDetail()
  },
  methods: {
      _getDetail() {
          if(this.singer.id) {
              this.$router.push()
          }
          getSingerDetail(this.singer.id).then((res) => {
              if(res.code === ERR_OK) {
                  this.songs = res.data.list
              }
          })
      }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
.singer-detail
    position: fixed 
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
.slide-enter-active,.slide-enter-leave
    transition: all 0.3s
.slide-enter,.slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>

