<template>
    <div class="container">
        <div class="card-detail">
            <Detail></Detail>
        </div>
        <div class="card-file">
            <File></File>
        </div>
        <div class="card">
            <Log></Log>
        </div>
        <div class="card">
            <Console></Console>
        </div>
    </div>
</template>

<script>
import Detail from './detail/index.vue'
import File from './file/index.vue'
import Log from './log/index.vue'
import Console from './console/index.vue'
import { getTargetsResponse } from './mock.js'
export default {
    name: "NodeDetail",
    components: { Detail, File, Log, Console},
    data(){
        return{
            nodeId: '',
            nodeDetail: {}
        }
    },
    mounted() {
    },
    // watch: {
    //     '$store.state.range.nodeId': {
    //         handler(newVal, oldVal) {
    //             this.nodeId = newVal
    //             this.init()
    //         },
    //         immediate: true
    //     } 
    // },
    created() {
    },
    methods:{
        // init() {}
    }
}
</script>

<style lang='less' scoped="scoped">
.container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-around;
    align-content: space-around;
    background-image:url('../../../img/background/backgroundFourCorner.svg');
    background-repeat: no-repeat; /* 可选，防止图像重复 */
    background-size: 100% auto; /* 宽度为100%，高度自适应保持宽高比 */
    .card{
        width: 48%;
        height: 46%;
        background-image:url('../../../img/backgroundFourCorner.png');
        background-repeat: no-repeat; /* 可选，防止图像重复 */
        background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
    }
    .card-detail{
        width: 48%;
        height: 46%;
    }
    .card-file{
        width: 48%;
        height: 46%;
    }
}
</style>