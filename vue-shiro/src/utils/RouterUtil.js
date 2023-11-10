export function getChildrenPath(router) {
  let menus = JSON.parse(localStorage.getItem('menu'))
  const routerList = []
  menus.forEach(me => {
    setChild(me, routerList, '', '')
  })
  routerList.forEach(item => {
    router.addRoute('main', item)
  })
}

function setChild(me, routerList, rootName, rootPath) {
  rootName = me.name
  rootPath = me.url
  if (me.children != null && me.children.length !== 0 && me.children.length > 0) {
    //如果有下层
    me.children.forEach(node => {
      setChild(node, routerList, rootName, rootPath)
    })
  }
  if (me.type === 'MENU') {
    //没有下层则说明这是一个路由
    let rou = {
      name: rootName,
      path: rootPath,
      component: () => import('../Views' + rootPath)
    }
    routerList.push(rou)
  }
}

