<template>
	<div class="home" ref="appRef">
        <div class="show">
            <div><span style="float: left;font-size: 20px;margin-left: 2%;color: #00C0FF;margin-top: 1%">{{"目标IP:"+parentLevelRow.target}}</span></div>
            <div class="tag">
                <el-tag class="tags" :style="{'color': (tag==='目标时延') ? '#f8fdff': '#565e6e'}" @click="updateTag('目标时延')">目标时延:</el-tag>
                <el-tag class="tags1" :style="{'color': (tag1==='ICMP/v6延时') ? '#f8fdff': '#565e6e'}" @click="updateTag1('ICMP/v6延时')">ICMP/v6延时</el-tag>
                <el-tag class="tags1" :style="{'color': (tag1==='DNS查询时延') ? '#f8fdff': '#565e6e'}" @click="updateTag1('DNS查询时延')">DNS查询时延</el-tag>
                <el-tag class="tags1" :style="{'color': (tag1==='TCP连接时延') ? '#f8fdff': '#565e6e'}" @click="updateTag1('TCP连接时延')">TCP连接时延</el-tag>
                <el-tag class="tags" :style="{'color': (tag==='应答内容') ? '#f8fdff': '#565e6e'}" @click="updateTag('应答内容')">应答内容</el-tag>
            </div>
            <div v-if="tag==='应答内容'" class="answer">
                    <div style="display: flex;margin-right: 5px;">
                        <span style="margin-right: 2%;font-size: 25px;width: 15%">目标域名:</span>
                        <el-input v-model="input"  placeholder="请输入目标IP"></el-input>
                    </div>
                <el-button type="primary" style="margin-top: 2%;margin-bottom: 10%">查询</el-button>

            </div>
            <div class="top" v-if="tag==='目标时延'">
                <div class="top-left">
                    <SourceView class="top-left-target" :left1data="left1data"/>
                </div>
                <TargetView class="top-right" :left1data="left1data"/>
            </div>
            <div class="top" v-if="tag==='应答内容'">
                <div class="top-left">
                    <div class="top-left-target" >
                        <div style="display: flex">
                            <span style="font-size: 20px;margin-top: 1%;margin-left: 2%;margin-right: 2%;margin-top: 2%">应答结果参考来源</span>
                            <div class="project" style="margin-top: 2%">
                                <el-select v-model="powerValue" placeholder="能力筛选" clearable @change="query">
                                    <el-option
                                            v-for="item in powerFilter"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div style="width: 90%;height: 75%;background-color: #324c98;margin-top: 1.5%;margin-left: auto; margin-right: auto;"></div>

                    </div>
                    <!--                    <SourceView class="top-left-target"/>-->
                </div>
                <div class="top-right" >
                    <div style="display: flex">
                        <span style="font-size: 20px;margin-top: 1%;margin-left: 2%;margin-right: 2%;margin-top: 2%">目标解析器响应结果</span>
                    </div>
                    <div style="width: 90%;height: 75%;background-color: #324c98;margin-top: 3%;margin-left: auto; margin-right: auto;"></div>
                </div>
<!--                <TargetView class="top-right"/>-->
            </div>
            <NodeView class="bottom" v-if="tag==='目标时延'"></NodeView>
        </div>
	</div>
</template>

<script>
import TargetView from './module/target.vue'
import ImageView from './module/image.vue'
import SourceView from './module/source.vue'
import NodeView from './module/node.vue'
export default {
    name: 'home',
    components: { TargetView, ImageView, SourceView, NodeView },
    created() {
        this.parentLevelRow = this.$route.query.row;
        this.input=this.parentLevelRow.target_domain;


    },
    // mounted() {
    //     this.$router.push('/range/home')
    // },
    methods:{


        updateTag(val){
            if(val==='目标时延'){
                this.tag=val
                this.tag1="ICMP/v6延时"
            }else {
                this.tag=val
                this.tag1=""
            }

        },
        updateTag1(val){
            this.tag1=val;
            this.tag='目标时延';
            this.left1data.type=this.changePeram(val);
            this.left1data.target=this.parentLevelRow.target;

        },
        changePeram(val){
            switch (val) {
                case 'ICMP/v6延时':
                    return 'icmp';
                    break;
                case 'DNS查询时延':
                    return 'dns';
                    break;
                case 'TCP连接时延':
                    return 'tcp';
                    break;
                default:
                    console.log('No option selected');
                    break;
            }
        }
    },
    data() {
        return {
            left1data:{
                target:'1.1.1.1',
                type:'icmp',
            },
            leftYdata:[],
            parentLevelRow:{},
            tag:'目标时延',
            tag1:"ICMP/v6延时",
            input:"",
            powerFilter:[
                {
                    value:'8.8.8.8',
                    label:'谷歌（8.8.8.8）'
                },
                {
                    value:'0.0.0.0',
                    label:'**（0.0.0.0）'
                },
                {
                    value:'1.1.1.1',
                    label:'**（1.1.1.1）'
                },
            ],
        }
    },

}
</script>
<style lang="less" scoped>
    .answer {
        width: 50%;       /* 设置宽度为 50% */
        margin: 0 auto;   /* 水平居中 */
        text-align: center; /* 内容居中 */
        margin-top: 5%;
    }
    .tag{
        margin-left: 9%;
        .tags{
            margin-right: 1%;
            margin-left: 5%;
            font-size: 23px;
            border: none;
            background-color: transparent !important;
            color: #565e6e;
        }
        .tags1{
            margin-right: 2%;
            margin-top: 2%;
            font-size: 18px;
            border: none;
            background-color: transparent !important;
            color: #565e6e;
        }
    }
.home {
    width: 100%;
    height: 100%;
    position: relative; /* 确保相对定位生效 */
}
.show {
    height: 95%;
    width: 95%;
    position: absolute; /* 绝对定位 */
    top: 50%; /* 向下偏移50% */
    left: 50%; /* 向右偏移50% */
    transform: translate(-50%, -50%); /* 回移50% */
    /*display: flex;*/
    /*flex-direction: column;*/
    /*justify-content: space-between;*/
    /*overflow-y: auto;*/

}
.top {
    height: 49%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .top-left {
        width: 49.5%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .top-left-target {
            height: 90%;
            background-image:url('../../img/background/homeTargetBg.svg');
            background-repeat: no-repeat;
            background-size: cover;
        }
        /*.top-left-iamge {*/
        /*    height: 48%;*/
        /*    background-image:url('../../img/background/homeTargetBg.svg');*/
        /*    background-repeat: no-repeat;*/
        /*    background-size: cover;*/
        /*}*/
    }
    .top-right {
        width: 49.5%;
        height: 90%;
        background-image:url('../../img/background/homeSourceBg.svg');
        background-repeat: no-repeat;
        background-size: cover;
    }
}
.bottom {
    height: 44%;
    background-image:url('../../img/background/homeNodeBg.svg');
    background-repeat: no-repeat;
    background-size: cover; 
}
</style>
