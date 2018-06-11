import {playMode} from 'common/js/config'
// import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  //歌单详细列表
  disc: {},
  // 排行列表
  topList: {}
//   searchHistory: loadSearch(),
//   playHistory: loadPlay(),
//   favoriteList: loadFavorite()
}

export default state