let lockReconnect = false
let wsUserName = null
let wsCallBack = null
let wsHost = null
let wsTimerId = null
let ws = null
const initWebSocket = (host, userName, callback) => {
  wsHost = host
  const tempHost = host + '/' + userName // + randGen()
  wsUserName = userName
  wsCallBack = callback
  let initWebSocketIsPass = false
  if ('WebSocket' in window) {
    ws = new WebSocket(tempHost)
    initWebSocketIsPass = true
  } else if ('MozWebSocket' in window) {
    // eslint-disable-next-line
    ws = new MozWebSocket(tempHost)
    initWebSocketIsPass = true
  }
  if (initWebSocketIsPass == true) {
    ws.onclose = () => {
      console.log('ws连接关闭!' + new Date().toUTCString())
      reconnectWs()
      clearWsTimer()
    }
    ws.onerror = () => {
      console.log('ws连接错误!' + new Date().toUTCString())
      reconnectWs()
      clearWsTimer()
    }
    ws.onopen = () => {
      if (wsUserName) {
        console.log('ws连接成功', wsUserName)
        const user = 'online' + wsUserName + '-web'
        ws.send(user)
      } else {
        console.log('ws连接成功 userName is null')
      }
      wsTimer(ws)
    }
    ws.onmessage = (event) => {
      if (event.data == 'pong') {
        return
      }
      if (event.data == 'needAuth') {
        ws.send('token: ' + 'ssdfsfsdfsfsdfsdf')
        return
      }
      if (event.data == 'authError') {
        console.log(event.data)
        return
      }
      const resp = JSON.parse(event.data)
      wsCallBack(resp)
    }
  }
  return initWebSocketIsPass
}

const wsTimer = (ws) => {
  wsTimerId = setInterval(() => {
    ws.send('ping')
  }, 30000) //定时器
}
const clearWsTimer = () => {
  clearInterval(wsTimerId) //看清楚传入的是定时器返回的id
}

const reconnectWs = () => {
  if (lockReconnect == false) {
    lockReconnect = true
    setTimeout(() => {
      console.log('ws重连!' + new Date().toUTCString())
      initWebSocket(wsHost, wsUserName, wsCallBack)
      lockReconnect = false
    }, 5000)
  }
}
// const randGen = () => {
//   let Num = ''
//   for (let i = 0; i < 6; i++) {
//     Num += Math.floor(Math.random() * 10)
//   }
//   return Num
// }

export default initWebSocket
