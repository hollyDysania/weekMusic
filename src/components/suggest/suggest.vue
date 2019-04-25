<template>
  <scroll
    class="suggest"
    :data="result"
    :pullup="pullup"
    :beforeScroll="true"
    :pulldown="true"
    @scrollToEnd="searchMore"
    @pullDownEnd="pullDown"
    @beforeScroll="listScroll"
    ref="suggest"
  >
    <div class="suggest-list">
      <ul>
        <li class="suggest-item" v-for="item in result" @click="seletItem(item)">
          <div class="icon">
            <i :class="getIconCls(item)"></i>
          </div>
          <div class="name">
            <p class="text" v-html="getDisplayName(item)"></p>
          </div>
        </li>
        <loading v-show="hasMore" title></loading>
      </ul>
    </div>
    <div v-show="!hasMore && (result && !result.length)" class="no-result-wrapper">
      <no-result title="抱歉,暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import { search } from 'src/api/search'
import { ERR_OK } from 'src/api/config'
import { processSongsUrl } from 'src/api/handleurl'
import { createSong } from 'src/common/js/song'
import Scroll from 'src/base/scroll/scroll'
import Loading from 'src/base/loading/loading'
import Singer from 'common/js/singer'
import { mapMutations, mapActions } from 'vuex'
import NoResult from 'src/base/no-result/no-result'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  components: {
    Scroll,
    Loading,
    NoResult
  },
  props: {
    // 搜索词
    query: {
      type: String,
      default: ''
    },
    // 歌手
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      result: [],
      pullup: true,
      hasMore: true,
      page: 1,
      pulldown: false
    }
  },
  methods: {
    listScroll() {
      this.$emit('listScroll')
    },
    seletItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      // 派发事件
      this.$emit('select')
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    search() {
      this.hasMore = true
      this.page = 1
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this._getResult(res.data).then(result => {
            this.result = result
            this._checkMore(res.data)
          })
        }
      })
    },
    pullDown() {
      this.result = []
      this.search()
    },
    refresh() {
      this.$refs.suggest.refresh()
    },
    searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this._getResult(res.data).then(result => {
            this.result = this.result.concat(result)
          })
        }
      })
    },
    _checkMore(data) {
      const song = data.song
      if (
        !song.list.length ||
        song.curnum + song.curpage * perpage >= song.totalnum
      ) {
        this.hasMore = false
      }
    },
    // 处理数据
    _getResult(data) {
      return new Promise((resolve) => {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
        }
        if (data.song) {
          let songList = this._normalizeSongs(data.song.list)
          processSongsUrl(songList).then(res => {
            songList = res
            resolve(ret.concat(songList))
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
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['insertSong'])
  },
  watch: {
    query() {
      this.search()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 36%;
    transform: translateY(-50%);
  }
}
</style>