import * as types from './mutations-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch} from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
      let randomList = shuffle(list)
      commit(types.SET_PLAYLIST, randomList)
      index = findIndex(randomList, list[index])
    } else {
      commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
  }
  
  export const randomPlay = function({commit}, {list}) {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomlist = shuffle(list)
    commit(types.SET_PLAYLIST, randomlist)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)

  }

  // 插入歌曲
  export const insertSong = function({commit, state}, song) {
    // 播放列表
    console.log(state)
    let playlist = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    // 当前歌曲索引
    let currentIndex = state.currentIndex
    // 记录当前歌曲
    let currentSong = playlist[currentIndex]
    // 当前列表是否有这首歌
    let fpIndex = findIndex(playlist, song)
    // 因插入歌曲当前歌曲索引+1
    currentIndex ++ 
    // 列表中插入
    playlist.splice(currentIndex, 0, song)
    // 如果已经包含这首歌
    if(fpIndex > -1) {
      // 如果当前插入的序号大于列表中的序号
      if(currentIndex > fpIndex) {
        playlist.splice(fpIndex, 1)
        currentIndex --
      } else {
        playlist.splice(fpIndex + 1, 1)
      }
    }
    let currentSIndex = findIndex(sequenceList, currentSong) + 1

    let fsIndex = findIndex(sequenceList, song)
  
    sequenceList.splice(currentSIndex, 0, song)
  
    if (fsIndex > -1) {
      if (currentSIndex > fsIndex) {
        sequenceList.splice(fsIndex, 1)
      } else {
        sequenceList.splice(fsIndex + 1, 1)
      }
    }
    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
  }

  export const saveSearchHistory = function({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
  }

  export const deleteSearchHistory = function({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
  }

  export const clearSearchHistory = function({commit}) {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
  }