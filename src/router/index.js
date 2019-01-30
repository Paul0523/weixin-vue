import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Ele from '@/components/Ele'
import ChatWin from '@/components/ChatWin'
import Drag from '@/components/Drag'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/list',
      name: 'Ele',
      component: Ele
    },
    {
      path: '/chatWin',
      name: 'ChatWin',
      component: ChatWin
    },
    {
      path: '/drag',
      name: 'Drag',
      component: Drag
    }
  ]
})
