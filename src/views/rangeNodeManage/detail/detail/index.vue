<template>
<div class="tabs">
  <i class="el-icon-back back-btn" @click="backNodeList"></i>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="详细信息" name="second">
      <DetailInfo></DetailInfo>
    </el-tab-pane>
    <el-tab-pane label="资源监控" name="third">
      <ResourceMonitor v-if="activeName==='third'"></ResourceMonitor>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import DetailInfo from './module/DetailInfo'
import ResourceMonitor from './module/ResourceMonitor'
export default {
    components: { DetailInfo, ResourceMonitor },
    data() {
      return {
        activeName: 'second'
      };
    },
    methods: {
      handleClick(tab, event) {
      },
	  backNodeList() {
		this.$router.push({ name: 'rangeNodeManage' })
	  }
    }
}
</script>

<style lang='less' scoped="scoped">
.tabs {
	width: 100%;
	height: 100%;
	text-align: center;
	position: relative;
	padding: 8px 0 0;
	display: flex;
	.detail-title {
		position:absolute;
		margin: 10px;
	}
	.back-btn {
		position: absolute;
		cursor: pointer;
		font-size: 30px;
    	color: #02DDEA;
		margin: 5px;
		z-index: 10;
	}
}
::v-deep .el-tabs{
	color: #000;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
	position: relative;
	.el-tabs__header {
		margin-left: 100px;
	}
	.el-tabs__content{
		height: calc(100% - 48px);
		// height: 100%;
		.el-tab-pane{
			height: 100%;
		}
	}
}
/* 去除灰色横条 */
::v-deep .el-tabs__nav-wrap::after {
	position: static !important;
}
/* 设置滑块颜色 */
::v-deep .el-tabs__active-bar{
	background-color: #0E3D8A !important;
}
/* 设置滑块停止位置 */
::v-deep .el-tabs__active-bar.is-top{
	height: 37px;
	width: 104px ! important;
	border-radius: 17px;
	top: 0px !important;
	left: -18px !important;
	position: absolute !important;
	z-index: 1;
}
/* 设置当前选中样式 */
::v-deep .el-tabs__item.is-active{
	color:#02DDEA !important;
	z-index: 2;
}
/* 设置未被选中样式 */
::v-deep .el-tabs__item{
	padding: 0 20px !important;
	width: 104px;
	box-sizing: border-box;
	display: inline-block;
	position: relative !important;
	color:#02DDEA !important;
	z-index: 2;
}
</style>