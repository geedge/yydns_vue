<template>
    <div class="node-card">
        <span style="font-size: 20px;float: left;margin-top: 1%;margin-left: 2%">系统运行日志</span>
        <div class="project">
            <div class="block">
                <el-date-picker
                        v-model="time1"
                        type="datetime"
                        placeholder="选择开始时间"
                        align="right"
                        :picker-options="pickerOptions"
                        @change="query">
                </el-date-picker>
            </div>
        </div>
        <div class="project">
            <div class="block">
                <el-date-picker
                        v-model="time2"
                        type="datetime"
                        placeholder="选择结束时间"
                        align="right"
                        :picker-options="pickerOptions"
                        @change="query">
                </el-date-picker>
            </div>
        </div>
        <div class="project">
            <el-select v-model="log_level" placeholder="日志等级筛选" clearable @change="query">
                <el-option
                        v-for="item in log_levels"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="project" @keyup.enter="query">
            <el-input v-model="userAccount" placeholder="用户账号筛选" suffix icon="">
                <template v-slot:suffix>
                    <div class="icon-group">
                        <img src="../../../img/inputl.png" alt="**">
                        <img src="../../../img/inputIcon.png" alt="*" @click="query">
                    </div>
                </template>
            </el-input>
        </div>
        <div class="list" >
            <el-table class="custom-table"
                      ref="multipleTable"
                      :data="tableData"
                      height="100%"
                      style="width: 100%;"
                      tooltip-effect="dark"
                      highlight-current-row
            >
                <el-table-column type="index" align="center" min-width="100">
                    <template slot="header" slot-scope="scope">
                        <span>序号</span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 prop="time"
                                 label="时间"
                                 min-width="100">
                </el-table-column>
                <el-table-column align="center"
                                 prop="level"
                                 label="日志级别"
                                 min-width="100">
                </el-table-column>
                <el-table-column align="center"  label="日志信息" min-width="300">
                    <template slot-scope="scope" >{{ scope.row.info.substr(0, 80)}}</template>
                </el-table-column>
                <el-table-column align="center"
                                 prop="user"
                                 label="用户账号"
                                 min-width="100">
                </el-table-column>

                <el-table-column align="center"
                                 prop="ip"
                                 label="用户IP"
                                 min-width="100">
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
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
        >
        </el-pagination>
    </div>
</template>

<script>
import * as echarts from 'echarts';

