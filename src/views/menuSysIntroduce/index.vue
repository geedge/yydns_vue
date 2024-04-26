<template>
    <div class="range-config-manage" ref="appRef">
        <div class="show">
<!--            <Header-->
<!--            ></Header>-->
            <div>
                <span style="font-size: 20px;margin-bottom: 1%;margin-top: 2%;float: left;margin-left: 3%;color: #00C0FF">能力指代不同渗透策略,代理将根据策略逻辑以及主控端下发的生成参数生成对应的载荷</span>
            </div>
            <div class="list" id="show-loading">
                <div class="single" v-for="rangeItem in rangeList" :key="rangeItem.target_name">
                    <div class="title">
                        <el-tag type="success" style="margin-right: 2%">标签二</el-tag>
                        <el-tag>标签一</el-tag>
                    </div>
                    <div class="container">
                        <div class="row" >
                            <span style="float: left;margin-left: 2%;font-size: 20px;color: #efefef"> IPV6 DDOS</span>
                            <div style="margin-left: auto;">
                                <el-button size="mini" type="primary" @click="getInfo(rangeItem)">详情</el-button>
                            </div>
                        </div>

                    </div>
                    <div>
                        <span style="word-wrap: break-word;">
                            lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkklllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll
                        </span>
                    </div>
                </div>
            </div>
            <div class="mask"></div>
            <div class="popup" v-if="newlyPztj">
                <!-- 在此处指定弹窗的样式和内容 -->
                <i class="el-icon-close" style="float: right; padding-right: 7%;padding-top: 2.8%" @click="CustomizationImageFales()"></i>
                <span style="color: #f5f7f0;font-size: 20px;float: left;margin-left: 6%;margin-top: 1%">详情999</span>
                <div class="jbpz">
                    <template>
                        <el-row style="display: flex; flex-direction: row;">
                            <el-col :span="20">当前状态</el-col>
                            <el-col :span="20">离线</el-col>
                        </el-row>
                        <el-divider content-position="center"></el-divider>
                        <el-row style="display: flex; flex-direction: row;">
                            <el-col>编号</el-col>
                            <el-col>999</el-col>
                        </el-row>
                        <el-divider content-position="center"></el-divider>
                        <el-row style="display: flex; flex-direction: row;">
                            <el-col>通信端口</el-col>
                            <el-col>3706</el-col>
                        </el-row>
                        <el-divider content-position="center"></el-divider>
                        <el-row style="display: flex; flex-direction: row;">
                            <el-col>运行平台</el-col>
                            <el-col>linux</el-col>
                        </el-row>
                        <el-divider content-position="center"></el-divider>
                        <el-row style="display: flex; flex-direction: row;">
                            <el-col>IP地址</el-col>
                            <el-col>1.1.1.1</el-col>
                        </el-row>
                        <el-divider content-position="center"></el-divider>
                        <el-row style="display: flex; flex-direction: row;">
                            <el-col>CPU核心数</el-col>
                            <el-col>9</el-col>
                        </el-row>
                        <el-divider content-position="center"></el-divider>

                        <el-row style="display: flex; flex-direction: row;">
                            <el-col>系统内存</el-col>
                            <el-col>85G</el-col>
                        </el-row>
                        <el-divider content-position="center"></el-divider>

                        <el-row style="display: flex; flex-direction: row;">
                            <el-col>运行时间</el-col>
                            <el-col>55天</el-col>
                        </el-row>
                        <el-divider content-position="center"></el-divider>

                    </template>
                    <footer class="anDiv">
                        <el-button class="glBut" type="primary" @click="CustomizationImageFales">关闭</el-button>
                    </footer>
                </div>

            </div>
            <el-drawer
                title=""
                :visible.sync="drawer"
                :append-to-body="true"
            >
            </el-drawer>
        </div>
    </div>
</template>
<script>
import Header from './module/Header.vue'
export default {
    components:{ Header},
    data(){
        return{
            newlyPztj:false,
            info:{},
            drawer: false,
            page: 1,
            size: 10,
            total: 0,
            isAdd: false,
            loading: false,
            tableData: [],

            rangeList:[
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
            ],
        }
    },
    mounted() {},
    watch: {},
    created() {
    },
    methods:{
        getInfo(val){
            this.info=val
            this.newlyPztj=true
            document.querySelector('.mask').style.display = 'block'
        },
        CustomizationImageFales(){
            this.newlyPztj=false;
            document.querySelector('.mask').style.display = 'none'
        },
    }
}

</script>

