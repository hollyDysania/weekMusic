<template>
  <div class="recommend" ref="recommend">
      <scroll ref="scroll" class="recommend-content" :data="discList">
        <div>
            <cube-slide ref="slider" :data="recommends" :loop="true" :auto-play="true">
              <cube-slide-item v-for="(item,index) in recommends" :key="index">
                <a :href="item.linkUrl">
                  <img @load="loadImage" :src="item.picUrl" width="100%">
                </a>
              </cube-slide-item>
              <template slot="dots" slot-scope="props">
                <span class="dot" :class="{active: props.current === index}" v-for="(item, index) in props.dots"></span>
              </template>
            </cube-slide>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li @click="seletItem(item)" v-for="item in discList" class="item">
                <div class="icon">
                  <img v-lazy="item.imgurl" alt="" style="width:60px;height:60px;">
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="loading-container" v-show="!discList.length">
          <loading></loading>
        </div>
      </scroll>
      <router-view></router-view>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from 'src/api/recommend'
import { ERR_OK } from 'src/api/config'
import Scroll from 'src/base/scroll/scroll'
import Loading from 'src/base/loading/loading'
import { playListMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'
// import { Swiper, Slide } from 'vue-swiper-component'
import { debounce } from 'common/js/util'
export default {
  data() {
    return {
      recommends: [],
      // 歌单
      discList: [],
      // 窗口宽度
      screenWidth: document.body.clientWidth,
      showFlag: true
    }
  },
  // 当前页面的methods会覆盖mixin里的methods同名方法
  mixins: [playListMixin],
  components: {
    Scroll,
    Loading
  },
  created() {
    this._getRecommend()
    this._getDiscList()
  },
  mounted() {
    const that = this
    window.onresize = function temp() {
      that.screenWidth = `${document.documentElement.clientHeight}px`
    }
  },
  watch: {
    screenWidth(newWidth) {
      console.log(newWidth)
      debounce(() => {
        this.showFlag = false
        this.$nextTick(() => {
          this.showFlag = true
        })
      }, 400)
    }
  },
  methods: {
    // 点击歌单列表
    seletItem(item) {
      this.$router.push({
        path: `recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    // 有小播放器时 改变列表的bottom
    handlePlaylist(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
          console.log(this.recommends, 6999)
        }
      })
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    loadImage() {
      if (!this.checkLoaded) {
        console.log(1)
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;
    .dots{
      position: absolute;
      right: 0;
      left: 0;
      bottom: 12px;
      transform: translateZ(1px);
      text-align: center;
      font-size: 0;
    }
      .dot{
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: hsla(0,0%,100%,.5);
      }
      .active{
        width: 20px;
        border-radius: 5px;
        background: $color-theme;
      }
    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
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