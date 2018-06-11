<template>
  <div class="singer" ref="singer">
    <listView :data="singers" @select="selectSinger" ref="singerView"></listView>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from "src/api/singer";
import {ERR_OK} from 'src/api/config'
import Singer from 'common/js/singer'
import ListView from 'src/base/listview/listview'
import {mapMutations} from 'vuex'
import {playListMixin} from 'common/js/mixin'

const HOT_NAME = "热门"
const HOT_SINGER_LEN = 10
export default {
  data() {
    return {
      singers: []
    };
  },
  // 当前页面的methods会覆盖mixin里的methods同名方法
  mixins: [playListMixin],
  components: {
    ListView
  },
  created() {
    this._getSingerList();
  },
  methods: {
    // 有小播放器时 改变列表的bottom
    handlePlaylist(playList) {
      console.log(playList, 111)
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.singerView.refresh()
    },
    ...mapMutations({
      setsinger: 'SET_SINGER'
    }),
    selectSinger(singer) {
      this.$router.push({path: `/singer/${singer.id}`})
      this.setsinger(singer)
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      });
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      console.log(list,111)
      list.forEach((item, index) => {
        if(index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if(!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
        }))
      })
      // map对象是无序的 处理map得到有序
      let hot = []
      let ret = []
      for(let key in map) {
        let val = map[key]
        if(val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        }else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
