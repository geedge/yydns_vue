<template>
    <div class="node-card">
        <div class="node-chart" id="node" v-loading="loading"></div>
        <el-select class="range-select" v-model="target_id" placeholder="全部靶场" @change="changeRange">
            <el-option
                    v-for="item in rangeDict"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
        <div class="tabs-container">
            <el-tabs v-model="activeName" @tab-click="tabClick">
                <el-tab-pane label="总量" name="total"></el-tab-pane>
                <el-tab-pane label="已完成" name="complete"></el-tab-pane>
                <el-tab-pane label="创建中" name="pending"></el-tab-pane>
                <el-tab-pane label="创建失败" name="false"></el-tab-pane>
            </el-tabs>
        </div>
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
            target_id: '',
            target_name: '',
            loading: false,
            nodeData: {},
            nodeDataX: [],
            nodeDataY: [],
            rangeDict: [],
            nodeChart: null,
            activeName: 'total'
        }
    },
    created() {
    },
    mounted(){
        this.init()
    },
    methods: {
        async init() {
            await this.getRangeDict()
            await this.initData()
            this.initEcharts()
        },
        initData() {
            // this.nodeData = getTargetsResponse?.result
            // for (const key in this.nodeData) {
            //     this.nodeDataX.push(key)
            //     this.nodeDataY.push(this.nodeData[key])
            // }

            const reqParams = {}
            if (this.target_id) {
                reqParams.target_id = this.target_id
            }
            if (this.activeName !== 'total') {
                reqParams.status = this.activeName
            }
            this.loading = true
            return this.$axios.get(this.$http.api.getNodeStatistics, reqParams).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.nodeDataX = []
                    this.nodeDataY = []
                    this.nodeData = res?.result || {}
                    for (const key in this.nodeData) {
                        this.nodeDataX.push(key)
                        this.nodeDataY.push(this.nodeData[key])
                    }
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.loading = false
            })
        },
        // 获取靶场列表字典
        getRangeDict() {
            const reqParams = {
                page: 1,
                size: 99,
            }
            return this.$axios.get(this.$http.api.getTargets, reqParams).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.rangeDict = res?.result?.items.map(item => {
                        return {
                            label: item.target_name,
                            value: item.id
                        }
                    })
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.rangeDict.unshift({label: '全部靶场', value: ''})
                this.target_id = this.rangeDict[0].value
                this.target_name = this.rangeDict[0].label
            })          
        },
        // 改变靶场
        async changeRange(val) {
            this.target_name = this.rangeDict.find(item => item.value === val)?.label
            await this.initData()
            this.refreshData()
        },
        // 改变靶场状态
        async changeRangeStatus() {
            await this.initData()
            this.refreshData()
        },        
        // 刷新图标数据
        refreshData(){
            if(!this.nodeChart){
                return
            }
            //更新数据
            var option = this.nodeChart.getOption()
            option.title[0].text = `${this.target_name}节点统计`,
            option.xAxis[0].data = this.nodeDataX
            option.series[0].data = this.nodeDataY
            this.nodeChart.setOption(option) 
        },
        // 切换靶场状态
        tabClick(tab, event) {
            this.changeRangeStatus()
        },
        //初始化节点柱状图
        initEcharts() {
            var chartDom = document.getElementById('node');
            this.nodeChart = echarts.init(chartDom);
            var option;

            option = {
                title: {
                    text: `${this.target_name}节点统计`,
                    left: 'center',
                    top: '15',
                    textStyle: {
                        color: '#FFFFFF',
                        fontSize: 16,
                        fontWeight: 500
                    }
                },
                tooltip: {
                    // trigger: 'axis',
                    axisPointer: {
                    // type: 'shadow'
                    }
                },
                grid: {
                    top: '25%',
                    left: '3%',
                    right: '4%',
                    bottom: '8%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.nodeDataX,
                        axisTick: {
                            // alignWithLabel: true
                            show: false
                        },
                        axisLabel: {
                            fontSize: '14',
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '靶场中各类节点数量',
                        nameTextStyle: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            padding: [0, 0, 0, 70]
                        },
                        axisLabel: {
                            fontSize: '12',
                            color: 'rgba(255, 255, 255, 0.7)'
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                            color: ['rgba(199, 199, 200, 0.1)'],
                            width: 1,
                            type: 'dashed'
                            }
                        }
                    }
                ],
                series: [
                    {
                        // name: 'Direct',
                        type: 'bar',
                        barWidth: '20%',
                        data: this.nodeDataY,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true, // 是否显示
                                    position: 'top', // 显示位置
                                    color: '#FFFFFF',
                                    formatter: function (params) {
                                        // 核心部分 formatter 可以为字符串也可以是回调
                                        if (parseInt(params.value) === 0) {
                                            return '';
                                        } else {
                                            return params.data.label;
                                        }
                                    }
                                },
                                // 每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                color:  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#3280D7' },
                                    { offset: 1, color: '#4122E2' }
                                ])
                            }
                        }
                    }
                ]
            };
            option && this.nodeChart.setOption(option);
        }
    }
}
</script>

<style lang="less" scoped>
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