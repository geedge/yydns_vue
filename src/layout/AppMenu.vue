<template>
    <div class="menu" ref="appRef">
        <div  :class="hit==='home'? 'NotesHit':'Notes'" @click="updataHit('home')">
            <div class="nameIframe" >
                <img src="../img/1.png">
                <span>仪表盘</span>
            </div>
        </div>
        <div  :class="hit==='menuSurrogateInformation'? 'NotesHit':'Notes'" @click="updataHit('menuSurrogateInformation')">
            <div class="nameIframe">
                <img src="../img/4.png">
                <span>代理信息</span>
            </div>
        </div>
        <div  :class="hit==='menuMBGZ'? 'NotesHit':'Notes'" v-on:click="updataHit('menuMBGZ')">
            <div class="nameIframe">
                <img src="../img/6.png">
                <span>目标感知</span>
            </div>
        </div>
        <div  :class="hit==='menuTaskManagement'? 'NotesHit':'Notes'"  @click="updataHit('menuTaskManagement')">
            <div class="nameIframe">
                <img src="../img/7.png">
                <span>任务管理</span>
            </div>
        </div>
        <div  :class="hit==='menuSysManagement'? 'NotesHit':'Notes'" @click="updataHit('menuSysManagement')">
            <div class="nameIframe">
                <img src="../img/6.png">
                <span>系统管理</span>
            </div>
        </div>
        <div  :class="hit==='menuSysIntroduce'? 'NotesHit':'Notes'" @click="updataHit('menuSysIntroduce')">
            <div class="nameIframe">
                <img src="../img/8.png">
                <span>系统介绍</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AppMenu",
        // props:['menuDict'],
        // components:{
        //     router
        // },
        data(){
            return{
                menuDict: localStorage.getItem('menuDict'),
                hit:'home',
                bcSysState:false,
            };
        },
        mounted() {
        },
        watch: {
            '$store.state.globalAttrs.checkMenu': {
                handler(newVal, oldVal) {
                    if (newVal !== '') {
                        this.bcSysState = true
                        this.updataHit(newVal)
                        this.$store.commit('globalAttrs/setCheckMenu', '')
                    }
                }
            }            
        },
        created() {
        },
        methods:{
            updataHit(name){
                this.$router.push({ name })
                this.hit=name
                let title = ''
                switch (name) {
                    case 'home':
                        title = 'Dashboard'
                        break
                    case 'menuSurrogateInformation':
                        title = '代理管理'
                        break
                    case 'menuMBGZ':
                        title = '目标感知'
                        break
                    case 'menuSysManagement':
                        title = '系统管理'
                        break
                    case 'menuTaskManagement':
                        title = '任务管理'
                        break
                    case 'menuSysIntroduce':
                        title = '系统介绍'
                        break             
                    default:
                        title = '仪表盘'
                        break
                }
                this.$emit('parent-func',title)
            },
            onOff(event){
                event.stopPropagation()
                if(this.bcSysState===true){
                    this.bcSysState=false
                }else {
                    this.bcSysState=true
                }
            }
        }
    }

</script>

<style lang='less' scoped>
.menu{
    display: flex;
    flex-direction: column;
    width: 10%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
}
.NotesHit{
    background-image:url(../img/2.png) ;
    background-repeat: no-repeat; /* 可选，防止图像重复 */
    background-size: 90% auto; /* 宽度为100%，高度自适应保持宽高比 */
    background-position: center center; /* 设置背景图片水平、垂直居中 */
    float: right;
    margin-right: 2%;
    margin-top: 5%;

    width: 95%;
    /*height: 50%;*/
    color: #ffffff;
    font-family: "PingFang SC";
    font-weight: 500;
    .nameIframe{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-top: 8%;
        padding-bottom: 8%;
        font-size: 18px;
        margin-left: 10%;
        img {
            height: 10%;
            width: 10%;
            color: #ffffff;
        }
        span {
            margin-left: 8%;
        }
    }
    .nameIframe2{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-top: 8%;
        padding-bottom: 8%;
        font-size: 15px;
        margin-left: 10%;
        span {
            margin-left: 18%;
        }
    }
}
.Notes{
    /*background-image:url(../img/2.png) ;*/
    /*background-repeat: no-repeat; !* 可选，防止图像重复 *!*/
    /*background-size: 100% auto; !* 宽度为100%，高度自适应保持宽高比 *!*/
    /*background-position: center center; !* 设置背景图片水平、垂直居中 *!*/
    float: left;
    margin-right: 2%;
    margin-top: 5%;
    width: 95%;
    // color: #faf8ff;
    color: #cccccc;
    font-family: "PingFang HK";
    .nameIframe{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-top: 8%;
        padding-bottom: 8%;
        font-size: 14px;
        margin-left: 20%;
        img {
            height: 10%;
            width: 10%;
            color: #ffffff;
        }
        span {
            margin-left: 8%;
        }
    }
    .nameIframe2{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-top: 8%;
        padding-bottom: 8%;
        font-size: 14px;
        margin-left: 10%;
        span {
            margin-left: 18%;
        }
    }
}
</style>