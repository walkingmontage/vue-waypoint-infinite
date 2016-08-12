/**
 * 拉到底部加载更多
 * Created by linzhusong on 16/6/30.
 */


import waypointInfinite from './components/waypoint-infinite.vue'

//dom ready
$(()=>{

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


    const loadOnScroll = new Vue({
        el: '#wallet',
        components: {
            waypointInfinite
        },
        data: {
            list: [],
            nothing: false,
            pageIndex: 1
        },
        methods: {
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

                            callback(!res.is_end , res.data.list)
                        }else{
                            alert('加载失败！')
                        }
                    }.bind(this)
                })
            },

            onLoad (items){
                this.list = this.list.concat(items)
            },

            onBeforePageLoad (){
                console.log(`start to load page ${this.pageIndex}`)
            },

            onAfterPageLoad (){
                console.log(`loaded`)
            },

            onFinish (){
                console.log('finish')

                if(this.list.length === 0){
                    this.nothing = true
                }
            }
        }
    })
})
