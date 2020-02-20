import Cookies from 'js-cookie'
const Token = 'token'

const getToken = () => {
  return Cookies.get(Token)
}

const setToken = (token, expires = null) => {
  if (expires) {
    return Cookies.set(Token, token, {
      expires,
    })
  } else {
    return Cookies.set(Token, token)
  }
}

const removeToken = () => {
  return Cookies.remove(Token)
}

// 用户权限

let getPermissions = () => {
  return localStorage.getItem(Permissions)
}

let setPermissions = (e) => {
  return localStorage.setItem(Permissions, e)
}

export default {
  getToken,
  setToken,
  removeToken,
  getPermissions,
  setPermissions,
}
