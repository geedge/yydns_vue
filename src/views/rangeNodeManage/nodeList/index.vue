<template>
<div class="range-config-manage" ref="appRef">
    <Header
        :range-dict="rangeDict"
        @query="query"
        @batchConsole="batchConsole"
        @batchDownload="batchDownload"
        @batchUpload="batchUpload"
        @batchCollectTraffic="batchCollectTraffic"
    ></Header>
    <div class="list" >
        <el-table
            class="custom-table"
            ref="multipleTable"
            v-loading="loading"
            element-loading-text="加载中..."
            height="100%"
            style="width: 100%;"
            :data="tableData"
            tooltip-effect="dark"
            highlight-current-row
        >
            <el-table-column
                align="center" 
                prop="id"
                label="id"
                width="80"/>
                <el-table-column 
                align="center"
                prop="nick_name"
                label="节点昵称"
                min-width="100"/>
            <el-table-column 
                align="center"
                prop="role"
                label="角色"
                min-width="100">
                <template slot-scope="scope">
                    <svg-icon :icon-class="scope.row.role"></svg-icon>
                    <span style="padding-left: 5px;">{{ roleDict[scope.row.role] || scope.row.role }}</span>
                </template>                        
            </el-table-column>
            <el-table-column
                align="center"
                prop="ip"
                label="ip"
                min-width="150"/>
            <el-table-column
                align="center"
                prop="status"
                label="部署状态"
                min-width="100"
            >
                <template slot-scope="scope">
                    <div class="deploy-status">
                        <svg-icon :icon-class="getStatus(scope.row.status).class"></svg-icon>
                        <span :class="getStatus(scope.row.status).class">{{ getStatus(scope.row.status).label }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="collecting"
                label="正在采集流量"
                min-width="100"
            >
                <template slot-scope="scope">
                    {{ scope.row.collecting ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="create_time"
                label="创建开始时间"
                min-width="150"
            >
            <template slot-scope="scope">
                {{ scope.row.create_time | formatTime }}
            </template>
            </el-table-column>
                <el-table-column
                align="center"
                prop="complete_time"
                label="创建完成时间"
                min-width="150"
            >
            <template slot-scope="scope">
                {{ scope.row.complete_time | formatTime }}
            </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                min-width="200"
            >
                <template slot-scope="scope">
                    <el-button type="text" size="medium" :disabled="scope.row.status==='pending' || !roleDict[scope.row.role]" @click="console(scope.row)">控制台</el-button>
                    <el-button type="text" size="medium" :disabled="!roleDict[scope.row.role]" @click="log(scope.row)">日志</el-button>
                    <el-button type="text" size="medium" :disabled="!roleDict[scope.row.role]" @click="detail(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <el-pagination
        background
        :current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    >
    </el-pagination>
    <div class="mask"></div>
    <Console
        ref="batchConsole"
        :target_id="target_id"
        @refresh="init">
    </Console>
    <Download
        ref="batchDownload"
        :target_id="target_id"
        @refresh="init">
    </Download>
    <Upload
        ref="batchUpload"
        :target_id="target_id"
        @refresh="init">
    </Upload>
    <CollectTraffic
        ref="batchCollectTraffic"
        :target_id="target_id"
        @refresh="init">
    </CollectTraffic>
</div>
</template>
<script>
import Header from './module/Header.vue'
import Console from './module/Console.vue'
import Download from './module/Download.vue'
import Upload from './module/Upload.vue'
import CollectTraffic from './module/CollectTraffic'

export default {
  name: "RangeConfigManage",
  components:{ Header, Console, Download, Upload, CollectTraffic },

  data(){
      return{
        page: 1,
        size: 10,
        total: 0,
        target_id: '',
        tableData: [],
        selectConfigIds: [],
        rangeDict: [],
        loading: false,
        pendingTimer: null,
        roleDict:{
            da: '权威目录节点',
            client: '客户端节点',
            guard: '入口节点',
            relay: '路由节点',
            exit: '出口节点',
            onion: '洋葱服务节点',
        }
      }
  },
  mounted() {

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
  created() {},
  beforeDestroy() {
    if (this.pendingTimer) {
    clearInterval(this.pendingTimer)
    this.pendingTimer = null
    }
},
  methods:{
    init(params={}) {
    //   this.tableData = getTargetsResponse?.result?.items
    //   this.total = getTargetsResponse?.result?.total

        // const checkedData = JSON.parse(JSON.stringify(this.selectTableData))
        const reqParams = {
            page: this.page,
            size: this.size,
            ...params
        }
        if (this.target_id && this.target_id !== '') {
            reqParams.target_id = this.target_id
        }
        this.loading = true
        this.$axios.get(this.$http.api.getNodeList, reqParams).then(res => {
            if (res.code == 200 || res.code == "OK") {
                this.tableData = res?.result?.items
                this.total = res?.result?.total
                // this.$nextTick(()=>{
                //     checkedData.forEach((item) => {
                //         this.$refs?.multipleTable?.toggleRowSelection(this.tableData.find(val => val.id === item.id), true)
                //     })
                // })
                let index = this.tableData?.findIndex(item => {
                    return item.status === 'pending'
                })
                if (index !== -1) {
                    if (!this.pendingTimer) {
                        this.pendingTimer = setInterval(() => {
                            this.init()
                        }, 10 * 1000)
                    }
                }
            }
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            this.loading = false
        })
    },
    query(params) {
        this.init(params)
    },
    // 批量控制台
    batchConsole() {
        document.querySelector('.mask').style.display = 'block'
        this.$refs.batchConsole.visible = true
    },
    // 批量下载文件
    batchDownload() {
        this.$refs.batchDownload.getNodeList()
        document.querySelector('.mask').style.display = 'block'
        this.$refs.batchDownload.visible = true         
    },
    // 批量上传
    batchUpload() {
        // this.$store.commit('range/setNodeId', '')
        this.$refs.batchUpload.getNodeList()
        document.querySelector('.mask').style.display = 'block'
        this.$refs.batchUpload.visible = true           
    },
    // 批量运行流水线
    batchCollectTraffic() {
        this.$refs.batchCollectTraffic.getNodeList()
        document.querySelector('.mask').style.display = 'block'
        this.$refs.batchCollectTraffic.visible = true  
    },
    // 控制台
    console(row) {
        this.$store.commit('range/setNodeId', row.id)
        this.$router.push({
            name: 'console',
            params: {
                closeIcon : true
            }
        }) 
    },
    // 日志
    log(row) {
        this.$store.commit('range/setNodeId', row.id)
        this.$router.push({
            name: 'log',
            params: {
                closeIcon : true
            }
        })     
    },
    // 详情
    detail(row) {
        this.$store.commit('range/setNodeId', row.id)
        //保存是否正在采集流量
        this.$store.commit('node/setStartTraffic', row.collecting)
        //保存是否正在结束采集流量
        this.$store.commit('node/setEndTraffic', row.analysing)
        this.$router.push({ name: 'nodeDetail'})
    },
    getStatus(status) {
        let statusInfo = {
            label: '',
            class: ''
        }
        switch (status) {
            case 'true':
            case 'pending':
                statusInfo.label = '正在部署'
                statusInfo.class = 'deployNormal'
                break;
            case 'false':
                statusInfo.label = '部署失败'
                statusInfo.class = 'deployFail'
                break;
            case 'complete':
                statusInfo.label = '部署完成'
                statusInfo.class = 'deploySuccess'
                break;
            default:
                break;
        }
        return statusInfo
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
        })            
    },
    // // 处理选中的数据
    // handleSelectionChange(selectData) {
    // this.selectTableData = selectData
    // this.selectConfigIds = selectData.map(item => {
    //     return item.id
    // })
    // },
    // 修改每页数据条数
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.page=1
        this.size=val
        this.query()
    },
    // 修改页数
    handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.page=val
        this.query()
    }
  }
}

