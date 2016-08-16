/**
 * 拉到底部加载更多
 * Created by montage on 16/6/30.
 */


import waypointInfinite from './components/waypoint-infinite.vue'

//dom ready
$(()=>{

    //模拟ajax
    const $ajax = (o) => {
        setTimeout(() => {
            o.success({
                ec: 200,
                em: 'success',
                is_end: o.data.pageIndex > 5,
                data: {
                    list: new Array(10).fill({
                        desc: Math.random() * 1000000,
                        time: Date.now()
                    })
                }
            })
        }, 600)
    }


    //初始化VUE
    const loadOnScroll = new Vue({
        el: '#container',
        components: {
            waypointInfinite
        },
        data: {
            list: [],
            nothing: false,
            pageIndex: 1
        },
        methods: {
            //获取数据方法
            handleLoad (callback) {
                $ajax({
                    type: 'get',
                    url: `/json/infinite`,
                    data: {
                        pageIndex: this.pageIndex
                    },
                    success: function(res){
                        if(res.ec == 200){
                            this.pageIndex ++;

                            //数据传递给组件
                            //第一个参数： 是否全部加载完成
                            //第二个参数： 当前加载的数据 Array
                            callback(!res.is_end , res.data.list)
                        }else{
                            alert('加载失败！')
                        }
                    }.bind(this)
                })
            },

            //每次加载完成一页
            onLoad (items){
                this.list = this.list.concat(items)
            },

            //每次加载前
            onBeforePageLoad (){
                console.log(`start to load page ${this.pageIndex}`)
            },

            //每次加载后
            onAfterPageLoad (){
                console.log(`loaded`)
            },

            //所有的加载完成
            onFinish (){
                console.log('finish')

                if(this.list.length === 0){
                    this.nothing = true
                }
            }
        }
    })
})
