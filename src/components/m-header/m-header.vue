<template>
  <div class="m-header">
    <!-- <a class="download" href="http://47.96.100.173/HOLLY_MUSIC.apk">
      <i class="icon-xiazai">
        <div class="mini-text"> App</div>
      </i>
    </a> -->
    <div class="icon"></div>
    <h1 class="text">Holly Music</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 30px
      height: 32px
      margin-right: 9px
      bg-image('logo')
      background-size: 30px 32px
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
    .download
      position: absolute
      top: 0
      left: 0
      .icon-xiazai
        display: block
        padding: 10px
        font-size: 15px
        color: $color-theme
        .mini-text
          font-size: 12px;
          color: $color-theme-text

    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
</style>