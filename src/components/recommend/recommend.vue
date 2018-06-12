<template>
  <div class="recommend" ref="recommend">
      <scroll ref="scroll" class="recommend-content" :data="discList">
        <div>
          <div v-if="recommends.length > 0" class="slider-wrapper">
            <swiper :autoPlay='true' :showIndicator='true' interval="2500" duration="500">
              <slide v-for="(item, index) in recommends" :key="index">
                <a :href="item.linkUrl">
                  <img  @load="loadImage" :src="item.picUrl" alt="" class="needsclick" height="100%" width="100%">
                </a>
              </slide>
            </swiper>
          </div>
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
import { getRecommend, getDiscList } from "src/api/recommend";
import { ERR_OK } from "src/api/config";
import Scroll from 'src/base/scroll/scroll'
import Loading from 'src/base/loading/loading'
import {playListMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
import { Swiper, Slide } from 'vue-swiper-component';
export default {
  data() {
    return {
      recommends: [],
      // 歌单
      discList: []
    };
  },
  // 当前页面的methods会覆盖mixin里的methods同名方法
  mixins: [playListMixin],
  components: {
    Scroll,
    Loading,
    Swiper,
    Slide
  },
  created() {
    this._getRecommend();
    this._getDiscList();
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
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
      });
    },
    loadImage() {
      if(!this.checkLoaded) {
        console.log(1)
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })

  }
};
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