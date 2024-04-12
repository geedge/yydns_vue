<template>
    <div class="range-manage" ref="appRef">
        <div class="show">
            <Header
                @quickAdd="quickAdd"
                @customAdd="customAdd"
                @query="query"
            ></Header>
            <div class="list" id="show-loading">
                <div class="single" v-for="rangeItem in rangeList" :key="rangeItem.target_name">
                    <div class="title">
                        <span style="font-size: 20px;">{{rangeItem.target_name+' '+getDeployStatus(rangeItem,'deploy_status')}}</span>
                        <el-button :class="rangeItem.attribute==='public' ? 'gOsY' : 'gOsN'" >{{rangeItem.attribute==='public' ? '公用' : '私有'}}</el-button>
                    </div>
                    <div class="container">
                        <div class="row">
                            <div class="cell">{{`正常节点：${getDeployStatus(rangeItem,'deploy_success_count')}个`}}</div>
                            <div class="cell">{{`异常节点：${getDeployStatus(rangeItem,'deploy_default_count')}个`}}</div>
                            <div class="cell">{{`节点数量：${getDeployStatus(rangeItem,'deploy_total_count')}个`}}</div>
                        </div>
                        <div class="row">
                            <div class="cell small">{{`创建人：${rangeItem.username}`}}</div>
                            <div class="cell large">{{`创建时间：${formatTime(rangeItem.create_time)}`}}</div>
                        </div>
                    </div>
                    <div class="buttons">
                        <el-button class="glBut" type="primary" :disabled="rangeItem.delLoading" @click="edit(rangeItem)">修改</el-button>
                        <el-button class="glBut" type="primary" :loading="rangeItem.delLoading" @click="del(rangeItem)">删除</el-button>
                        <el-button class="glBut" type="primary" @click="goConfigManage(rangeItem.id)">配置管理</el-button>
                        <el-button class="glBut" type="primary" @click="goNodeManage(rangeItem.id)">节点管理</el-button>
                    </div>
                </div>
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
            <QuickCreate ref="quickCreate" :is-add="isAdd" @refresh="init"></QuickCreate>
            <CustomCreate ref="customCreate" :is-add="isAdd" @refresh="init"></CustomCreate>
        </div>
    </div>
</template>

