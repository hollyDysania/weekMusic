<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'src/api/singer'
import { ERR_OK } from 'src/api/config'
import jsonp from 'common/js/jsonp'
import { processSongsUrl } from 'src/api/handleurl'
import { commonParams, options } from 'src/api/config'
import { createSong } from 'common/js/song'
import MusicList from 'src/components/music-list/music-list'

export default {
  components: {
    MusicList
  },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters(['singer']),
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    }
  },
  created() {
    this._getDetail()
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/')
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          let _songs = this._normalizeSongs(res.data.list)
          processSongsUrl(_songs).then(songs => {
            this.songs = songs
          })
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((v, i) => {
        let { musicData } = v
        if (musicData.songid && musicData.albummid) {
          console.log(musicData, 666)
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}

.slide-enter-active, .slide-enter-leave {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>

