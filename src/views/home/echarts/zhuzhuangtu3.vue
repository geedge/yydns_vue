<template>
    <div style="width: 100%;height: 100%;">
        <div style="width: 100%;height: 10%"><span style="margin-top: 1%;font-size: 20px;margin-left: 2%;float: left">探测的目标趋势</span></div>
        <div ref="bingbox" style="width: 100%;height: 90%"></div>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    var myChart1=null
    export default {
        props:{
            bing:{
                type:Object,
                default: function() {
                    return {
                        datas:[],
                        signdata: [],
                        title:"",
                        bingtype:'',
                        AreaName:[],
                    }
                }
            },
            active:{
                type:Number,
                default: function() {
                    return {
                        active:""
                    }
                }
            }
        },
        watch: {
            bing: {
                deep: true,
                handler(val) {
                    console.log(val)
                    this.bingfn(val)
                }
            },
        },
        data(){
            return {

            }
        },
        methods:{
            bingfn(data){
                console.log(data)
                let that = this
                //当前视口宽度
                let nowClientWidth = document.documentElement.clientWidth;
                // 换算方法
                let nowSize = function (val, initWidth = 1920) {
                    return val * (nowClientWidth / initWidth);
                };
                if (myChart1 != null) {
                    myChart1.clear()//销毁
                }
                myChart1= echarts.init(this.$refs.bingbox)
                myChart1.clear()
                myChart1.off('mouseover')

                var	option = {
                    animation:false,   //动态展示
                    grid: {
                        left: '5%',
                        right: '5%',
                        bottom: '5%',
                        containLabel: true
                    },
                    // title: {
                    //     text:"898989"
                    // },

                    xAxis: {
                        type: 'category',
                        data: data.xdata,
                        // data: ["2024-1-1","2024-1-2","2024-1-3","2024-1-4","2024-1-5","2024-1-6","2024-1-7"],
                        axisLine:{
                            lineStyle:{
                                color:'#f6fbfd'
                            }
                        },
                        axisLabel:{
                            interval:0,
                            show: true
                        }

                    },
                    // tooltip: {
                    //     trigger: 'axis',
                    //     // 添加样式
                    //     textStyle: {
                    //         textAlign: 'left'     // 内容左对齐
                    //     }
                    // },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        // 使用 formatter 函数设置内容和样式
                        formatter: function(params) {
                            var result = '<div style="text-align:left;">'; // 左对齐样式
                            result += params[0].name + '<br>'; // 添加横坐标名称

                            params.forEach(function(item) {
                                result += item.marker + ' ' + item.seriesName + ': ' + item.value + '<br>'; // 添加数据项
                            });

                            result += '</div>';
                            return result;
                        }
                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: '分类统计(个)', // 水量单位
                            position: 'left', // 显示在左侧
                            splitLine: {
                                show: false,
                                lineStyle: {
                                    color: "rgb(255,16,18)",
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#f4f2fd'
                                }
                            }
                        },
                        {
                            type: 'value',
                            name: '总量统计(个)', // 数量单位
                            position: 'right', // 显示在右侧
                            splitLine: {
                                show: false,
                                lineStyle: {
                                    color: "rgb(255,16,18)",
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#f4be6a'
                                }
                            }
                        }
                    ],
                    // yAxis: {
                    //     type: 'value',
                    //     splitLine: {//分割线配置
                    //         show:false,
                    //         lineStyle: {
                    //             color: "rgb(255,16,18)",
                    //         }
                    //     },
                    //     axisLine:{
                    //         lineStyle:{
                    //             color:'#fdc909'
                    //         }
                    //     }
                    // },
                    // yAxis:[
                    //     {
                    //         type:'value',
                    //         name:'分类数量',
                    //         interval: 5,
                    //         axisLabel: {
                    //             formatter:'{value}个'
                    //         }
                    //     },
                    //     {
                    //         type:'value',
                    //         name:'总量',
                    //         interval: 5,
                    //         axisLabel: {
                    //             formatter:'{value}个'
                    //         }
                    //     },
                    //
                    // ],
                    series: [
                        {
                            name:'IPv6',
                            barWidth: 20,  //柱子宽度
                            data:data.ydata1,
                            // data:[45,89,56,58,66,12,96],
                            color:["#2386bf"],    //自定义颜色
                            type: 'bar',
                            label:{
                                show:true,
                                position:'top',
                                formatter:function (params) {
                                    return params.value;
                                }
                            }

                        },
                        {
                            name:'DNS',
                            barWidth: 20,  //柱子宽度
                            data:data.ydata2,
                            // data:[450,890,560,580,660,155,85],
                            color:["#434ff4"],    //自定义颜色
                            type: 'bar',
                            label:{
                                show:true,
                                position:'top',
                                formatter:function (params) {
                                    return params.value;
                                }
                            }

                        },
                        {
                            name:'DoT',
                            barWidth: 20,  //柱子宽度
                            data:data.ydata3,
                            // data:[150,290,560,380,660,105,815],
                            color:["rgba(58,76,222,0.89)"],    //自定义颜色
                            type: 'bar',
                            label:{
                                show:true,
                                position:'top',
                                formatter:function (params) {
                                    return params.value;
                                }
                            }

                        },
                        {
                            name:'DoH',
                            barWidth: 20,  //柱子宽度
                            data:data.ydata4,
                            // data:[650,790,560,180,660,15,85],
                            color:["#117cf4"],    //自定义颜色
                            type: 'bar',
                            label:{
                                show:true,
                                position:'top',
                                formatter:function (params) {
                                    return params.value;
                                }
                            }

                        }
                        ,
                        {
                            name:'总量',
                            barWidth: 20,  //柱子宽度
                            data:data.ydata5,
                            // data:[1120,7090,5660,1800,6060,105,805],
                            color:["#f4be6a"],    //自定义颜色
                            type: 'line',
                            yAxisIndex: 1,
                            label:{
                                show:true,
                                position:'top',
                                formatter:function (params) {
                                    return params.value;
                                }
                            }

                        }
                    ],
                    graphic: [
                        {
                            type:'group',
                            left:'center',
                            top:25,
                            children:[
                                {
                                    type: 'rect',
                                    shape: {
                                        width: 20,
                                        height: 20
                                    },
                                    style: {
                                        fill: '#2386bf' // 设置第一个色块的颜色
                                    },
                                    z: 100
                                },
                                {
                                    type: 'text',
                                    left: 25,
                                    style: {
                                        text: 'IPv6', // 设置第一个色块的含义
                                        fill: '#2386bf',
                                        fontSize: 12
                                    },
                                    z: 100
                                },
                                ////////////////
                                {
                                    type: 'rect',
                                    left: 75,
                                    shape: {
                                        width: 20,
                                        height: 20
                                    },
                                    style: {
                                        fill: '#434ff4' // 设置第二个色块的颜色
                                    },
                                    z: 100
                                },
                                {
                                    type: 'text',
                                    left: 100,
                                    style: {
                                        text: 'DNS', // 设置第二个色块的含义
                                        fill: '#434ff4',
                                        fontSize: 12
                                    },
                                    z: 100
                                },
                                ///////////////
                                {
                                    type: 'rect',
                                    left:150 ,
                                    shape: {
                                        width: 20,
                                        height: 20
                                    },
                                    style: {
                                        fill: 'rgba(58,76,222,0.89)' // 设置第二个色块的颜色
                                    },
                                    z: 100
                                },
                                {
                                    type: 'text',
                                    left: 175,
                                    style: {
                                        text: 'DoT', // 设置第二个色块的含义
                                        fill: 'rgba(58,76,222,0.89)',
                                        fontSize: 12
                                    },
                                    z: 100
                                },
                                /////////////////////////////////
                                {
                                    type: 'rect',
                                    left: 225,
                                    shape: {
                                        width: 20,
                                        height: 20
                                    },
                                    style: {
                                        fill: '#117cf4' // 设置第二个色块的颜色
                                    },
                                    z: 100
                                },
                                {
                                    type: 'text',
                                    left: 250,
                                    style: {
                                        text: 'DoH', // 设置第二个色块的含义
                                        fill: '#117cf4',
                                        fontSize: 12
                                    },
                                    z: 100
                                },
                                // //////////////////////////////
                                // {
                                //     type: 'rect',
                                //     left: 300,
                                //     shape: {
                                //         width: 20,
                                //         height: 20
                                //     },
                                //     style: {
                                //         fill: '#f4be6a' // 设置第二个色块的颜色
                                //     },
                                //     z: 100
                                // },
                                // {
                                //     type: 'text',
                                //     left: 325,
                                //     style: {
                                //         text: '五线', // 设置第二个色块的含义
                                //         fill: '#f4be6a',
                                //         fontSize: 12
                                //     },
                                //     z: 100
                                // }
                            ]
                        }

                    ]
                };







                myChart1.setOption(option,true)
                window.addEventListener("resize", () => {
                    myChart1.resize();
                });
            }
        },
        beforeDestroy() {
            myChart1.clear()
        },
        destroyed() {
            myChart1.clear()
        },
        mounted(){
            // this.bingfn(this.bing)
        },
    }
</script>

<style scoped="scoped">
</style>
