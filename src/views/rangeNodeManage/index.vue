<template>
  <div class="range-node-manage">
    <div class="container">
      <div class="header">
        <el-select class="range-select" v-model="target_id" placeholder="全部靶场" @change="changeRange">
            <el-option
                    v-for="item in rangeDict"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
      </div>
      <div class="map-container">
          <WorldMap></WorldMap>
          <TopologyMap></TopologyMap>
      </div>
      <div class="list-container">
        <NodeList></NodeList>
      </div>
    </div>
  </div>
</template>

<script>
import WorldMap from './worldMap'
import TopologyMap from './topologyMap'
import NodeList from './nodeList'
export default {
    name: 'rangeNodeManage',
    components: {
        NodeList,
        WorldMap,
        TopologyMap
    },
    data() {
      return {
        target_id: '',
        rangeDict: []
      }
    },
    watch: {
        '$store.state.range.targetId': {
            handler(newVal, oldVal) {
                this.target_id = newVal
            },
            immediate: true
        } 
    },
    created() {
      this.getRangeDict()
    },
    methods: {
        // 改变靶场
        changeRange() {
            this.$store.commit('range/setTargetId', this.target_id)
        },
        // 获取靶场列表字典
        getRangeDict() {
            const reqParams = {
                page: 1,
                size: 99,
            }
            this.$axios.get(this.$http.api.getTargets, reqParams).then(res => {
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
            })         
        },
    }

}
</script>

<style lang='less' scoped>
.range-node-manage {
  width: 100%;
  height: 100%;
  position: relative;
  .container {
    width: 95%;
    height: 95%;
    position: absolute; /* 绝对定位 */
    top: 50%; /* 向下偏移50% */
    left: 50%; /* 向右偏移50% */
    transform: translate(-50%, -50%); /* 回移50% */
    background-image:url('../../img/backgroundFourCorner.png');
    background-repeat: no-repeat; /* 可选，防止图像重复 */
    background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
    padding: 1.5%;
  }
}
.header {
  height: 7%;
  width: 100%;
  text-align: left;
  .range-select {
    // position: absolute;
    // top: 12px;
    // right: 140px;
    ::v-deep .el-input {
      width: 60%;
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
        color: rgba(2, 221, 234, 0.9);
      }
    }
}
}
.map-container{
  height: 43%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

}
.list-container{
  height: 50%;
  width: 100%;
}

</style>