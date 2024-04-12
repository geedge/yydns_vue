<template>
    <div class="ebox">
        <!-- <p class="des">数据新增热力图</p> -->
        <div class="box1" ref="echarts"></div>
    </div>
</template>
<script>
import * as echarts from 'echarts';
var heatChart=''
export default {
    props:["heatlist"],
    data () {
        return {
        
        }
    },
    watch: {
        heatlist: {
            // deep: true,
            handler(val) {
                this.drawChart(val)
            }
        },
    },
    created() {
        
    },
    methods: {
        drawChart(list){
            let that=this
            if (heatChart != null && heatChart != "" && heatChart != undefined) {
				heatChart.dispose();//销毁
			}
            //当前视口宽度
			let nowClientWidth = document.documentElement.clientWidth;
            // 换算方法
            let nowSize = function (val, initWidth = 1920) {
                return val * (nowClientWidth / initWidth);
            };
            heatChart = echarts.init(this.$refs.echarts);

            let option = {
                // title: {
                //     top: '20%',
                //     left: '0',
                //     text: '数据新增热力图',
                //     textStyle:{
                //         color:"#000",
                //         fontSize:nowSize(18)
                //     }
                // },
                tooltip: {
                    position: 'top',
                    formatter: function (p) {
                        var format = echarts.format.formatTime('yyyy-MM-dd', p.data[0]);
                        // return format + ': ' + p.data[1];
                        return format + ': 存活';
                    }
                },
                visualMap: {
                    min: 0,
                    max: 1,
                    // type: 'piecewise',
                    orient: 'horizontal',
                    // splitNumber:5,
                    right: '5%',
                    top: "20",
                    // color:['#BF444C','#CC6360','#D88273','#E7B98D','#F6EFA6'],
                    // color:['rgba(0, 60, 100, 1)','rgba(0, 60, 100, .8)','rgba(0, 60, 100, .6)','rgba(0, 60, 100, .4)','rgba(0, 60, 100, .3)'],
                    color:['rgba(0, 60, 100, 1)'],
                    textStyle:{
                        color:"#000"
                    },
                },
                calendar: {
                    top: '45%',
                    left: 30,
                    right: 30,
                    cellSize: ['auto', 16],
                    // range: [list[0][0], list[list.length-1][0]],
                    range: '2022',
                    // itemStyle: {
                    //     borderWidth: 0.5
                    // },
                    dayLabel: {nameMap: 'ZH',color:"#000",firstDay: 1},
                    monthLabel:{
                        nameMap:'ZH'
                    },
                    itemStyle:{
                        // color:"#394059",
                        // borderColor:"#394059",
                        borderType:'solid',
                        borderCap:"butt",
                        borderWidth:.5,
                    },
                },
                series: {
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    data: list
                }
            };
            // console.log(list)
            heatChart.setOption(option)
            // this.$nextTick(() => {//自适应宽度
            //    heatChart.resize();
            // })
            // window.addEventListener("resize", () => {
			// 	heatChart.resize();
			// });
        },
    },
    mounted(){
        this.$nextTick(() => {
          this.drawChart(this.heatlist);
        })
    },
    components: {
        
    }
}
</script>
<style lang='less' scoped>
   .ebox{width: 100%;height: 100%;position: relative;}
    .box1{width: 100%;height: 100%;background-color:#fff;}
</style>