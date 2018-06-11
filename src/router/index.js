import Vue from 'vue'
import Router from 'vue-router'
import Reacommend from 'src/components/recommend/recommend'
import Rank from 'src/components/rank/rank'
import Search from 'src/components/search/search'
import Singer from 'src/components/singer/singer'
import SingerDetail from 'src/components/singer-detail/singer-detail'
import SongListDesc from 'src/components/song-list-desc/song-list-desc'
import TopList from 'src/components/top-list/top-list'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Reacommend
    },
    {
      path: '/recommend',
      component: Reacommend,
      children: [
        {
          path: ':id',
          component: SongListDesc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path:':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path:':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
