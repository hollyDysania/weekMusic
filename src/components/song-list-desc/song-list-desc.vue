
<template>
  <!-- 歌单详情列表 -->
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'src/components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getSongList } from 'src/api/recommend'
import { ERR_OK } from 'src/api/config'
import { createSong } from 'common/js/song'
import { processSongsUrl } from 'src/api/handleurl'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters(['disc'])
  },
  components: {
    MusicList
  },
  created() {
    this._getSongList()
  },
  methods: {
    _getSongList() {
      // 刷新回到上个路由
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          let _songs = this._normalizeSongs(res.cdlist[0].songlist)
          processSongsUrl(_songs).then(songs => {
            this.songs = songs
          })
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(v => {
        if (v.songid && v.albumid) {
          ret.push(createSong(v))
        }
      })
      return ret
    }
  }
}
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate(100%, 0, 0);
}
</style>

