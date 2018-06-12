import Vue from 'vue'
import Router from 'vue-router'
const Reacommend = () => import('src/components/recommend/recommend')
const Rank = () => import('src/components/rank/rank')
const Search = () => import('src/components/search/search')
const Singer = () => import('src/components/singer/singer')
const SingerDetail = () => import('src/components/singer-detail/singer-detail')
const SongListDesc = () => import('src/components/song-list-desc/song-list-desc')
const TopList = () => import('src/components/top-list/top-list')
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
      component: Search,
      children: [
        {
          path:':id',
          component: SingerDetail
        }
      ]

    }
  ]
})
