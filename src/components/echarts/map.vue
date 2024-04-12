<template>
    <div class="barbox" ref="echarts"></div>

</template>
<script>
import * as echarts from 'echarts';
import 'echarts-gl';
import world from "../../assets/json/world.json";
var mapChart=null
var myEarth=null
export default {
	props: ["chartData"],
    data () {
        return {
            ROOT_PATH:'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples',
            
            // 地球数据显示
            ds :[{
                name: '中国',
                point: [116.46, 39.92, 0],
                itemStyleColor: '#f00',
                labelText: '中国•3000'
            }, {
                name: '印度',
                point: [78.96288, 20.593684, 0],
                itemStyleColor: '#99CC66',
                labelText: '印度•500'
            }, {
                name: '意大利',
                point: [12.56738, 41.87194, 0],
                itemStyleColor: '#9999FF',
                labelText: '意大利•200'
            }, {
                name: '新西兰',
                point: [174.885971, -40.900557, 0],
                itemStyleColor: '#339966',
                labelText: '新西兰•10'
            }, {
                name: '英国',
                point: [-3.435973, 55.378051, 0],
                itemStyleColor: '#993366',
                labelText: '英国•1000'
            }, {
                name: '德国',
                point: [10.451526, 51.165691, 0],
                itemStyleColor: '#996666',
                labelText: '德国•200'
            }, {
                name: '美国',
                point: [-95.712891, 37.09024, 0],
                itemStyleColor: '#66CCFF',
                labelText: '美国•2200'
            }, {
                name: '日本',
                point: [138.252924, 36.204824, 0],
                itemStyleColor: '#666666',
                labelText: '日本•2500'
            }]
        }
    },
	watch:{
		chartData: {
			deep: true,
			handler(val) {
			  	this.getMap2(val)
			}
		  },
	},
    created() {
        
    },
    mounted() {
        // this.getMap()
        this.getMap2()
    },
    methods: {
        getMap(){
           this.$axios.get(this.ROOT_PATH + '/data-gl/asset/data/flights.json').then((res)=>{
                console.log(res.data)
                this.myChart = echarts.init(this.$refs.echarts)
		        this.myChart.clear();
                let data=res.data
                function getAirportCoord(idx) {
                    return [data.airports[idx][3], data.airports[idx][4]];
                }
                var routes = data.routes.map(function (airline) {
                    return [getAirportCoord(airline[1]), getAirportCoord(airline[2])];
                });
                var option={
                    backgroundColor: '#000',
                    globe: {
                        baseTexture: this.ROOT_PATH + '/data-gl/asset/world.topo.bathy.200401.jpg',
                        // heightTexture:this.ROOT_PATH + '/data-gl/asset/bathymetry_bw_composite_4k.jpg',
                        shading: 'color',
                        light: {
                            ambient: {
                            intensity: 0.4
                            },
                            main: {
                            intensity: 0.4
                            }
                        },
                        viewControl: {
                            autoRotate: true
                        }
                    },
                    series: {
                        type: 'lines3D',
                        coordinateSystem: 'globe',
						effect: {
							show: true,
							trailWidth: 1,
							trailOpacity: 0.5,
							trailLength: 0.2,
							constantSpeed: 5
						},
                        blendMode: 'lighter',
                        lineStyle: {
                            width: 1,
                            color: 'rgb(50, 50, 150)',
                            opacity: 0.1
                        },
                        data: routes
                    }
                }
                this.myChart.setOption(option)
                window.addEventListener("resize",() => {this.myChart.resize();});
           })
        },
		getC(){
			var config = {
				color: '#c0101a',
				levels: 1,
				intensity: 4,
				threshold: 0.01
			};
			var canvas = document.createElement('canvas');
			canvas.width = 4096;
			canvas.height = 2048;
			context = canvas.getContext('2d');
			context.lineWidth = 0.5;
			context.strokeStyle = config.color;
			context.fillStyle = config.color;
			context.shadowColor = config.color;
			$.when(
			$.getScript('https://cdn.jsdelivr.net/npm/d3-array@2.8.0/dist/d3-array.js'),
			$.getScript('https://cdn.jsdelivr.net/npm/d3-contour@2.0.0/dist/d3-contour.js'
			),
			$.getScript('https://cdn.jsdelivr.net/npm/d3-geo@2.0.1/dist/d3-geo.js'),
			$.getScript('https://cdn.jsdelivr.net/npm/d3-timer@2.0.0/dist/d3-timer.js')
			).done(function () {
				image(ROOT_PATH + '/data-gl/asset/bathymetry_bw_composite_4k.jpg').then(
					function (image) {
					var m = image.height,
						n = image.width,
						values = new Array(n * m),
						contours = d3.contours().size([n, m]).smooth(true),
						projection = d3.geoIdentity().scale(canvas.width / n),
						path = d3.geoPath(projection, context);
					//   StackBlur.R(image, 5);
					for (var j = 0, k = 0; j < m; ++j) {
						for (var i = 0; i < n; ++i, ++k) {
						values[k] = image.data[k << 2] / 255;
						}
					}
					var opt = {
						image: canvas
					};
					var results = [];
					function update(threshold, levels) {
						context.clearRect(0, 0, canvas.width, canvas.height);
						var thresholds = [];
						for (var i = 0; i < levels; i++) {
						thresholds.push((threshold + (1 / levels) * i) % 1);
						}
						results = contours.thresholds(thresholds)(values);
						redraw();
					}
					function redraw() {
						results.forEach(function (d, idx) {
						context.beginPath();
						path(d);
						context.globalAlpha = 1;
						context.stroke();
						if (idx > (config.levels / 5) * 3) {
							context.globalAlpha = 0.01;
							context.fill();
						}
						});
						opt.onupdate();
					}
					d3.timer(function (t) {
						var threshold = (t % 10000) / 10000;
						update(threshold, 1);
					});
					initCharts(opt);
					update(config.threshold, config.levels);
					}
				);
				function image(url) {
					return new Promise(function (resolve) {
					var image = new Image();
					image.src = url;
					image.crossOrigin = 'Anonymous';
					image.onload = function () {
						var canvas = document.createElement('canvas');
						canvas.width = image.width / 8;
						canvas.height = image.height / 8;
						var context = canvas.getContext('2d');
						context.drawImage(image, 0, 0, canvas.width, canvas.height);
						resolve(context.getImageData(0, 0, canvas.width, canvas.height));
					};
					});
				}
				function initCharts(opt) {
					var contourChart = echarts.init(document.createElement('canvas'), null, {
					width: 4096,
					height: 2048
					});
					var img = new echarts.graphic.Image({
					style: {
						image: opt.image,
						x: -1,
						y: -1,
						width: opt.image.width + 2,
						height: opt.image.height + 2
					}
					});
					contourChart.getZr().add(img);
					opt.onupdate = function () {
					img.dirty();
					};
					myChart.setOption({
					backgroundColor: '#000',
					globe: {
						environment: ROOT_PATH + '/data-gl/asset/starfield.jpg',
						heightTexture:
						ROOT_PATH + '/data-gl/asset/bathymetry_bw_composite_4k.jpg',
						displacementScale: 0.05,
						displacementQuality: 'high',
						baseColor: '#000',
						shading: 'realistic',
						realisticMaterial: {
						roughness: 0.2,
						metalness: 0
						},
						postEffect: {
						enable: true,
						depthOfField: {
							// enable: true
						}
						},
						light: {
						ambient: {
							intensity: 0
						},
						main: {
							intensity: 0.1,
							shadow: false
						},
						ambientCubemap: {
							texture: ROOT_PATH + '/data-gl/asset/lake.hdr',
							exposure: 1,
							diffuseIntensity: 0.5,
							specularIntensity: 2
						}
						},
						viewControl: {
						autoRotate: false
						},
						layers: [
						{
							type: 'blend',
							blendTo: 'emission',
							texture: contourChart,
							intensity: config.intensity
						}
						]
					}
					});
				}
			});
		},
        getMap2(data){
			var config = {
				color: '#c0101a',
				levels: 50,
				intensity: 100,
				threshold: 0.01
			};
			// var canvas = document.createElement('canvas');
			// canvas.width = 4096;
			// canvas.height = 2048;
			// context = canvas.getContext('2d');
			// context.lineWidth = 0.5;
			// context.strokeStyle = config.color;
			// context.fillStyle = config.color;
			// context.shadowColor = config.color;
           var series = [];
    		// [[, BJData]].forEach(function (item, i) {
				series.push({
					type: "scatter",
					// type: "effectScatter",
					coordinateSystem: "geo",
					zlevel: 1,
					animation:false,
					animationThreshold:0,
					rippleEffect: {
						//涟漪特效
						period: 4, //动画时间，值越小速度越快
						brushType: "stroke", //波纹绘制方式 stroke, fill
						scale: 5
						//波纹圆环最大限制，值越大波纹越大
					},
					label: {
                        normal: {
                            fontSize:24,
							show: true,
							position: "right", //显示位置
							offset: [5, 0], //偏移设置
							// formatter: "{b}/{@[2]}" //圆环显示文字
							formatter: "{b}" //圆环显示文字
						},
						emphasis: {
							show: true
						}
					},
					hoverAnimation: true,
					// colorBy:'data',
					itemStyle:{
						normal: {
							color:function(params){  //根据不同数据显示不同颜色的标记
								// console.log("------",params)
								if(params.data.language=='英语'){
									return '#2386BF';
								} else if(params.data.language=='德语'){
									return '#F4516C';
								} else if(params.data.language=='俄语'){
									return '#FFAE8B'
								}else if(params.data.language=='波斯语'){
									return '#B5A1DD'
								} else if(params.data.language=='法语'){
									return '#F7BA2A'
								}else if(params.data.language=='匈牙利语'){
									return '#67E0E3'
								}else if(params.data.language=='意大利语'){
									return '#1BBF59'
								}else{
										return '#ee0909'
								}
							},
							// color: '#000',
							// shadowBlur: 10,
							// shadowColor: '#333'
						}
					},
					// large:true,//是否开启大数据量优化，在数据图形特别多而出现卡顿时候可以开启。
					// largeThreshold:10,//开启绘制优化的阈值
					progressive:10,
					progressiveThreshold:5,
					symbol: "circle",
					symbolSize: function (val) {
                		// return val[2] / 50;
						var  level = 0 ;
						var state= Math.floor(val[2]/12);
						// console.log(state)
						switch (state)
						{
							// case 0: level=0; break;
							// case 1: level=1; break;
							// case 2: level=2; break;
							// case 3: level=3; break;
							// case 4: level=4; break;
							// case 5: level=5; break;
							// case 6: level=6; break;
							// case 7: level=7; break;
							// case 8: level=8; break;
							// case 9: level=9; break;
							default: level=18;
						}
						return 1 + level; //圆环大小
					},
					// data:item[1].map(function (dataItem) {
					// 	// console.log(dataItem)
					// 	return {
					// 		name: dataItem[0].name/*+"\n"+dataItem[0].value*/,
					// 		value: geoCoordMap[dataItem[0].name].concat([dataItem[0].value])
					// 	};
					// })
					// data:[{name:"United",value:[-4.388361,11.186148]}],
					data:data
				});
			// });
            
            var canvas = document.createElement('canvas');
            echarts.registerMap('world', world);/* 注册world地图 */
            if (mapChart != null) {
				mapChart.clear()
			}
            mapChart = echarts.init(canvas, null, {
            width: 4096, height: 2048
            });
            // console.log(series)
            mapChart.setOption({
                // backgroundColor: '#061226',//整体背景色
                backgroundColor: '#0C1E46',//整体背景色
				//悬浮提示
				tooltip: {
					trigger: "item",
					backgroundColor: '#fff',
					borderColor: "#FFFFCC",
					showDelay: 0,
					hideDelay: 0,
					// enterable: true,
					transitionDuration: 0,
				// extraCssText: "z-index:100",formatter
					// formatter: function (params, ticket, callback) {
					// 	// console.log(params)
					// 	//根据业务自己拓展要显示的内容
					// 	var res = "";
					// 	var name = params.name;
					// 	// console.log(params)
					// 	// console.log(params.value[2])
					// 	var value = params.value[params.seriesIndex + 1];
					// 	res = `<span style='color:#fff;'>城市： ${name.toString().split(' ')[0]}</span><br/>
					// 	<span style='color:#fff;'>数量：${params.value[2]}</span>`
					// 	return res;
					// }
				},
				// visualMap: {
				// 	//图例值控制
				// 	min: 0,
				// 	max: 1000,
				// 	text:['High','Low'],
				// 	show: true,
				// 	calculable: true,
				// 	color: ["#ee0909"],//圆环颜色
				// 	// color: ['yellow']
				// },
				geo: {
					show:true,
					type: 'map',
					map: "world",
					boundingCoords: [[-180, 90], [180, -90]],
                    selectedMode:"single",
					label: {
                        textStyle:{
                            // color:"#fff",
                            fontSize:30
                        },
						emphasis: {
							show: true
						}
					},
					zlevel: 1,
					// zoom:this.num,
					// roam: 'move', //是否允许缩放
					layoutCenter: ["50%", "50%"], //地图位置
					// layoutSize: "180%",
					itemStyle: {
						normal: {
							// color: "#2386bf", //地图背景色
							color: "#112E6D", //地图背景色
							// borderColor: "#5bc1c9", //省市边界线
							borderColor: "#fff", //省市边界线
							areaStyle:{
								color: '#000000'
							},
							borderJoin:'round'
						},				
						emphasis: {
                            fontSize:50,
							focus: 'self',
							// color: "rgba(37, 43, 61, .5)" //悬浮背景
							// color: '#2386bf'
							color: '#1A46B0'
						}
					},
				},
        		series: series
            });
            
            mapChart.on('click',param=>{
                console.log(param)
				if(param.data){
					// mapData.forEach(item=>{
					//     item.itemStyle= { normal: {areaColor:item.name==param.data.name?'#AADDFF':'#d2e9f9'}, 
					//         emphasis: { areaColor: '#c5e6fd'}};
					//         //重新setoption
					// })
				}
            })
			if (myEarth != null) {
				myEarth.clear()
			}
			myEarth = echarts.init(this.$refs.echarts)
		    myEarth.clear();
            var option={
                // backgroundColor: 'rgba(0,0,0,0)',
                globe: {
					left:"-1.5%",
                    baseTexture: mapChart,
					displacementScale:1,
					globeOuterRadius:200,
					displacementQuality:'low',
                    // baseTexture: this.ROOT_PATH + '/data-gl/asset/world.topo.bathy.200401.jpg',
                    shading: 'color',
					// shading: 'lambert',
					// light: { // 光照阴影
					// 	main: {
					// 		// color: 'red', // 光照颜色
					// 		intensity: 14.2, // 光照强度
					// 		shadowQuality: 'ultra', //阴影亮度
					// 		shadow: true, // 是否显示阴影
					// 		alpha: 40,
					// 		beta: -30
					// 	},
					// 	ambient: {
					// 		intensity: 4.6
					// 	}
					// },
                    //视角控制
                    viewControl:{
                        //projection:"orthographic",
                        /*damping:0,*/
                        rotateSensitivity:0.8, //鼠标旋转灵敏度
                        zoomSensitivity:0,//鼠标缩放灵敏度
                        autoRotate:true,
                        autoRotateSpeed: 11, //物体自转的速度,单位为角度 / 秒，默认为10 ，也就是36秒转一圈。
                        autoRotateAfterStill:10,//鼠标停止后多久恢复旋转(为0时暂停后不恢复旋转)
                        //alpha:160,//视角绕 x 轴，即上下旋转的角度
                        //beta:-20,//视角绕 y 轴，即左右旋转的角度。
                        targetCoord: [116.20, 39.56],//定位到哪里
						distance:135
                    },
					postEffect: { //为画面添加高光，景深，环境光遮蔽(SSAO)，调色等效果
						enable: true, //是否开启
						SSAO: { //环境光遮蔽
							radius: 1, //环境光遮蔽的采样半径。半径越大效果越自然
							intensity: 1, //环境光遮蔽的强度
							enable: true
						}
					},
					layer: [{
						show:true,
						type:'blend',
						 blendTo:'emission',
						// 更新 name 为 'cloud' 的层的纹理
						name: 'cloud',
						// texture: mapChart,
                        intensity: config.intensity

					}]
                },
                // 地球文字显示信息配置
                series: [
					{
						type: 'lines3D',
                        coordinateSystem: 'globe',
                        effect: {
                            show: true,
                            period: 2,
                            trailWidth: 3,
                            trailLength: 0.5,
                            trailOpacity: 1,
                            trailColor: '#0087f4'
                        },
                        blendMode: 'lighter',
                        lineStyle: {
                            width: 1,
                            color: '#0087f4',
                            opacity: 0.2
                        },
                        data: [],
                        silent: false
					},
					series[0]
				]
            }
			// 随机数据
			/**
			 * 
			 
			option.series[0].data = [{
					coords: [
						[117.11, 34.15],
						[118.58, 32.01]
					],
					value: (Math.random() * 3000).toFixed(2)
				},
				{
					coords: [
						[123.38, 41.8],
						[118.58, 32.01]
					],
					value: (Math.random() * 3000).toFixed(2)
				},
				{
					coords: [
						[112.01, 38.01],
						[118.58, 32.01]
					],
					value: (Math.random() * 3000).toFixed(2)
				},
				{
					coords: [
						[139.46, 35.42],
						[118.58, 32.01]
					],
					value: (Math.random() * 3000).toFixed(2)
				},
				{
					coords: [
						[116.58, 6.10],
						[118.58, 32.01]
					],
					value: (Math.random() * 3000).toFixed(2)
				},
				{
					coords: [
						[102.90, 25.31],
						[118.58, 32.01]
					],
					value: (Math.random() * 3000).toFixed(2)
				}
			]
			for (let i = 0; i < 10; i++) {
				option.series[0].data = option.series[0].data.concat(rodamData())
			}
			function rodamData() {
				let name = '随机点' + Math.random().toFixed(5) * 100000
				// let longitude = Math.random() * 62 + 73
				let longitude = 118.58
				let longitude2 = Math.random() * 360 - 180
				// let latitude = Math.random() * 50 + 3.52
				let latitude = 32.01
				let latitude2 = Math.random() * 180 - 90
				return {
					coords: [
						[longitude2, latitude2],
						[longitude, latitude]
					],
					value: (Math.random() * 3000).toFixed(2)
				}
			}
			*/
            myEarth.setOption(option)
            window.addEventListener("resize",() => {myEarth.resize();});
        }
    },
	destroyed() {
		mapChart.clear()
		myEarth.clear()
	},
	beforeDestroy(){
		myEarth.clear()
		mapChart.clear()
	},
    components: {
        
    }
}
</script>
<style lang='less' scoped>
   .barbox{width: 100%;height: 100%;}
</style>