</script>

<style lang='less' scoped="scoped">
.el-pagination {
    padding: 15px 55px 0 0 !important;
}
.custom-table {
  width: 100%;
  height: 100%;
  .deploy-status {
    display: inline-block;
    width: 103px;
    height: 28px;
    color:#FFFFFF;
    border-radius: 3px;
    padding: 5px, 12px, 5px, 12px;
    background: rgba(227, 249, 233, 0.2);
  }
  .deployFail {
    color: #E9473E;
    width: 56px;
    height: 28px;
    margin-left: 10px;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 28px;
    letter-spacing: 0em;
    text-align: left;
  }
  .deployNormal {
    color: #02DDEA;
    width: 56px;
    height: 28px;
    margin-left: 10px;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 28px;
    letter-spacing: 0em;
    text-align: left;
  }
  .deploySuccess {
    color: #0CCB64;
    width: 56px;
    height: 28px;
    margin-left: 10px;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 28px;
    letter-spacing: 0em;
    text-align: left;
  }
}
.range-config-manage {
    width: 100%;
    height: 100%;
    // display: flex;
    // flex-direction: column;
    // justify-content: flex-start;
      .list{
          width: 100%;
          height: 73%;
          // margin-left: 2.5%;
          // overflow-y: auto;
          // overflow-y: scroll;
          // overflow-x: hidden;
          // border: none;
      }
      .list::-webkit-scrollbar {
          width: 0px;  /* 隐藏滚动条 */
          height: 0px;
          background-color: transparent; /* 让背景透明 */

      }
      /* 隐藏火狐浏览器滚动条 */
      @-moz-document url-prefix() {
          .trackSource {
              scrollbar-width: none;
          }
      }
      // 遮罩层
      .mask{
          position: fixed; /*将元素设置为固定定位*/
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-color: rgba(0,0,0,0.5); /*通过rgba函数来控制遮罩层的透明度*/
          display: none; /*将元素隐藏*/
      }
  }
</style>