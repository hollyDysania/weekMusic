<template>
  <div class="search">
    <div class="search-box-wrapper" @click="toFocus">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div  class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll class="shortcut" :data="shortcut" ref="shortcut" :refreshDelay="refreshDelay">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li v-for="item in hotkey" class="item" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="suggestResult">
      <suggest ref="suggestList" :query="query" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空全部搜索记录" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'src/base/search-box/search-box'
import {getHotKey} from 'src/api/search'
import {ERR_OK} from 'src/api/config'
import Suggest from 'src/components/suggest/suggest'
import {mapActions, mapGetters} from 'vuex'
import SearchList from 'src/base/search-list/search-list'
import Confirm from 'src/base/confirm/confirm'
import Scroll from 'src/base/scroll/scroll'
import {playListMixin, searchMixin} from 'common/js/mixin'

export default {
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  },
  // 当前页面的methods会覆盖mixin里的methods同名方法
  mixins: [playListMixin, searchMixin],
  computed: {
    // scroll组件计算高度 包含两个异步数据此处合并再传:data
    shortcut() {
      return this.hotkey.concat(this.searchHistory)
    }
  },
  watch: {
    // 搜索切换回来scroll计算不准确 手动计算
    query(newQuery) {
      if(!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        })
      }
    }
  },
  data() {
    return {
      hotkey: []
    }
  },
  created() {
    this._getHotKey()
  },
  methods: {
    // 有小播放器时 改变列表的bottom
    handlePlaylist(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.suggestResult.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.suggestList.refresh()
    },
    // 删除搜索记录弹窗
    showConfirm() {
      this.$refs.confirm.show()
    },
    _getHotKey(){
      getHotKey().then(res => {
        if(res.code === ERR_OK) {
         this.hotkey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    toFocus() {
      this.$refs.searchBox.focus()
    },
    ...mapActions(['clearSearchHistory'])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>

