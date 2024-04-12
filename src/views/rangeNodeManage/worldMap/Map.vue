<template>
<div class='wrapper' v-loading="loading">
    <div class='chart' id='chart' style="width: 100%; height: 100%;"></div>
</div>
</template>

<script>
import { getTargetsResponse } from './mock.js'
export default {
    data () {
        return {
            loading: false,
            worldChart: {},
            target_id: '',
            NodeList: [],
            namemap: {},
            geoCoordMap: {}
        }
    },
    props:{
    },
    watch: {
      '$store.state.range.targetId': {
          handler(newVal, oldVal) {
              this.target_id = newVal
              this.init()
          },
          immediate: true
      } 
    },
    created() {
    },
    mounted () {
    },
    methods: {
        init() {
            this.initData()
        },
        initData() {
            // 获取world.json里面国家数据和坐标数据
            var json = require('/src/api/world.json')
            this.geoCoordMap = json.trapeze
            this.namemap = json.namemap
            // 获取接口节点数据
            // this.NodeList = getTargetsResponse?.result
            
            const reqParams = {}
            if (this.target_id && this.target_id !== '') {
                reqParams.target_id = this.target_id
            }
            this.loading = true
            this.$axios.get(this.$http.api.worldMap, reqParams).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.NodeList = res?.result
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.loading = false
                this.initWorldMap(this.namemap, this.geoCoordMap)
            })       
        },
        initWorldMap(namemap, geoCoordMap) {
            // var that = this
            // 获取echarts的容器
            this.worldChart = this.$echarts.init(document.getElementById("chart"));
            var pointData = this.NodeList
            var series = [];
            [[, pointData]].forEach(function (item, i) {
                series.push({
                    type: "effectScatter",
                    coordinateSystem: "geo",
                    zlevel: 2,
                    rippleEffect: {
                        //涟漪特效
                        period: 4, //动画时间，值越小速度越快
                        brushType: "stroke", //波纹绘制方式 stroke, fill
                        scale: 4
                        //波纹圆环最大限制，值越大波纹越大
                    },
                    label: {
                        normal: {
                            show: true,
                            position: "right", //显示位置
                            offset: [5, 0], //偏移设置
                            formatter: "{b}" //圆环显示文字
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    symbol: "circle",
                    symbolSize: function (val) {
                        return 5; //圆环大小
                    },
                    data: item[1].map(dataItem => {
                        let countryName = ''
                        for (let key in namemap) {
                            if(key.toLowerCase() === dataItem.country.replace('-', ' ').toLowerCase()) {
                                countryName = namemap[key]
                            }
                        }
                        const location = [Number(dataItem.location_info.longitude), Number(dataItem.location_info.latitude), dataItem.id]
                        return {
                            name: dataItem.nick_name,
                            value: location,
                            nodeInfo: dataItem
                        }
                    })
                });
            });

            let option = {
                // backgroundColor: '#000',
                // 图表主标题
                title: {
                    text: '世界地图展示各节点位置', // 主标题文本，支持使用 \n 换行
                    top: 5, // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
                    left: 'left', // 值: 'left', 'center', 'right' 同上
                    textStyle: { // 文本样式
                        fontSize: 14,
                        fontWeight: 400,
                        color: '#ffffff'
                    }
                },
                //悬浮提示
                tooltip: {
                    trigger: "item",
                    // backgroundColor: "#1540a1",
                    borderColor: "#FFFFFF",
                    showDelay: 0,
                    hideDelay: 0,
                // enterable: true,
                    transitionDuration: 0,
                // extraCssText: "z-index:100",formatter
                    formatter: function (params, ticket, callback) {
                        // console.log(params)
                        //根据业务自己拓展要显示的内容
                        var res = "";
                        const { name, value, nodeInfo } = params.data
                        res = "<span style='display:inline-block; text-align:left;'>id:" + value[2]
                            + "<br/>昵称:" + name.toString()
                            + "<br/>国家:" + nodeInfo.location_info.country
                            + "<br/>ip:" + nodeInfo.ip
                            + "<br/>经纬度:" + value[0] + ',' + value[1]
                            + "</span>";
                        return res;
                    }
                },
                visualMap: {
                    //图例值控制
                    show: false,
                    min: 0,
                    max: 1000,
                    text:['max','min'],
                    realtime: false,
                    calculable: true,
                    color: ['orangered']
                    // color: ['#0064d0','#c3e0ff'],
                },
                geo: {
                    map: "world",
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    roam: true, //是否允许缩放
                    layoutCenter: ["50%", "50%"], //地图位置
                    layoutSize: "180%",
                    itemStyle: {
                        normal: {
                            areaColor: '#0064d0', //地图背景色
                            // color: ["#04284e"], //地图背景色
                            borderColor: "#5bc1c9" //省市边界线
                        },
                        emphasis: {
                            color: "rgba(37, 43, 61, .5)" //选中区域的颜色
                            // areaColor: '#3742ff' // 选中区域的颜色
                        }
                    },
                    nameMap: this.namemap
                },
                series: series,
                loading: true   // 开启Loading效果
            };
            this.worldChart.setOption(option);
            //点击事件,根据点击某个节点跳转到节点详情页
            this.worldChart.on("click", params => {
                if (params.value) {
                    this.$store.commit('range/setNodeId', params.value[2])
                    //保存是否正在采集流量
                    this.$store.commit('node/setStartTraffic', params?.data?.nodeInfo?.collecting)
                    //保存是否正在结束采集流量
                    this.$store.commit('node/setEndTraffic', params?.data?.nodeInfo?.analysing)
                    this.$router.push({ name: 'nodeDetail'})
                }
            });
        }
        // drawChart () {
        //     this.initWorldMap(this.namemap, this.geoCoordMap)
        // }
    }
}
</script>
<style lang="less" scoped>
.wrapper {
    width: 100%;
    height: 100%;
}
.wrapper .chart {
    width: 100%;
    margin:0 auto;
    height: 100%;
    background-size: 100% 100%;
}
</style>