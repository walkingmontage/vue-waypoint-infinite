<style>
.infinite-loading {
    display: block;
    text-align: center;
    padding: .3rem;
    color: #999;
}
</style>


<template>
    <div v-el:infinite-container >
        <!-- 存放列表区 -->
        <slot></slot>

        <!-- loading区 -->
        <slot name="loading">
            <span class="infinite-loading" v-show="isNotEnd">正在加载...</span>
        </slot>

        <!-- 加载完所有内容后显示 -->
        <slot name="end" v-if="!isNotEnd">
            <p>End</p>
        </slot>
    </div>
</template>


<script>
    /**
     * 无限上拉加载，原理：
     * 存放列表的DOM为container，通过waypoints监听scroll事件
     * 每次container的底部滚动到webview的底部时触发事件，
     * 从而加载新的一页内容，新内容插入后会将container撑出webview，下次scroll继续触发
     */

     const Waypoint = window.Waypoint

     const Infinite = function(options){
         this.options = Object.assign({}, Infinite.defaults, options)
         this.container = this.options.element
         this.vue = this.options.vue

         this.more = this.options.more
         this.handleLoad = this.options.handleLoad

         if (this.more) {
             this.setupHandler()
             this.waypoint = new Waypoint(this.options)
         }
     }

     Infinite.prototype.setupHandler = function(){
         this.options.handler = function() {
             this.options.onBeforePageLoad()
             this.destroy()

             if (!this.vue.isLoading) {
                 this.vue.isLoading = true

                 this.handleLoad(function(newMore, newItems) {
                     this.vue.isLoading = false

                     //是否加载完所有数据
                     this.vue.isNotEnd = newMore

                     //新的数据发送给父级渲染
                     this.vue.$emit('on-load', newItems)
                     this.vue.$nextTick(function() {
                         this.options.onAfterPageLoad()
                         if (newMore) {
                             //重新绑定scroll事件
                             this.waypoint = new Waypoint(this.options)
                         }else{
                             this.options.onFinish()
                         }
                     }.bind(this))
                 }.bind(this))
             }
         }.bind(this)
     }

     /* Public */
     Infinite.prototype.destroy = function() {
         if (this.waypoint) {
             this.waypoint.destroy()
         }
     }

     Infinite.defaults = {
         container: 'auto',
         items: '.infinite-item',
         more: '.infinite-more-link',
         offset: 'bottom-in-view',
         loadingClass: 'infinite-loading',
         onBeforePageLoad (){},     //单页加载前
         onAfterPageLoad (){},      //单页加载后
         onFinish (){}              //全部页面加载完成
     }

     let infinite;

     export default {
         //@handleLoad 为加载新一页的方法
         props: {
             handleLoad: {
                 type: Function,
                 require: true
             },
             onFinish: {
                 type: Function,
                 require: true
             },
             onBeforePageLoad: {
                 type: Function,
                 default: function(){}
             },
             onAfterPageLoad: {
                 type: Function,
                 default: function(){}
             }
         },

         data() {
             return {
                 isLoading: false,
                 isNotEnd: true
             }
         },

         methods: {

            //删除或增加DOM时，触发事件
            refresh() {
                //http://imakewebthings.com/waypoints/api/refresh-all/
                Waypoint.refreshAll()
            },

            //手动触发
            reset() {
                this.isNotEnd = true
                this.isLoading = false

                this.$nextTick(() => {
                    infinite.options.handler.call(infinite)
                })
            }
         },

         ready() {
             infinite = new Infinite({
                 element: this.$els.infiniteContainer,
                 vue: this,
                 handleLoad: this.handleLoad,
                 onFinish: this.onFinish,
                 onBeforePageLoad: this.onBeforePageLoad,
                 onAfterPageLoad: this.onAfterPageLoad
             })
         }
     }
</script>
