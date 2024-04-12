<template>
    <div class="range-config-manage" ref="appRef">
        <div class="show">
            <Header
            ></Header>
            <div class="list" >
                <el-table
                    class="custom-table"
                    ref="multipleTable"
                    v-loading="loading"
                    element-loading-text="加载中..."
                    height="100%"
                    style="width: 100%;"
                    :data="tableData"
                    tooltip-effect="dark"
                    highlight-current-row
                >
                    <el-table-column
                        align="center" 
                        type="index"
                        label="序号"
                        width="150"/>
                    <el-table-column
                        align="center"
                        prop="country_name"
                        label="介绍名称"
                        min-width="150"/>
                    <el-table-column
                        align="center"
                        prop="network_count"
                        label="网段数"
                        min-width="150"/>
                    <el-table-column 
                        align="center"
                        prop="used_ip_count"
                        label="已用ip数"
                        min-width="150"/>
                    <el-table-column
                        align="center"
                        prop="unused_ip_count"
                        label="未用ip数"
                        min-width="150"/>
                    <el-table-column 
                        align="center"
                        prop="create_time"
                        label="创建时间"
                        min-width="150">
                        <template slot-scope="scope">
                            {{ scope.row.create_time | formatTime }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作"
                        min-width="200"
                    >
                        <template slot-scope="scope">
                            <el-button type="text" size="medium" :loading="scope.row.delLoading" >详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
                background
                :current-page="page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="10"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
            <div class="mask"></div>
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
            drawer: false,
            page: 1,
            size: 10,
            total: 0,
            isAdd: false,
            loading: false,
            tableData: []
        }
    },
    mounted() {},
    watch: {},
    created() {
    },
    methods:{
    }
}

</script>

<style lang='less' scoped="scoped">
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

        .list{
            width: 95%;
            height: 84%;
            margin-left: 2.5%;
            overflow-y: auto;
            overflow-y: scroll;
            overflow-x: hidden;
            border: none;
        }
        .list::-webkit-scrollbar {
            width: 0px;  /* 隐藏滚动条 */
            height: 0px;
            background-color: transparent; /* 让背景透明 */

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
