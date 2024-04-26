<template>
    <div class="source-card">
<!--        <div class="source-chart" id="resource" v-loading="loading"></div>-->
        <ZhuZhuangTu3  :active="0" ref="zhudouble"  :bing="zhudouble"></ZhuZhuangTu3>
<!--        <div class="tabs-container">-->
<!--            <el-tabs v-model="activeName" @tab-click="tabClick">-->
<!--                <el-tab-pane label="CPU" name="CPU"></el-tab-pane>-->
<!--                <el-tab-pane label="MEMEORY" name="MEMEORY"></el-tab-pane>-->
<!--            </el-tabs>-->


<!--        </div>-->
    </div>
</template>

<script>
import * as echarts from 'echarts';
import ZhuZhuangTu3 from '../echarts/zhuzhuangtu3'

import { getTargetsResponse } from './sourceMock.js'
export default {
    props: {
        left1data: {
            type: Object,
            // required: true,
            default: function() {
                return {
                    target:'',
                    type: '',
                }
            }
        }
    },
    watch: {
        left1data: {
            handler(newVal, oldVal) {
                console.log('left1data changed:', newVal);
                this.querydelay()
            },
            deep: true
        }
    },
    name: 'SourceView',
    components: {
        ZhuZhuangTu3,
    },
    data() {
        return {
            loading: false,
            sourceData: {},
            sourceDataX: [],
            sourceDataY: [],
            cpuList: [],
            memoryList: [],
            activeName: 'CPU',
            sourceChart: null,
            rangeDict: [],
            zhudouble:{
                xdata:[],
                ydata1:[],  //ipv6
            },
        }
    },
    created() {
    },
    mounted(){
        // this.init()
        this.querydelay()
        // this.getRangeDict()
    },
    methods: {
        querydelay(){
            const reqParams = {
                "target": this.left1data.target,
                "type": this.left1data.type,
            }
            this.loading = true
            this.$axios.get(this.$http.api.targetDelay, reqParams).then(res => {
                if (res.code == 200) {
                    for (let i = 0; i <res.delay_data.length>10?10:res.delay_data.length ; i++) {
                        this.zhudouble.xdata.push(res.delay_data[i].Id);
                        this.zhudouble.ydata1.push(res.delay_data[i].CurrDelay);
                    }
                }
                this.$refs.zhudouble.bingfn(this.zhudouble)

            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.loading = false
            })

        },
        // init() {
        //
        //     this.loading = true
        //     this.$axios.get(this.$http.api.sysNumDate).then(res => {
        //         if (res.code == 200) {
        //             this.zhudouble.ydata1=[];
        //             this.zhudouble.ydata2=[];
        //             this.zhudouble.ydata3=[];
        //             this.zhudouble.ydata4=[];
        //             this.zhudouble.ydata5=[];
        //             this.zhudouble.xdata=[];
        //
        //
        //             Object.keys(res.date_data).forEach(date => {
        //                 console.log(`Date: ${date}, dot value: ${res.date_data[date].dot}`);
        //                 this.zhudouble.xdata.push(date)
        //                 this.zhudouble.ydata1.push(res.date_data[date].v6dns)
        //                 this.zhudouble.ydata2.push(res.date_data[date].dnssec)
        //                 this.zhudouble.ydata3.push(res.date_data[date].dot)
        //                 this.zhudouble.ydata4.push(res.date_data[date].doh)
        //                 this.zhudouble.ydata5.push(res.date_data[date].v6dns+res.date_data[date].dnssec+res.date_data[date].dot+res.date_data[date].doh)
        //             });
        //             this.$refs.zhudouble.bingfn(this.zhudouble)
        //         }
        //     }).catch(err => {
        //         console.log(err)
        //     }).finally(() => {
        //         this.loading = false
        //         // this.initEcharts()
        //     })
        // },
        initEcharts() {
            let that = this
            var chartDom = document.getElementById('resource');
            this.sourceChart = echarts.init(chartDom);
            var option;

            option = {
                title: {
                    text: '靶场资源使用排序',
                    left: '10',
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
                        data: this.sourceDataX,
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
                        axisLabel: {
                            fontSize: '12',
                            color: 'rgba(255, 255, 255, 0.7)',
                            formatter: function(value) {
                                return value + '  (mcore)'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                            color: ['rgba(199, 199, 200, 0.1)'],
                            width: 1,
                            type: 'dashed'
                            },
                        }
                    }
                ],
                series: [
                    {
                        // name: 'Direct',
                        type: 'bar',
                        barWidth: '20%',
                        data: this.sourceDataY,
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
                                    { offset: 0, color: '#01FFFF' },
                                    { offset: 1, color: '#2160B8' }
                                ])
                            }
                        }
                    }
                ]
            };
            option && this.sourceChart.setOption(option);
            //点击事件
            this.sourceChart.on('click', function(params) {
                const target_name = params.name
                const target_id = that.rangeDict.find(item => item.label === target_name)?.value
                that.$store.commit('globalAttrs/setCheckMenu', 'rangeConfigManage')
                that.$store.commit('range/setTargetId', target_id)
            });
        },
        // 刷新图标数据
        refreshData(data, tabName){
            if(!this.sourceChart){
                return
            }
            //更新数据
            var option = this.sourceChart.getOption()
            option.series[0].data = data
            option.yAxis[0].axisLabel.formatter = function(value) {
                if (tabName === 'MEMEORY') {
                    return value + '  (Mi)'
                } else {
                    return value + '  (mcore)'
                }
            }
            this.sourceChart.setOption(option) 
        },
        tabClick(tab, event) {
            switch (tab.name) {
                case 'CPU':
                    this.refreshData(this.cpuList, 'CPU')
                    break;
                case 'MEMEORY':
                    this.refreshData(this.memoryList, 'MEMEORY')
                    break;           
                default:
                this.refreshData(this.cpuList, 'CPU')
                    break;
            }
        },
        // // 获取靶场列表字典
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
        //     })
        // }
    }
}
</script>

<style lang="less" scoped>
.source-card {
    position: relative;
    width: 100%;
    height: 100%;
    .source-chart {
        width: 100%;
        height: 100%;
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