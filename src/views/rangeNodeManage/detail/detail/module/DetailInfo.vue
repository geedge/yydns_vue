<template>
    <div class="detail-info" v-loading="loading">
        <el-descriptions :column="2">
            <el-descriptions-item label="Tor版本">{{nodeDetail.owner_setting && nodeDetail.owner_setting.tor_version}}</el-descriptions-item>
            <el-descriptions-item label="状态">{{nodeDetail.status}}</el-descriptions-item>
            <el-descriptions-item label="角色">{{nodeDetail.owner_setting && nodeDetail.owner_setting.role}}</el-descriptions-item>
            <el-descriptions-item label="创建开始时间">{{formatTime(nodeDetail.create_time)}}</el-descriptions-item>
            <el-descriptions-item label="宽带">{{nodeDetail.owner_setting && nodeDetail.owner_setting.bandwidth + '&nbsp;M'}}</el-descriptions-item>
            <el-descriptions-item label="创建完成时间">{{formatTime(nodeDetail.complete_time)}}</el-descriptions-item>
            <el-descriptions-item label="内存">{{nodeDetail.owner_setting && nodeDetail.owner_setting.memory + '&nbsp;Mi'}}</el-descriptions-item>
            <el-descriptions-item label="ip">{{nodeDetail.ip}}</el-descriptions-item>
            <el-descriptions-item label="sockport">{{nodeDetail.owner_setting && nodeDetail.owner_setting.socks_port}}</el-descriptions-item>
            <el-descriptions-item label="pod名">{{nodeDetail.pod_name}}</el-descriptions-item>
            <el-descriptions-item label="网络">{{nodeDetail.owner_setting && nodeDetail.owner_setting.use_network.cidr}}</el-descriptions-item>
            <el-descriptions-item label="节点昵称">{{nodeDetail.nick_name}}</el-descriptions-item>
            <el-descriptions-item v-if="nodeDetail.owner_setting && nodeDetail.owner_setting.role==='onion'" label="onion">{{nodeDetail.onion}}</el-descriptions-item>
        </el-descriptions>
    </div>
  </template>
  
  <script>
  import { formatTime } from '../../../../../utils'
  export default {
    name: 'DetailInfo',
    data() {
      return {
        loading: false,
        nodeId: '',
        nodeDetail: {}
      }
    },
    watch: {
      '$store.state.range.nodeId': {
        handler(newVal, oldVal) {
          this.nodeId = newVal
          this.init()
        },
        immediate: true
      } 
    },
    methods: {
      formatTime,
      init() {
        // this.nodeDetail = getTargetsResponse?.result
        this.loading = true
        const reqParams = { node_id: this.nodeId }
        this.$axios.get(this.$http.api.getNodeDetail, reqParams).then(res => {
            if (res.code == 200 || res.code == "OK") {
                this.nodeDetail = res?.result
            }
        }).catch(err => {
            console.log(err)
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
  </script>
  
  <style lang='less' scoped="scoped">
  .detail-info {
    width: 100%;
    height: 100%;
    background-color: rgba(25, 33, 61, 0.4);
    border: 1px solid rgba(186, 208, 241, 0.1);
    border-radius: 8px;
  }
.el-descriptions{
    ::v-deep .el-descriptions__body {
      background-color: transparent;
      .el-descriptions__table .el-descriptions-item__cell {
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;
        padding-top: 20px;
        padding-left: 25px;
        color: rgba(255, 255, 255, 0.6);        
      }
    }
}
  </style>