<script>
import Header from './module/Header.vue'
import QuickCreate from './module/QuickCreate.vue'
import CustomCreate from './module/CustomCreate.vue'
import { formatTime } from '../../utils'
import { Loading } from 'element-ui'
import { getTargetsResponse } from './mock.js'
export default {
  name: "RangeMange",
  components:{
    Header,
    QuickCreate,
    CustomCreate
  },
  // props:['fTag','fInput','fFrom','FIsConfigQuery'],
  data(){
      return{
        page: 1,
        size: 10,
        total: 0,
        isAdd: false,
        rangeList:[],
        delTimer: null,
        pendingTimer: null,
        counter: 0
      }
  },
  computed: {},
  watch: {},
  filters: {},
  created() {
    // this.init()
  },
  mounted() {
    this.init()
  },
  destroyed() {
    if (this.pendingTimer) {
        clearInterval(this.pendingTimer)
        this.pendingTimer = null
    }
    if(this.delTimer) {
        clearInterval(this.delTimer)
        this.delTimer = null
    }
    this.counter = 0
  },
  methods:{
    formatTime,
    // 初始化数据
    init(params={}) {
        // this.rangeList = getTargetsResponse?.result?.items
        // this.total = getTargetsResponse?.result?.total
        const reqParams = {
            page: this.page,
            size: this.size,
            ...params
        }
    // TODO: 网络请求先注释，后期放开
        let loadingInstance = Loading.service({ text: '加载中...', target: '#show-loading'}) // 开启loading
        this.$axios.get(this.$http.api.getTargets, reqParams).then(res => {
            if (res.code == 200 || res.code == "OK") {
                this.total = res?.result?.total
                this.rangeList = res?.result?.items
                this.rangeList.map(item => {
                    this.$set(item, 'delLoading', false)
                    return item
                })
                let index = this.rangeList?.findIndex(item => {
                    return item.target_deploy_statuses[0].deploy_status === '部署中' || item.target_deploy_statuses[0].deploy_status === '删除中'
                })
                if (index !== -1) {
                    if (!this.pendingTimer) {
                        this.pendingTimer = setInterval(() => {
                            this.timerUpdateList(params)
                        }, 10 * 1000)
                    }
                }
            }
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            loadingInstance.close()
            if(this.rangeList.length === 0) {
                this.$store.commit('range/setTargetId', '')
            }
        })
    },
    // 查询
    query(params) {
        this.init(params)
    },
    // pendingTimer只刷新数据
    timerUpdateList(params) {
        const reqParams = {
            page: this.page,
            size: this.size,
            ...params
        }
        this.$axios.get(this.$http.api.getTargets, reqParams).then(res => {
            if (res.code == 200 || res.code == "OK") {
                this.total = res?.result?.total
                this.rangeList = res?.result?.items
                this.rangeList.map(item => {
                    this.$set(item, 'delLoading', false)
                    return item
                })
            }
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            if(this.rangeList.length === 0) {
                this.$store.commit('range/setTargetId', '')
            }
        })
    },
    // 修改
    edit(rangeItem) {
        if (rangeItem.create_mode === 'define') {
            // 自定义靶场修改
            this.isAdd = false
            this.$refs.customCreate.target_id = rangeItem.id
            this.$refs.customCreate.user_id = rangeItem.user_id
            this.$refs.customCreate.form.target_name = rangeItem.target_name
            this.$refs.customCreate.form.description = rangeItem.description
            this.$refs.customCreate.form.attribute = rangeItem.attribute
            document.querySelector('.mask').style.display = 'block'
            this.$refs.customCreate.visible = true
        } else {
            // 快速创建靶场修改
            this.isAdd = false
            this.$refs.quickCreate.target_id = rangeItem.id
            this.$refs.quickCreate.user_id = rangeItem.user_id
            this.$refs.quickCreate.form.target_name = rangeItem.target_name
            this.$refs.quickCreate.form.description = rangeItem.description
            if (rangeItem.ratio === 0.01 || rangeItem.ratio === 0.005 || rangeItem.ratio === 0.002 || rangeItem.ratio === 0.001) {
                this.$refs.quickCreate.form.ratio = rangeItem.ratio.toString()
            } else {
                this.$refs.quickCreate.otherRatio = rangeItem.ratio.toString()
            }
            this.$refs.quickCreate.form.attribute = rangeItem.attribute
            this.$refs.quickCreate.form.createType = rangeItem.create_mode
            document.querySelector('.mask').style.display = 'block'
            this.$refs.quickCreate.visible = true
        }
    },
    // 删除
    del(rangeItem) {
        rangeItem.delLoading = true
        const url = this.$http.api.asyncTarget + '/' + rangeItem.id
        this.$axios.delete(url, {}).then(res => {
            if (res.code == 200 || res.code == "OK") {
                this.$notify({
                    title: res.message,
                    type: 'success',
                    duration: 2500
                })
                this.delTimer = setInterval(() => {
                    this.getTask(res?.result?.task_id || '')
                }, 10 * 1000)
                // this.init()
            }
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            // rangeItem.delLoading = false
        })     
    },
    // 获取任务进度
    getTask(task_id) {
        const url = this.$http.api.task + '/' + task_id
        this.$axios.get(url, {}).then(res => {
            if(res.task_status !== 'PENDING' && res.task_status !== 'STARTED') {
                if (res?.task_result?.code === 500 || res?.task_result?.message === 'false') {
                    this.$notify({
                        title: `${res.task_id}任务执行完毕，删除靶场失败`,
                        type: 'success',
                        duration: 2500
                    })
                } else {
                    this.$notify({
                        title: `${res.task_id}任务执行完毕，删除靶场成功`,
                        type: 'success',
                        duration: 2500
                    })
                }
                clearInterval(this.delTimer)
                this.delTimer = null
                this.counter = 0
                this.init()
            } else {
                // this.$notify({
                //     title: `${res.task_id}任务执行中`,
                //     type: 'success',
                //     duration: 2500
                // })
            }
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            this.counter++
            if (this.counter >= 60) {
                clearInterval(this.delTimer)
                this.delTimer = null
                this.counter = 0
                this.init()
            }
        })
    },
    // 配置管理页面
    goConfigManage(id) {
        this.$store.commit('globalAttrs/setCheckMenu', 'rangeConfigManage')
        this.$store.commit('range/setTargetId', id)
    },
    // 节点管理页面
    goNodeManage(id) {
        this.$store.commit('globalAttrs/setCheckMenu', 'rangeNodeManage')
        this.$store.commit('range/setTargetId', id)
    },
    // 打开快速创建靶场
    quickAdd() {
        this.isAdd = true
        document.querySelector('.mask').style.display = 'block'
        this.$refs.quickCreate.visible = true
    },
    // 打开自定义创建靶场
    customAdd() {
        this.isAdd = true
        document.querySelector('.mask').style.display = 'block'
        this.$refs.customCreate.visible = true
    },
    getDeployStatus(rangeItem, deploy) {
        if (rangeItem.target_deploy_statuses.length > 0) {
            return rangeItem.target_deploy_statuses[0][deploy]
        } else {
            return '--'
        }
    },
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.page=1
        this.size=val
        this.query()
    },
    handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.page=val
        this.query()
    }
  }
}
</script>

