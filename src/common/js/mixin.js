import { mapGetters } from 'vuex'
export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ]),
    palayIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    // 播放进度条
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdRotate() {
      return this.playing ? 'play' : 'pause'
    },
    disable() {
      return this.songReady ? '' : 'disable'
    },
    iconMode() {
      return this.mode === playMode.sequence
        ? 'icon-sequence'
        : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  mounted() {
    this.handlePlaylist(this.playList)
  },
  // keep-alive 生命周期
  activated() {
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
        throw new Error('组件必须执行handlePlaylist')
    }
  }
}