import { Loading } from 'element-ui'
import { getTargetsResponse } from './nodeMock.js'
export default {
    name: 'NodeView',
    data() {
        return {
            tableData:[],
            total:0,
            page:1,
            size:10,
            time1:'',
            time2:'',
            log_level:"",
            userAccount:"",
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            },

            log_levels:[
                {
                    value:'ERROR',
                    label:'ERROR'
                },
                {
                    value:'INFO',
                    label:'INFO'
                },
                {
                    value:'WARNING',
                    label:'WARNING'
                },
            ],


        }
    },
    created() {
        this.query()
    },
    mounted(){
        // this.init()
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.size=val
            this.query()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.page=val
            this.query()
        },
        query(){
            let data={
                "per_page":this.size,
                "page":this.page,
                "begin":this.time1.toString(),
                "end":this.time2.toString(),
                "level":this.log_level,
                "user":this.userAccount,
            }
            // 使用 Object.entries() 来遍历对象的键值对，并过滤掉值为空的属性
            const filteredData = {};
            for (const [key, value] of Object.entries(data)) {
                if (value !== "") {
                    filteredData[key] = value;
                }
            }
            this.$axios.get(this.$http.api.sysLog,filteredData).then(res=>{
                console.log('getImages======',res)
                if(res.code===200){
                    this.tableData=res?.log_data
                    // this.total=res?.total
                    this.total=100
                }
            }).catch(err=>{
                console.log(err)
            })

        },
        // async init() {
        //     await this.getRangeDict()
        //     await this.initData()
        //     this.initEcharts()
        // },
        // initData() {
        //     // this.nodeData = getTargetsResponse?.result
        //     // for (const key in this.nodeData) {
        //     //     this.nodeDataX.push(key)
        //     //     this.nodeDataY.push(this.nodeData[key])
        //     // }
        //
        //     const reqParams = {}
        //     if (this.target_id) {
        //         reqParams.target_id = this.target_id
        //     }
        //     if (this.activeName !== 'total') {
        //         reqParams.status = this.activeName
        //     }
        //     this.loading = true
        //     return this.$axios.get(this.$http.api.getNodeStatistics, reqParams).then(res => {
        //         if (res.code == 200 || res.code == "OK") {
        //             this.nodeDataX = []
        //             this.nodeDataY = []
        //             this.nodeData = res?.result || {}
        //             for (const key in this.nodeData) {
        //                 this.nodeDataX.push(key)
        //                 this.nodeDataY.push(this.nodeData[key])
        //             }
        //         }
        //     }).catch(err => {
        //         console.log(err)
        //     }).finally(() => {
        //         this.loading = false
        //     })
        // },
        // 获取靶场列表字典
        // getRangeDict() {
        //     const reqParams = {
        //         page: 1,
        //         size: 99,
        //     }
        //     return this.$axios.get(this.$http.api.getTargets, reqParams).then(res => {
        //         if (res.code == 200 || res.code == "OK") {
        //             this.rangeDict = res?.result?.items.map(item => {
        //                 return {
        //                     label: item.target_name,
        //                     value: item.id
        //                 }
        //             })
        //         }
        //     }).catch(err => {
        //         console.log(err)
        //     }).finally(() => {
        //         this.rangeDict.unshift({label: '全部靶场', value: ''})
        //         this.target_id = this.rangeDict[0].value
        //         this.target_name = this.rangeDict[0].label
        //     })
        // },
        // 改变靶场
        // async changeRange(val) {
        //     this.target_name = this.rangeDict.find(item => item.value === val)?.label
        //     await this.initData()
        //     this.refreshData()
        // },
        // 改变靶场状态
        // async changeRangeStatus() {
        //     await this.initData()
        //     this.refreshData()
        // },
        // 刷新图标数据
        // refreshData(){
        //     if(!this.nodeChart){
        //         return
        //     }
        //     //更新数据
        //     var option = this.nodeChart.getOption()
        //     option.title[0].text = `${this.target_name}节点统计`,
        //     option.xAxis[0].data = this.nodeDataX
        //     option.series[0].data = this.nodeDataY
        //     this.nodeChart.setOption(option)
        // },
        // 切换靶场状态
        // tabClick(tab, event) {
        //     this.changeRangeStatus()
        // },
        //初始化节点柱状图
        // initEcharts() {
        //     var chartDom = document.getElementById('node');
        //     this.nodeChart = echarts.init(chartDom);
        //     var option;
        //
        //     option = {
        //         title: {
        //             text: `${this.target_name}节点统计`,
        //             left: 'center',
        //             top: '15',
        //             textStyle: {
        //                 color: '#FFFFFF',
        //                 fontSize: 16,
        //                 fontWeight: 500
        //             }
        //         },
        //         tooltip: {
        //             // trigger: 'axis',
        //             axisPointer: {
        //             // type: 'shadow'
        //             }
        //         },
        //         grid: {
        //             top: '25%',
        //             left: '3%',
        //             right: '4%',
        //             bottom: '8%',
        //             containLabel: true
        //         },
        //         xAxis: [
        //             {
        //                 type: 'category',
        //                 data: this.nodeDataX,
        //                 axisTick: {
        //                     // alignWithLabel: true
        //                     show: false
        //                 },
        //                 axisLabel: {
        //                     fontSize: '14',
        //                     color: 'rgba(255, 255, 255, 0.7)'
        //                 }
        //             }
        //         ],
        //         yAxis: [
        //             {
        //                 type: 'value',
        //                 name: '靶场中各类节点数量',
        //                 nameTextStyle: {
        //                     color: 'rgba(255, 255, 255, 0.7)',
        //                     padding: [0, 0, 0, 70]
        //                 },
        //                 axisLabel: {
        //                     fontSize: '12',
        //                     color: 'rgba(255, 255, 255, 0.7)'
        //                 },
        //                 splitLine: {
        //                     show: true,
        //                     lineStyle: {
        //                     color: ['rgba(199, 199, 200, 0.1)'],
        //                     width: 1,
        //                     type: 'dashed'
        //                     }
        //                 }
        //             }
        //         ],
        //         series: [
        //             {
        //                 // name: 'Direct',
        //                 type: 'bar',
        //                 barWidth: '20%',
        //                 data: this.nodeDataY,
        //                 itemStyle: {
        //                     normal: {
        //                         label: {
        //                             show: true, // 是否显示
        //                             position: 'top', // 显示位置
        //                             color: '#FFFFFF',
        //                             formatter: function (params) {
        //                                 // 核心部分 formatter 可以为字符串也可以是回调
        //                                 if (parseInt(params.value) === 0) {
        //                                     return '';
        //                                 } else {
        //                                     return params.data.label;
        //                                 }
        //                             }
        //                         },
        //                         // 每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
        //                         color:  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //                             { offset: 0, color: '#3280D7' },
        //                             { offset: 1, color: '#4122E2' }
        //                         ])
        //                     }
        //                 }
        //             }
        //         ]
        //     };
        //     option && this.nodeChart.setOption(option);
        // }
    }
}
</script>

<style lang="less" scoped>
    .list{
        width: 95%;
        height: 69%;
        margin-left: 2.5%;
        overflow-y: auto;
        overflow-y: scroll;
        overflow-x: hidden;
        border: none;
    }
    .project{
        display: inline-block;
        height: auto;
        width: 10%;
        margin-left: 0.5%;
        margin-right: 3%;
        margin-top: 1%;
        margin-bottom: 1%;
        .el-input::placeholder {
            width: auto;
        }
        .icon-group {
            display: flex; /* 设置容器为 Flexbox 容器 */
            align-items: center; /* 垂直居中图片 */
            gap: 5px; /* 图片和文字之间的间距，可以根据需要进行调整 */

        }
        .icon-group img {
            transform: scale(1);
            margin-right: 15px;
            margin-top: 6px;
        }

    }
.node-card {
    position: relative;
    width: 100%;
    height: 100%;
    .node-chart {
        width: 100%;
        height: 100%;
    }
    .range-select {
        position: absolute;
        top: 12px;
        right: 260px;
        ::v-deep .el-input {
            width: 50%;
            .el-input__inner {
                background-color: transparent !important;
                border-color: transparent;
                border-radius: 0;
                color: #FFFFFF;
            }
            /* select去除竖线 */
            .el-input__suffix::before {
                content: "";
                width: 0;
                height: 0;
                margin: 0;
                position: absolute;
            }
            /*select的上下箭头图标样式*/
            .el-select__caret {
                color: #FFFFFF;
            }
        }
    }
    .tabs-container {
        position: absolute;
        top: 10px;
        right: 36px;
        ::v-deep .el-tabs__nav-wrap::after {
            background-color: transparent;
        }
        ::v-deep .el-tabs__active-bar {
            background-color: rgba(255, 255, 255,0.5);
        }
        ::v-deep .el-tabs__item {
            color: rgba(255, 255, 255,0.5);
        }
        ::v-deep .el-tabs__item.is-active {
            color: #FFFFFF;
        }
    }
}
</style>