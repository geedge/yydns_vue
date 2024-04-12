<template>
    <div class="dresource-monitor">
      <div class="cpu">
        <div style="width:100%;height: 100%;" id="cpu"></div>
      </div>
      <div class="memory">
        <div style="width:100%;height: 100%;" id="memory"></div>
      </div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  import dayjs from 'dayjs'
  import { getCpuResponse } from './cpuMock.js'
  import { getMemoryResponse } from './memoryMock.js'
  export default {
    data() {
      return {
        nodeId: '',
        cpuData: [],
        cpuDataX: [],
        cpuDataY: [],
        memoryData: [],
        memoryDataX: [],
        memoryDataY: []
      }
    },
    watch: {
        '$store.state.range.nodeId': {
            handler(newVal, oldVal) {
                this.nodeId = newVal
                // this.init()
            },
            immediate: true
        } 
    },
    created() {
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
          // this.cpuData = getCpuResponse.result
          // this.cpuData.forEach(item => {
          //   this.cpuDataX.push(item[0])
          //   this.cpuDataY.push(item[1])
          // })
          // this.memoryData = getMemoryResponse.result
          // this.memoryData.forEach(item => {
          //   this.memoryDataX.push(item[0])
          //   this.memoryDataY.push(item[1])
          // })
          // this.setCpuEcharts()
          // this.setMemoryEcharts()

          const reqParams = {
              node_id: this.nodeId,
          }
          this.$axios.get(this.$http.api.getCpu, reqParams).then(res => {
              if (res.code == 200 || res.code == "OK") {
                this.cpuData = res?.result
                this.cpuData.forEach(item => {
                  this.cpuDataX.push(dayjs(item[0]).format('HH:mm:ss'))
                  this.cpuDataY.push(item[1])
                })
              }
          }).catch(err => {
              console.log(err)
          }).finally(() => {
              this.setCpuEcharts()
          })
          this.$axios.get(this.$http.api.getMemory, reqParams).then(res => {
              if (res.code == 200 || res.code == "OK") {
                this.memoryData = res?.result
                this.memoryData.forEach(item => {
                  this.memoryDataX.push(dayjs(item[0]).format('HH:mm:ss'))
                  this.memoryDataY.push(item[1])
                })
              }
          }).catch(err => {
              console.log(err)
          }).finally(() => {
              this.setMemoryEcharts()
          })
      },
      setCpuEcharts() {
        var chartDom = document.getElementById('cpu');
        var myChart = echarts.init(chartDom);
        var option;

        option = {
          // color: ['rgba(61, 255, 220, 0.2)'],
          grid: {
            // top: '8%',
            height: '55%' // 设置折线图的高度为容器高度的百分之四十
          },
          xAxis: {
            type: 'category',
            data: this.cpuDataX,
            axisLabel: {
              color: '#ffffff'
            }
          },
          yAxis: {
            type: 'value',
            name: 'cpu (mcore)',
            nameTextStyle: {
              color: '#ffffff'
            },
            axisLine: {
              show: true   // 将此处改为 true 则显示 Y 轴刻度线
              // symbol: ['none', 'arrow']
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              color: '#ffffff'
            }
          },
          series: [
            {
              data: this.cpuDataY,
              type: 'line',
              smooth: true
            }
          ]
        }
        option && myChart.setOption(option)
      },

      setMemoryEcharts() {
        var chartDom = document.getElementById('memory');
        var myChart = echarts.init(chartDom);
        var option;

        option = {
          grid: {
            top: '18%',
            height: '55%' // 设置折线图的高度为容器高度的百分之四十
          },
          xAxis: {
            type: 'category',
            data: this.memoryDataX,
            axisLabel: {
              color: '#ffffff'
            }
          },
          yAxis: {
            type: 'value',
            name: '内存 (Mi)',
            nameTextStyle: {
              color: '#ffffff'
            },
            axisLine: {
              show: true   // 将此处改为 true 则显示 Y 轴刻度线
              // symbol: ['none', 'arrow']
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              color: '#ffffff'
            }
          },
          series: [
            {
              data: this.memoryDataY,
              type: 'line',
              smooth: true
            }
          ]
        }
        option && myChart.setOption(option)
      }
    }
  
  }
  </script>
  
<style lang='less' scoped="scoped">
.dresource-monitor {
    width: 100%;
    height: 100%;
    background-color: rgba(25, 33, 61, 0.4);
    border: 1px solid rgba(186, 208, 241, 0.1);
    border-radius: 8px;
}
.cpu {
  width: 100%;
  height: 50%;
}
.memory {
  width: 100%;
  height: 50%;
}
</style>