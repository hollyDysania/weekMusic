<template>
  <div class="music-list">
      <div class="back" @click="back">
          <i class="icon-back"></i>
      </div>
      <h1 class="title" v-html="title"></h1>
      <div class="bg-image" :style="bgStyle" ref="bgImage">
          <div class="play-wrapper" v-show="songs.length" ref="play" @click="random">
              <div class="play">
                  <div class="icon-play">
                  </div>
                    <span class="text">随机播放全部</span>
              </div>
          </div>
          <div class="filter" ref="filter">
          </div>
      </div>
      <div class="bg-layer" ref="bgLayer"></div>
      <scroll :data="songs" class="list" ref="list" :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll">
          <div class="song-list-wrapper">
            <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
          </div>
        <loading-container v-show="!songs.length"></loading-container>
      </scroll>
  </div>
</template>

<script>
import Scroll from 'src/base/scroll/scroll'
import SongList from 'src/base/song-list/song-list'
import { prefixStyle } from 'common/js/dom'
import LoadingContainer from 'src/base/loading/loading'
import { mapActions } from 'vuex'
import {playListMixin} from 'common/js/mixin'
const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const bacldrop = prefixStyle('webkitTransform')
export default {
  // 当前页面的methods会覆盖mixin里的methods同名方法
  mixins: [playListMixin],
  components: {
    Scroll,
    SongList,
    LoadingContainer
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  watch: {
    scrollY(newY) {
      let zIndex = 0
      let scale = 1
      let blur = 0
      let translateY = Math.max(this.minTranslateY, newY)
      this.$refs.bgLayer.style[transform] = `translate3d(0, ${translateY}px, 0)`
      const precent = Math.abs(newY / this.imgHeight)
      if (newY > 0) {
        scale = 1 + precent
        zIndex = 10
      } else {
        blur = Math.min(20 * precent, 20)
      }
      this.$refs.filter.style[bacldrop] = `blur(${blur}px)`
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.play.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = `70%`
        this.$refs.bgImage.style.height = `0px`
        this.$refs.play.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  methods: {
    // 有小播放器时 改变列表的bottom
    handlePlaylist(playList) {
      console.log(playList, 222)
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    // 随机播放
    random() {
      this.randomPlay({list: this.songs})
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    ...mapActions(['selectPlay', 'randomPlay'])
  },
  mounted() {
    this.imgHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imgHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imgHeight}px`
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;

      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;

        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
          margin-left: 4px;
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;

    .song-list-wrapper {
      padding: 20px 30px;
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