<style lang='less' scoped>
    .range-manage{
        width: 100%;
        height: 100%;
        float: right;
        position: relative; /* 确保相对定位生效 */

        .show{
            width: 95%;
            height: 95%;
            position: absolute; /* 绝对定位 */
            top: 50%; /* 向下偏移50% */
            left: 50%; /* 向右偏移50% */
            transform: translate(-50%, -50%); /* 回移50% */
            background-image:url('../../img/backgroundFourCorner.png');
            background-repeat: no-repeat; /* 可选，防止图像重复 */
            background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
            .list{
                display:flex;
                flex-direction: row;
                justify-content: flex-start;
                flex-wrap: wrap;
                align-content: flex-start;
                width: 95%;
                height: 84%;
                margin-left: 2.5%;
                .single:hover{
                    border: 1px solid #159dd3;
                }
                .single{
                    width: 32%;
                    height: 23.5%;
                    border-radius: 8px;
                    border: 1px solid rgba(186, 208, 241, 0.10);
                    background: rgba(25, 33, 61, 0.40);
                    margin-left: 1.2%;
                    margin-bottom: 0.9%;
                    padding: 20px;
                    display: inline-block;
                    .title{
                        text-align: left;
                        .gOsY{
                            width: 15px;
                            height: 10px;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            margin-left: 2%;
                            background-color: rgba(121, 175, 122, 0.3);
                            color: #36af04;
                        }
                        .gOsN{
                            width: 15px;
                            height: 10px;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            margin-left: 2%;
                            background-color: rgba(207, 172, 93, 0.3);
                            color: #af8109;
                        }
                    }
                    .container{
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        margin: 10px 0 10px 0;
                        .row {
                            display: flex;
                            padding-bottom: 10px;
                        }

                        .cell {
                            flex-grow: 1;
                            color: rgba(255, 255, 255, 0.6);
                            border: none;
                            text-align: left;
                        }

                        .cell.small {
                            flex-basis: 33.5%;
                        }

                        .cell.large {
                            flex-basis: 66.5%;
                        }
                    }
                    .buttons{
                        text-align: left;

                        .glBut{
                            width: 80px;
                            height: 30px;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            // margin-left: 2%;
                            background-color: rgba(14, 61, 138, 0.50);
                            color: #02DDEA;
                        }
                    }
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
    }
</style>