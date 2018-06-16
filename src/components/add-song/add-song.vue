<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <div class="icon-close"></div>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange" placehlder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll v-if="currentIndex === 0" :data="playHistory" class="list-scroll">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong" ></song-list>
            </div>
          </scroll>
          <scroll v-if="currentIndex === 1" :data="searchHistory" class="list-scroll" :refreshDelay="refreshDelay">
            <div class="list-inner">
              <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest ref="suggestList" :showSinger="showSinger" :query="query" @select="selectSuggest"></suggest>
      </div>
      <top-tip ref="toptip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'src/base/search-box/search-box'
import Suggest from 'src/components/suggest/suggest'
import {playListMixin, searchMixin} from 'common/js/mixin'
import Switches from 'src/base/switches/switches'
import Scroll from 'src/base/scroll/scroll'
import {mapGetters, mapActions} from 'vuex'
import SongList from 'src/base/song-list/song-list'
import SearchList from 'src/base/search-list/search-list'
import Song from 'common/js/song' 
import TopTip from 'src/base/top-tip/top-tip'

export default {
  data() {
    return {
      showFlag: false,
      showSinger: false,
      currentIndex: 0,
      switches: [{
        name: '最近播放'
      },
      {
        name: '搜索历史'
      }]
    }
  },
  computed: {
    ...mapGetters(['playHistory'])
  },
  // 当前页面的methods会覆盖mixin里的methods同名方法
  mixins: [searchMixin],
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTip
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    switchItem(index) {
      this.currentIndex = index
      console.log(this.searchHistory, 666)
    },
    selectSuggest() {
      this.saveSearch()
      this.toptip()
    },
    selectSong(song, index) {
      if(index !== 0) {
        this.insertSong(new Song(song))
        this.toptip()
      }
    },
    toptip() {
      this.$refs.toptip.show()
    },
    ...mapActions(['insertSong'])
  } 
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
