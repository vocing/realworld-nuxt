import { request } from '@/plugins/request.js'

export const getProfile = username => {
  return request({
    method: 'POST',
    url: `api/profiles/${username}`
  })
}

export const register = data => {
  return request({
    method: 'POST',
    url: 'api/users',
    data
  })
}