<template>
    <div class='wrapper'>
        <div class='chart' id='chart'></div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "indexDQ2",
        data () {
            return {
                switchLanguage:"",//用于页面中英文切换
                // countryEnJson:"",//用于储存国家英文字典
                maxValue:0,
                newestInfo:"",
                ws: null,
                // listAdd:[],
                chart:undefined,
                // res :[],
            }
        },
        created() {
            // console.log("进入了钩子函数")
            // this.switchLanguage=window.g.switchLanguage
            if (sessionStorage.getItem('switchLanguage') !== null) {
                // console.log("报告页面switchLanguage赋值来自于sessionStorage 值为："+sessionStorage.getItem('switchLanguage'))
                this.switchLanguage = sessionStorage.getItem('switchLanguage');
            } else {
                // console.log("报告页面switchLanguage赋值来自于window.g 值为："+window.g.switchLanguage)
                this.switchLanguage = window.g.switchLanguage;
            }
            // var json=require('/src/api/world');
            // this.countryEnJson=json.country_en
            // this.ws = new WebSocket('ws://' + window.g.baseURL + '/websocket/' + 'adminEAR');
            // this.wsInit();
            setInterval(() => {
                this.getWorld()
            }, 120000);
            this.getWorld()
        },
        mounted () {
            // 模拟初始数据获取
            // 模拟数据更新
            setInterval(() => {
                this.getData();
            }, 3000);
        },
        methods: {
            // wsInit() {
            //     this.ws.onopen = () => {
            //             this.ws.send(JSON.stringify("地图服务已连接"))
            //             console.log(this.ws.readyState)
            //     }
            //     this.ws.onclose = () => {
            //         console.log("地图服务器关闭")
            //         console.log(this.ws.readyState)
            //     }
            //     this.ws.onmessage = (message) => {
            //         console.log("地图收到服务器消息")
            //         console.log(message)
            //         console.log(this.ws.readyState)
            //         var json = require('/src/api/world.json');
            //         let namemap = json.namemap;
            //         let dataArr=[];
            //         if(JSON.parse(message.data).code=='earth'){
            //             console.log("^^^^^^^^^^^^^^^^^地球进来了")
            //             // namemap:国家中英对应  dataArr: name value title
            //             // this.drawChart(namemap, dataArr);
            //             this.maxValue=JSON.parse(message.data).dataObject.maxValue
            //             dataArr = JSON.parse(message.data).dataObject.earthAddTitle
            //             this.drawChart(namemap, dataArr);
            //             this.showTitleView(JSON.parse(message.data).dataObject.newestInfo,JSON.parse(message.data).dataObject.newestCountry);
            //
            //         }else {
            //             console.log("连接状态")
            //             console.log(message)
            //         }
            //     }
            //     this.ws.onerror = (error) => {
            //         console.log("报错了")
            //         console.log(error)
            //         console.log(this.ws.readyState)
            //     }
            //
            // },
            getData() {
                if(this.switchLanguage !=sessionStorage.getItem('switchLanguage')&& sessionStorage.getItem('switchLanguage') !==null ){
                    // console.log("语言有切换 报告开始切换")
                    this.switchLanguage=sessionStorage.getItem('switchLanguage')
                    // console.log("报告语言切换完成")

                }
            },
            showTitleView(newestInfo,newestCountry){
                // console.log(newestInfo)
                // let new_cname = dataArr[0]['name']+dataArr[0]['value']
                let new_cname = newestInfo
                // console.log("判断最后一条数据是否有变化")
                // console.log("this.Cname:"+this.newestInfo)
                // console.log("new_cname:"+new_cname)
                if (this.newestInfo !== new_cname){
                    this.newestInfo = new_cname;
                    // this.showTooltip(-1);
                    this.showTooltip(newestCountry);
                    // this.showWireframe(-1)
                    this.showWireframe(newestCountry)
                    setTimeout(this.hideTooltip,10000);
                }


            },
            showWireframe(newestCountry) {
                // // 取消高亮指定的数据图形
                // this.chart.dispatchAction({
                //     type: 'downplay',
                //     seriesIndex: 0,
                //     dataIndex: index
                // })
                // 高亮指定的数据图形
                this.chart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    name: newestCountry
                    // dataIndex: index + 1
                })
            },
            hideTooltip(){
                this.chart.dispatchAction({
                    type: 'hideTip',
                    seriesIndex: 0,
                    dataIndex: -1
                })
            },
            // showTooltip(index) {
            showTooltip(newestCountry) {
                // // 隐藏提示框
                // this.chart.dispatchAction({
                //     type: 'hideTip',
                //     seriesIndex: 0,
                //     dataIndex: index
                // })
                // 显示提示框
                this.chart.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    name:newestCountry
                    // dataIndex: index + 1
                })
            },
            getWorld () {
                let data = {}
                this.$axios.post(this.$http.api.earth,data).then(res=> {
                    if(res.code=='earth'){
                        var json = require('/src/api/world.json');
                        let namemap = json.namemap;
                        let dataArr=[];
                        // console.log("^^^^^^^^^^^^^^^^^地球进来了")
                        this.maxValue=JSON.parse(res.dataObject).dataObject.maxValue
                        dataArr = JSON.parse(res.dataObject).dataObject.earthAddTitle
                        this.drawChart(namemap, dataArr);
                        this.showTitleView(JSON.parse(res.dataObject).dataObject.newestInfo,JSON.parse(res.dataObject).dataObject.newestCountry);
                    }
                })

            },
            drawChart (namemap, dataArr) {
                let maxValue=this.maxValue
                // 基于准备好的dom，初始化echarts实例
                let chart = this.$echarts.init(document.getElementById('chart'))
                // 监听屏幕变化自动缩放图表
                window.addEventListener('resize', function () {
                    chart.resize()
                })

                ///////////////////////////
                //用于存储地图数据
                var json = require('/src/api/world.json');
                var pointMap =json.trapeze;
                var geoCoordMap = pointMap;
                var countryEnJson=json.country_en;
                var zh_en=this.switchLanguage;

                var max = 480,
                    min = 9; // todo
                var maxSize4Pin = 50,
                    minSize4Pin = 20;

                var convertData = function (dataD) {
                    var res = [];
                    if(dataD){
                        for (var i = 0; i < dataD.length; i++) {
                            var geoCoord = geoCoordMap[dataD[i].name];
                            if (geoCoord) {
                                res.push({
                                    name: dataD[i].name,
                                    name_en: countryEnJson[dataD[i].name],
                                    zh_en:zh_en,
                                    value: geoCoord.concat(dataD[i].value),
                                    // value: geoCoord,
                                    // size:dataD[i].value,
                                    title: dataD[i].title,
                                });
                            }
                        }
                    }
                    return res;
                };
                // var convertDataA = function (dataD) {
                //     var res = [];
                //     if(dataD){
                //         for (var i = 0; i < dataD.length; i++) {
                //             var geoCoord = geoCoordMap[dataD[i].name];
                //             if (geoCoord) {
                //                 res.push({
                //                     name: dataD[i].name,
                //                     value: geoCoord.concat(dataD[i].value),
                //                     // value: geoCoord,
                //                     title: dataD[i].title,
                //                     num:dataD[i].value,
                //                 });
                //             }
                //         }
                //     }
                //     return res;
                // };
                // 绘制图表
                chart.setOption({

                    // 图表主标题
                    // title: {
                    //     // text: '数据泄露分布地图', // 主标题文本，支持使用 \n 换行
                    //     top: 20, // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
                    //     left: 'center', // 值: 'left', 'center', 'right' 同上
                    //     textStyle: { // 文本样式
                    //         fontSize: 24,
                    //         fontWeight: 600,
                    //         color: '#fff'
                    //     }
                    // },
                    // 提示框组件
                    tooltip: {
                        trigger: 'item', // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
                        // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
                        // 使用函数模板  传入的数据值 -> value: number | Array
                        formatter: function (val) {
                            var text = '';
                            if(zh_en==='en'){
                                text += '<div style="display:flex;flex-direction:row;">'+
                                    '<div style="background-color:#03D16D;height:auto;width:10px;margin-right:5px;"></div>'+
                                    '<div style="display:flex;flex-direction:column;">'+
                                    '<span>'+val.data.name_en+'</span>'+
                                    '<span >'+'Latest leak headline:'+'</span>'+
                                    '<span  display:width="60px">'+ val.data.title+'</span>'+
                                    '</div>'+
                                    '</div>'

                            }else {
                                text += '<div style="display:flex;flex-direction:row;">'+
                                    '<div style="background-color:#03D16D;height:auto;width:10px;margin-right:5px;"></div>'+
                                    '<div style="display:flex;flex-direction:column;">'+
                                    '<span>'+ val.data.name+'</span>'+
                                    '<span >'+'最新泄露标题:'+'</span>'+
                                    '<span  display:width="60px">'+ val.data.title+'</span>'+
                                    '</div>'+
                                    '</div>'
                            }
                            return text;
                        }
                    },
                    // visualMap: {
                    //     type: 'continuous',
                    //     min: 0,
                    //     max: 100,
                    //     range: [1, 10],
                    //     center: [104.114129, 37.550339],
                    // },
                    // visualMap: {
                    //     show: false,
                    //     min: 0,
                    //     max: 600,
                    //     left: 'left',
                    //     top: 'bottom',
                    //     text: ['高', '低'], // 文本，默认为数值文本
                    //     calculable: true,
                    //     seriesIndex: [1],
                    //     //控制地图颜色的显示区间
                    //     inRange: {
                    //         // color: ['#3B5077', '#031525'] // 蓝黑
                    //         // color: ['#ffc0cb', '#800080'] // 红紫
                    //         // color: ['#3C3B3F', '#605C3C'] // 黑绿
                    //         //  color: ['#0f0c29', '#302b63', '#24243e'] // 黑紫黑
                    //         // color: ['#23074d', '#cc5333'] // 紫红
                    //         // color: ['#00467F', '#A5CC82'] // 蓝绿
                    //         // color: ['#1488CC', '#2B32B2'] // 浅蓝
                    //         // color: ['#00467F', '#A5CC82', '#ffc0cb'] // 蓝绿红
                    //         // color: ['#00467F', '#A5CC82'] // 蓝绿
                    //         // color: ['#00467F', '#A5CC82'] // 蓝绿
                    //         // color: ['#00467F', '#A5CC82'] // 蓝绿
                    //         color: ['#22e5e8', '#0035f9', '#22e5e8'] // 蓝绿
                    //
                    //     }
                    // },
                    geo: {
                        //地图的初始配置
                        // show: true,
                        map: 'world',
                        projection:'geoMercator', //使用墨卡托投影
                        // mapProjection: {
                        //     // 使用等经纬度投影
                        //     type: 'equidistantly'
                        // },
                        // zoom:1,
                        // label: {
                        //     normal: {
                        //         show: false
                        //     },
                        //     emphasis: {
                        //         show: false
                        //     }
                        // },
                        roam:false,
                        // center:undefined,
///////////////////////////////////////////////////////1/2
                        // 图形上的文本标签
                        label: {
                            show: false// 是否显示对应地名
                        },
                        // 地图区域的多边形 图形样式
                        itemStyle: {
                            // areaColor: '#3ca3e6', // 地图区域的颜色 如果设置了visualMap，areaColor属性将不起作用
                            areaColor: '#0d1b4a', // 地图区域的颜色 如果设置了visualMap，areaColor属性将不起作用
                            borderWidth: 0.5, // 描边线宽 为 0 时无描边
                            borderColor: '#00F1FF', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
                            borderType: 'solid' // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
                        },
                        // 高亮状态下的多边形和标签样式
                        emphasis: {
                            label: {
                                show: false, // 是否显示标签
                                color: '#fff' // 文字的颜色 如果设置为 'auto'，则为视觉映射得到的颜色，如系列色
                            },
                            itemStyle: {
                                areaColor: '#3742ff' // 地图区域的颜色
                            }
                        },
                        ////////////////////////////////////////////////1/2
                        // 自定义地区的名称映射
                        nameMap: namemap,



                    },
                    series: [
                        {
                            // type: 'map', // 类型
                            type: 'scatter', // 使用墨卡托投影
                            coordinateSystem:'geo',  //使用地理坐标系
                            // 系列名称，用于tooltip的显示，legend 的图例筛选 在 setOption 更新数据和配置项时用于指定对应的系列
                            name: '数据泄露分布地图',
                            // mapType: 'world', // 地图类型
                            // // 是否开启鼠标缩放和平移漫游 默认不开启 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move' 设置成 true 为都开启
                            // roam: false,

                            ///////////////////////////////////////////////////////1/2
                            // 图形上的文本标签
                            // label: {
                            //     show: false// 是否显示对应地名
                            // },
                            // // 地图区域的多边形 图形样式
                            // itemStyle: {
                            //     // areaColor: '#3ca3e6', // 地图区域的颜色 如果设置了visualMap，areaColor属性将不起作用
                            //     areaColor: '#0d1b4a', // 地图区域的颜色 如果设置了visualMap，areaColor属性将不起作用
                            //     borderWidth: 0.5, // 描边线宽 为 0 时无描边
                            //     borderColor: '#00F1FF', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
                            //     borderType: 'solid' // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
                            // },
                            // // 高亮状态下的多边形和标签样式
                            // emphasis: {
                            //     label: {
                            //         show: false, // 是否显示标签
                            //         color: '#fff' // 文字的颜色 如果设置为 'auto'，则为视觉映射得到的颜色，如系列色
                            //     },
                            //     itemStyle: {
                            //         areaColor: '#3742ff' // 地图区域的颜色
                            //     }
                            // },
                            ////////////////////////////////////////////////1/2
                            geoIndex:0,
                            // // 自定义地区的名称映射
                            // nameMap: namemap,
                            // 地图系列中的数据内容数组 数组项可以为单个数值
                            // data: dataArr,
                            data: convertData(dataArr),
                        },
                        // {
                        //     type: 'map',
                        //     map: 'world',
                        //     geoIndex: 0,
                        //     aspectScale: 0.75, //长宽比
                        //     showLegendSymbol: false, // 存在legend时显示
                        //     label: {
                        //         show: false,
                        //         // normal: {
                        //         //     show: true
                        //         // },
                        //         // emphasis: {
                        //         //     show: false,
                        //         //     textStyle: {
                        //         //         color: '#fff'
                        //         //     }
                        //         // }
                        //     },
                        //     // roam: true,
                        //     // itemStyle: {
                        //     //     normal: {
                        //     //         areaColor: '#031525',
                        //     //         borderColor: '#3B5077',
                        //     //     },
                        //     //     emphasis: {
                        //     //         areaColor: '#2B91B7'
                        //     //     }
                        //     // },
                        //     // 地图区域的多边形 图形样式
                        //     itemStyle: {
                        //         // areaColor: '#3ca3e6', // 地图区域的颜色 如果设置了visualMap，areaColor属性将不起作用
                        //         areaColor: '#0d1b4a', // 地图区域的颜色 如果设置了visualMap，areaColor属性将不起作用
                        //         borderWidth: 0.5, // 描边线宽 为 0 时无描边
                        //         borderColor: '#00F1FF', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
                        //         borderType: 'solid' // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
                        //     },
                        //     // animation: true,
                        //     namemap:namemap,
                        //     data: dataArr
                        //     // data:  convertData(data)
                        // },
                        {
                            name: '点',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            symbol: 'pin', //气泡
                            symbolSize: function (size,val) {
                                var a = (maxSize4Pin - minSize4Pin) / (max - min);
                                var b = minSize4Pin - a * min;
                                // b = maxSize4Pin - a * max;
                                return a * val[2]*100 + b;
                            },
                            label: {
                                normal: {
                                    show: false,
                                    formatter: function (params) {
                                        return params.value[2]
                                    },
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: 9,
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: 'rgba(255,255,0,0)', //标志颜色
                                }
                            },
                            zlevel: 1,
                            data: convertData(dataArr),
                        },
                        {
                            name: 'Top 500',//用于显示最高的前五个数据
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            // data: convertData(data.sort(function (a, b) {
                            //     return a.value - b.value;
                            // }).slice(0, 500)),  namemap, dataArr
                            symbolSize: function (val) {
                                // return val[2] / 2.3;
                                return val[2] / (maxValue*0.03);
                            },
                            showEffectOn: 'render',
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            hoverAnimation: true,
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: 'rgba(255,9,14,0.8)',
                                    shadowBlur: 10,
                                    shadowColor: '#05C3F9'
                                }
                            },
                            zlevel: 1,
                            data: convertData(dataArr),
                        },


                    ]
                })
                // 定时显示提示框和高亮效果
                this.chart = chart;
                // let index = -1
                // let indexK = -1
                // setInterval(function () {
                //     // 隐藏提示框
                //     chart.dispatchAction({
                //         type: 'hideTip',
                //         seriesIndex: 0,
                //         dataIndex: indexK
                //     })
                //     // 显示提示框
                //     chart.dispatchAction({
                //         type: 'showTip',
                //         seriesIndex: 0,
                //         dataIndex: indexK + 1
                //     })
                //     index=index+10000
                //     // if (index > data.length - 1) {
                //     //     index = -1
                //     // }
                // },3000)
                // setInterval(function () {
                //     // 隐藏提示框
                //     chart.dispatchAction({
                //         type: 'hideTip',
                //         seriesIndex: 0,
                //         dataIndex: index
                //     })
                //     // 显示提示框
                //     chart.dispatchAction({
                //         type: 'showTip',
                //         seriesIndex: 0,
                //         dataIndex: index + 1
                //     })
                //     // 取消高亮指定的数据图形
                //     chart.dispatchAction({
                //         type: 'downplay',
                //         seriesIndex: 0,
                //         dataIndex: index
                //     })
                //     // 高亮指定的数据图形
                //     chart.dispatchAction({
                //         type: 'highlight',
                //         seriesIndex: 0,
                //         dataIndex: index + 1
                //     })
                //     // index++
                //     // if (index > data.length - 1) {
                //     //     index = -1
                //     // }
                // }, 1000)
            }
        }
    }
</script>

<style scoped>
    .wrapper {
        /*margin-top: -80px;*/
        /*width: 100%;*/
        /*margin-left: -120px;*/
        margin-top: -7%;
        /*width: 100%;*/
        /*height: 100%;*/
        /*width: calc(100vw);*/
        /*height: calc(100vh);*/
        width: calc(100%);
        height: calc(100%);
        margin-left: -12%;
    }
    .wrapper .chart {
        /*width: 120%;*/
        /*height: 780px;*/
        /*margin: 1px 2px 0;*/
        /*!*border: 1px solid #0d1b4d;*!*/
        /*!*background: url(../../../public/bg.jpg) no-repeat; #0d1b4d   *!*/
        /*background-size: 100% 100%;*/

        width: 120%;
        height: 130%;
        margin: 0.2% 0.2% 0;
        /*border: 1px solid #0d1b4d;*/
        /*background: url(../../../public/bg.jpg) no-repeat; #0d1b4d   */
        background-size: 100% 100%;
    }
</style>
