<template>
  <div ref="wrapper">
      <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props:{
    probeType: {
        type: Number,
        default: 1
    },
    click: {
        type: Boolean,
        default: true
    },
    // 数据
    data: {
        type: Array,
        default: null
    },
    listenScroll: {
        type: Boolean,
        default: false
    },
    // 上拉
    pullup: {
      type: Boolean,
      default: false
    },
    // 下拉
    pulldown: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
      setTimeout(() => {
          this._initScroll()
      }, 20)
  },
  methods: {
      _initScroll() {
          let me = this
          if(!this.$refs.wrapper) {
              return
          }
          this.scroll = new BScroll(this.$refs.wrapper, {
              probeType: this.probeType,
              click: this.click
          })
          if(this.listenScroll) {
              this.scroll.on('scroll', (pos) => {
                  me.$emit('scroll', pos)
              })
          }
          if(this.pullup) {
            this.scroll.on('scrollEnd', () => {
              if(this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                this.$emit('scrollToEnd')
              }
            })
          }
          if(this.pulldown) {
            this.scroll.on('touchEnd', () => {
              if(this.scroll.y >= 20) {
                this.$emit('pullDownEnd')
              }
            })
          }
          if(this.beforeScroll) {
            this.scroll.on('beforeScrollStart', () => {
              this.$emit('beforeScroll')
            })
          }
      },
      enable() {
          this.scroll && this.scroll.enable()
      },
      disable() {
          this.scroll && this.scroll.disable()
      },
      refresh() {
          this.scroll && this.scroll.refresh()
      },
      scrollTo() {
          this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
          this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
  },
  watch: {
      data() {
          setTimeout(() => {
              this.refresh()
          }, 20)
      }
  }

}
</script>
