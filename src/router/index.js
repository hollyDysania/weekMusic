import Vue from 'vue'
import Router from 'vue-router'
import Reacommend from 'src/components/recommend/recommend'
import Rank from 'src/components/rank/rank'
import Search from 'src/components/search/search'
import Singer from 'src/components/singer/singer'
import SingerDetail from 'src/components/singer-detail/singer-detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Reacommend
    },
    {
      path: '/recommend',
      component: Reacommend
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
      component: Rank
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
