Waypoints infinite scroll as Vue component
------------------------------------------

waypoints infinite scroll组件Vue版

普通版：http://imakewebthings.com/waypoints/shortcuts/infinite-scroll/

API
---

### 组件Props方法：

-	handleLoad(callback) {Function} 每次load数据的方法。最后需要执行一个回调方法 callback(isEnd, data)。 isEnd {Boolean}表示是否是最后一页，data {Array}表示当前加载的数据

-	onLoad(data) {Function} 每次load完成事件，data {array}本次加载获取的数据

-	onBeforePageLoad {Function} onLoad 之前执行

-	onAfterPageLoad {Function} onLoad 之后执行

-	onFinish {Function} 所以数据加载完成

### 组件Methods方法：

-	refresh {Function} 执行Waypoint.refreshAll()

-	reset {Function} 重置组件，并自动触发一次加载事件，一般用于多个tab切换
