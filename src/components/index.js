import zIcon from './zIcon'

const Components = {
  zIcon
}

const install = Vue => {
  for (let i in Components) {
    Vue.component(i, Components[i])
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

Components.install = install

export default Components
