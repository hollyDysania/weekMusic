import {commonParams} from './config'
import axios from 'axios'
axios.defaults.baseURL = process.env.BASE_API;
export function getLyric(mid) {
  const url = '/lyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pacachetime: +new Date(),
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 67232076,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}