<style lang='less' scoped="scoped">
    .popup{
        z-index: 997;
        width: 43%;
        height: 75%;
        position: absolute; /* 绝对定位 */
        top: 50%; /* 向下偏移50% */
        left: 50%; /* 向右偏移50% */
        transform: translate(-50%, -50%); /* 回移50% */
        background-image:url('../../img/tjpz.svg');
        background-repeat: no-repeat; /* 可选，防止图像重复 */
        background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
        .tag{
            margin-left: 9%;
            .tags{
                margin-right: 5%;
                margin-top: 2%;
                font-size: 23px;
                border: none;
                background-color: transparent !important;
                color: #565e6e;
            }
        }
        .jbpz{
            margin-top: 10%;
            margin-left: 15%;
            height: 100%;
            width: 70%;
            text-align: center;
            position:relative;
            .project{
                display: inline-block;
                width: 100%;
                margin-top: 3%;
                text-align: center;
                padding-right: 10%;

            }
            .tar{
                display: flex;
                margin-left: 23%;
                width: 100%;
                text-align: center;
                ::v-deep .el-upload-list {
                    margin: 0;
                    list-style: none;
                    width: 300px !important;
                    padding-left: 20%;
                }
                .uploadBgImg{
                    margin-top: 5%;
                    width: 300px;
                    height: 40px;
                    background-image: url("../../img/shangchuan.png");
                    background-repeat: no-repeat; /* 可选，防止图像重复 */
                    background-size: 100% auto; /* 宽度为100%，高度自适应保持宽高比 */
                    text-align: right;
                    padding-right: 10%;
                    padding-top: 2%;
                    font-size:0;
                    color: rgba(81, 84, 102, 0.84);
                }
                .uploadBgImg::file-selector-button{
                    padding: 0;
                    background-color: transparent;
                    cursor: pointer;
                    font-size: 0;
                }
            }
            .srkType{
                width: 100%;
                float: left;
                margin-top: 2%;
                text-align: center;
                .srk{
                    width: 40%;
                    margin-left: 2%;
                    background-color: #0c295b;
                    display: inline-block;
                    border: none;
                }
            }
            .radioType{
                width: 100%;
                float: left;
                margin-top: 2%;
                text-align: center;
            }
            .anType{
                height: 10%;
                position:absolute;
                bottom:4%;
                left: 50%;
                transform: translateX(-50%);
                .glBut{
                    width: 90px;
                    height: 30px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba(24, 133, 234, 0.2);
                    color: #1b7cc4;
                }

            }
        }
    }

.custom-table {
    width: 100%;
    height: 100%;
}
.range-config-manage{
    width: 100%;
    height: 100%;
    /*background-color: #010f4e;*/
    // background-color: rgba(255, 25, 49, 0.4);
    float: right;
    position: relative; /* 确保相对定位生效 */

    .show{
        width: 95%;
        height: 95%;
        /*background-color: #67c23a;*/
        position: absolute; /* 绝对定位 */
        top: 50%; /* 向下偏移50% */
        left: 50%; /* 向右偏移50% */
        transform: translate(-50%, -50%); /* 回移50% */
        background-image:url('../../img/backgroundFourCorner.png');
        background-repeat: no-repeat; /* 可选，防止图像重复 */
        background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
        /*background-size: cover; !* 宽度为100%，高度自适应保持宽高比 *!*/

        /*display: flex; !* 将容器设置为 Flex 容器 *!*/
        /*justify-content: center; !* 水平居中子元素 *!*/
        /*align-items: center; !* 垂直居中子元素 *!*/

        /*.list{*/
        /*    width: 95%;*/
        /*    height: 84%;*/
        /*    margin-left: 2.5%;*/
        /*    overflow-y: auto;*/
        /*    overflow-y: scroll;*/
        /*    overflow-x: hidden;*/
        /*    border: none;*/
        /*}*/
        /*.list::-webkit-scrollbar {*/
        /*    width: 0px;  !* 隐藏滚动条 *!*/
        /*    height: 0px;*/
        /*    background-color: transparent; !* 让背景透明 *!*/

        /*}*/
        .list{
            display:flex;
            flex-direction: row;
            justify-content: flex-start;
            flex-wrap: wrap;
            align-content: flex-start;
            width: 95%;
            height: 84%;
            margin-left: 2.5%;

            overflow-y: auto;
            overflow-y: scroll;
            overflow-x: hidden;
            border: none;

            .single:hover{
                border: 1px solid #159dd3;
            }
            .single{
                width: 32%;
                height: 25.5%;
                border-radius: 8px;
                border: 1px solid rgba(186, 208, 241, 0.10);
                background: rgba(25, 33, 61, 0.40);
                margin-left: 1.2%;
                margin-bottom: 0.9%;
                padding: 20px;
                display: inline-block;
                .title{
                    text-align: left;
                }
                .container{
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    margin: 10px 0 10px 0;
                    .row {
                        display: flex;
                        padding-bottom: 10px;
                    }

                    .cell {
                        flex-grow: 1;
                        color: rgba(255, 255, 255, 0.6);
                        border: none;
                        text-align: left;
                    }

                    .cell.small {
                        flex-basis: 33.5%;
                    }

                    .cell.large {
                        flex-basis: 66.5%;
                    }
                }
                .buttons{
                    text-align: left;

                    .glBut{
                        width: 80px;
                        height: 30px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        // margin-left: 2%;
                        background-color: rgba(14, 61, 138, 0.50);
                        color: #02DDEA;
                    }
                }
            }
        }
        /* 隐藏火狐浏览器滚动条 */
        @-moz-document url-prefix() {
            .trackSource {
                scrollbar-width: none;
            }
        }
        // 遮罩层
        .mask{
            position: fixed; /*将元素设置为固定定位*/
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: rgba(0,0,0,0.5); /*通过rgba函数来控制遮罩层的透明度*/
            display: none; /*将元素隐藏*/
        }
    }
}
</style>
