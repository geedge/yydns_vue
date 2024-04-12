<template>
    <div class="range-config-manage" ref="appRef">
        <div class="show">
            <Header
                :range-dict="rangeDict"
                :batch-deploy-loading="batchDeployLoading"
                :batch-del-loading="batchDelLoading"
                :batch-pipeline-loading="batchPipelineLoading"
                :disabled-batch-pipline="disabledBatchPipline"
                @addConfig="addConfig"
                @query="query"
                @batchDeploy="batchDeploy"
                @batchDel="batchDel"
                @batchPipeline="batchPipeline"
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
                    @cell-mouse-enter="cellEnter"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        align="center"
                        type="selection"
                        width="80"/>
                    <el-table-column
                        align="center" 
                        type="index"
                        label="序号"
                        width="80"/>
                    <el-table-column
                        align="center"
                        prop="tor_version"
                        label="Tor版本"
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
                        prop="replicas"
                        label="复本数"
                        min-width="100"/>
                    <el-table-column
                        align="center"
                        prop="service"
                        label="服务"
                        min-width="150"/>
                    <el-table-column
                        align="center"
                        prop="bandwidth"
                        label="宽带"
                        min-width="100"/>
                    <el-table-column
                        align="center"
                        prop="memory"
                        label="内存"
                        min-width="100"/>
                    <el-table-column
                        align="center"
                        prop="out_port"
                        label="映射端口"
                        min-width="100"/>
                    <el-table-column
                        align="center"
                        prop="has_deployed"
                        label="部署状态"
                        min-width="100"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.has_deployed ? '已部署' : '未部署' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="network_id"
                        label="网络"
                        min-width="100">
                        <template slot-scope="scope">
                            <el-popover
                                placement="top"
                                width="180"
                                trigger="hover"
                                :visible-arrow="false"
                                popper-class= "pop-con"
                                :ref="`popover1` + scope.$index">
                                <div v-if="popVisiable === true" style="text-align: center; margin: 0;">
                                    <p>国家：{{popoverData.country}}</p>
                                    <p>网络：{{popoverData.network}}</p>
                                </div>
                                <a 
                                    class="network"
                                    slot="reference"
                                    @mouseenter="openAction(scope.$index)"
                                    @mouseleave="cancelAction(scope.$index)"
                                >
                                    {{ `网络${scope.row.network_id}`}}
                                </a>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作"
                        min-width="300"
                    >
                        <template slot-scope="scope">
                            <el-button type="text" size="medium" :disabled="scope.row.delLoading" @click="edit(scope.row)">修改</el-button>
                            <el-button type="text" size="medium" :disabled="scope.row.has_deployed==true || scope.row.delLoading" :loading="scope.row.deployLoading" @click="deploy(scope.row)">部署</el-button>
                            <el-button type="text" size="medium" :loading="scope.row.delLoading" @click="del(scope.row)">删除</el-button>
                            <el-button type="text" size="medium" :disabled="scope.row.delLoading" :loading="scope.row.restartLoading" @click="restart(scope.row)">重启</el-button>
                            <el-button type="text" size="medium" :disabled="scope.row.pipeline_id===0 || scope.row.delLoading" :loading="scope.row.pipelineLoading" @click="pipeline(scope.row)">运行流水线</el-button>
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
            <ConfigForm
                ref="configForm"
                :is-add="isAdd"
                :target_id="target_id"
                :other-role="otherRole"
                :country-dict="countryDict"
                @refresh="init"
                @openRoleForm="openRoleForm"
                @clearRoleForm="clearRoleForm">
            </ConfigForm>
            <RoleForm
                ref="roleForm"
                v-model="otherRole"
                @submitOtherRole="submitOtherRole">
            </RoleForm>
        </div>
    </div>
</template>
<script>
import Header from './module/Header.vue'
import ConfigForm from './module/ConfigForm.vue'
import RoleForm from './module/RoleForm.vue'
import { getTargetsResponse } from './mock.js'
export default {
    name: "RangeConfigManage",
    components:{ Header, ConfigForm, RoleForm },
    // props:['fTag','fInput','fFrom','FIsConfigQuery'],
    data(){
        return{
            page: 1,
            size: 10,
            total: 0,
            isAdd: false,
            loading: false,
            target_id: '',
            otherRole: '',
            tableData: [],
            selectConfigIds: [],
            countryDict: [],
            rangeDict: [],
            batchDeployLoading: false,
            batchDelLoading: false,
            batchPipelineLoading: false,
            networkVisible: false,
            popoverData: {},
            popVisiable: false,
            roleDict:{
                da: '权威目录节点',
                client: '客户端节点',
                guard: '入口节点',
                relay: '路由节点',
                exit: '出口节点',
                onion: '洋葱服务节点',
            },
            disabledBatchPipline: false,
            delTimer: null,
            counter: 0,
            batchDelTimer: null,
            batchCounter: 0,
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
    created() {
        this.getCountryDict()
        this.getRangeDict()
    },
    destroyed() {
        if(this.delTimer) {
            clearInterval(this.delTimer)
            this.delTimer = null
        }
        if(this.batchDelTimer) {
            clearInterval(this.batchDelTimer)
            this.batchDelTimer = null
        }
        this.counter = 0
        this.batchCounter = 0
    },
    methods:{
        init(params={}) {
            // this.tableData = getTargetsResponse?.result?.items
            // this.total = getTargetsResponse?.result?.total

            // TODO: 暂时注释接口
            const reqParams = {
                page: this.page,
                size: this.size,
                ...params
            }
            if (this.target_id && this.target_id !== '') {
                reqParams.target_id = this.target_id
            }
            this.loading = true
            this.$axios.get(this.$http.api.getSettingList, reqParams).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.total = res?.result?.total
                    this.tableData = res?.result?.items
                    this.tableData.map(item => {
                        this.$set(item, 'deployLoading', false)
                        this.$set(item, 'delLoading', false)
                        this.$set(item, 'restartLoading', false)
                        this.$set(item, 'pipelineLoading', false)
                        return item
                    })
                    // 是否全部都没有流水线
                    this.disabledBatchPipline = this.tableData.findIndex(item => item.pipeline_id !== 0) === -1 ? true : false
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
        // 打开添加配置dialog
        addConfig() {
            this.isAdd = true
            this.$refs.configForm.getTorDict()
            this.$refs.configForm.getImageDict()
            document.querySelector('.mask').style.display = 'block'
            this.$refs.configForm.visible = true
        },
        // 当选择其它角色时，弹窗填写角色窗
        openRoleForm() {
            this.$refs.roleForm.visible = true
        },
        clearRoleForm() {
            this.otherRole = ''
        },
        // 编辑Form重新请求镜像字典
        submitOtherRole() {
            this.$refs.configForm.getImageDict()
        },
        // 批量部署
        batchDeploy() {
            if (this.selectConfigIds.length === 0) {
                this.$notify({
                    title: '请勾选要部署的数据！',
                    type: 'success',
                    duration: 2500
                })
                return
            }
            this.batchDeployLoading = true
            this.$axios.post(this.$http.api.batchDeply, {setting_id_list: this.selectConfigIds}, {target_id: this.target_id}).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.$notify({
                        title: '批量部署成功',
                        type: 'success',
                        duration: 2500
                    })
                    this.init()
                } else {
                    this.$notify({
                        title: res,
                        type: 'success',
                        duration: 2500
                    })
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.batchDeployLoading = false
            })      
        },
        // 批量删除
        batchDel() {
            if (this.selectConfigIds.length === 0) {
                this.$notify({
                    title: '请勾选要删除的数据！',
                    type: 'success',
                    duration: 2500
                })
                return
            }
            this.batchDelLoading = true
            this.$axios.delete(this.$http.api.asynBatchDel, {}, {setting_id_list: this.selectConfigIds}).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.init()
                    this.$notify({
                        title: res.message,
                        type: 'success',
                        duration: 2500
                    })
                    this.batchDelTimer = setInterval(() => {
                        this.getBatchTask(res?.result?.task_id || '')
                    },10 * 1000)
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.batchDelLoading = false
            })   
        },
        // 批量运行流水线
        batchPipeline() {
            if (this.selectConfigIds.length === 0) {
                this.$notify({
                    title: '请勾选要运行流水线的数据！',
                    type: 'success',
                    duration: 2500
                })
                return
            }
            this.batchPipelineLoading = true
            this.$axios.post(this.$http.api.batchPipeline, {setting_id_list: this.selectConfigIds}, {}).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.$notify({
                        title: '批量运行流水线成功',
                        type: 'success',
                        duration: 2500
                    })
                    this.init()
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.batchPipelineLoading = false
            })   
        },
        // 部署
        deploy(row) {
            row.deployLoading = true
            this.$axios.post(this.$http.api.singleDeploy, {}, {setting_id: row.id}).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.$notify({
                        title: '部署成功',
                        type: 'success',
                        duration: 2500
                    })
                    this.init()
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                row.deployLoading = false
            })          
        },
        // 删除
        del(row) {
            const url = this.$http.api.asynDelSetting + '/' + row.id
            const params = {
                user_id: row.user_id
            }
            row.delLoading = true
            this.$axios.delete(url, params).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    // this.init()
                    this.$notify({
                        title: res.message,
                        type: 'success',
                        duration: 2500
                    })
                    if (this.delTimer) {
                        clearInterval(this.delTimer)
                        this.delTimer = null
                        this.counter = 0
                    }
                    this.delTimer = setInterval(() => {
                        this.getTask(res?.result?.task_id || '')
                    },10 * 1000)
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                // row.delLoading = false
            })
        },
        //  重启
        restart(row) {
            row.restartLoading = true
            this.$axios.post(this.$http.api.singleDeploy, {}, { setting_id: row.id }).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.$notify({
                        title: '重启成功',
                        type: 'success',
                        duration: 2500
                    })
                    this.init()
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                row.restartLoading = false
            })                
        },
        // 运行流水线
        pipeline(row) {
            row.pipelineLoading = true
            this.$axios.post(this.$http.api.pipeline, {}, { setting_id: row.id }).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.$notify({
                        title: '运行流水线成功',
                        type: 'success',
                        duration: 2500
                    })
                    this.init()
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                row.pipelineLoading = false
            })   
        },
        // 修改
        edit(row) {
            this.isAdd = false
            this.$refs.configForm.setting_id = row.id
            this.$refs.configForm.form.role = row.role
            this.$refs.configForm.form.tor_version = row.tor_version
            this.$refs.configForm.form.image_id = row.image_id
            this.$refs.configForm.form.replicas = row.replicas
            this.$refs.configForm.form.bandwidth = row.bandwidth
            this.$refs.configForm.form.memory = row.memory
            this.$refs.configForm.form.service = row.service
            this.$refs.configForm.form.out_port = row.out_port
            this.$refs.configForm.form.or_port = row.or_port
            this.$refs.configForm.form.dir_port = row.dir_port
            this.$refs.configForm.form.socks_port = row.socks_port
            this.$refs.configForm.form.control_port = row.control_port
            this.$refs.configForm.form.country_id = row.country_id
            this.$refs.configForm.form.network_id = row.network_id
            this.$refs.configForm.form.direct = row.direct
            this.$refs.configForm.form.start_tcpdump = row.start_tcpdump
            if(row.start_tcpdump) {
                this.$refs.configForm.form.deployType = 'start'
            } else {
                if(row.direct) {
                    this.$refs.configForm.form.deployType = 'direct'
                } else {
                    this.$refs.configForm.form.deployType = 'only'
                }
            }
            this.$refs.configForm.getTorDict()
            this.$refs.configForm.getImageDict()
            this.$refs.configForm.getNetworkDict()
            document.querySelector('.mask').style.display = 'block'
            this.$refs.configForm.visible = true
        },
        // 获取国家字典
        getCountryDict() {
            const params = {
                page: 1,
                size: 99
            }
            this.$axios.get(this.$http.api.getCountryDict, params).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.countryDict = res?.result?.items.map(item => {
                        return {
                            label: item.country_name,
                            value: item.id
                        }
                    })
                }
            }).catch(err => {
                console.log(err)
            })  
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
        // 处理选中的数据
        handleSelectionChange(selectData) {
            this.selectConfigIds = selectData.map(item => {
                return item.id
            })
        },
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
        },
        // 获取网络
        cellEnter(row, column){
            if(column.label === "网络"){
                this.popoverData = {}
                this.popVisiable = false
                // this.loading = true
                const reqParams = {
                    network_id: row.network_id,
            }
                this.$axios.get(this.$http.api.getNetwork, reqParams).then(res => {
                    if (res.code == 200 || res.code == "OK") {
                        this.popoverData = res.result
                        this.popVisiable = true;
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    // this.loading = false
                })
            }
        },
        cancelAction(index){
            let refName = "popover1" + index;
            this.$refs[refName].doClose();
        },
        openAction(index){
            let refName = "popover1" + index;
            this.$refs[refName].doShow();
        },
        // 获取任务进度
        getTask(task_id) {
            const url = this.$http.api.task + '/' + task_id
            this.$axios.get(url, {}).then(res => {
                if(res.task_status !== 'PENDING' && res.task_status !== 'STARTED') {
                    if (res?.task_result?.code === 500 || res?.task_result?.message === 'false') {
                        this.$notify({
                            title: res?.task_result?.result || `${res.task_id}任务执行失败`,
                            type: 'success',
                            duration: 2500
                        })
                    } else {
                        this.$notify({
                            title: res?.task_result?.result || `${res.task_id}任务执行完毕`,
                            type: 'success',
                            duration: 2500
                        })
                    }
                    clearInterval(this.delTimer)
                    this.delTimer = null
                    this.counter = 0
                    this.init()
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
        // 获取任务进度
        getBatchTask(task_id) {
            const url = this.$http.api.task + '/' + task_id
            this.$axios.get(url, {}).then(res => {
                if(res.task_status !== 'PENDING' && res.task_status !== 'STARTED') {
                    if (res?.task_result?.code === 500 || res?.task_result?.message === 'false') {
                    this.$notify({
                        title: res?.task_result?.result || `${res.task_id}任务执行失败`,
                        type: 'success',
                        duration: 2500
                    })
                } else {
                    this.$notify({
                        title: res?.task_result?.result || `${res.task_id}任务执行完毕`,
                        type: 'success',
                        duration: 2500
                    })
                }
                    clearInterval(this.batchDelTimer)
                    this.batchDelTimer = null
                    this.batchCounter = 0
                    this.init()
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.batchCounter++
                if (this.batchCounter >= 30) {
                    clearInterval(this.batchDelTimer)
                    this.batchDelTimer = null
                    this.batchCounter = 0
                    this.init()
                }
            })
        }
    }
}

</script>

<style lang='less' scoped="scoped">
.custom-table {
    width: 100%;
    height: 100%;
}
.range-config-manage{
    width: 100%;
    height: 100%;
    /*background-color: #010f4e;*/
    // background-color: rgba(255, 25, 49, 0.4);
    float: right;
    position: relative; /* 确保相对定位生效 */

    .show{
        width: 95%;
        height: 95%;
        /*background-color: #67c23a;*/
        position: absolute; /* 绝对定位 */
        top: 50%; /* 向下偏移50% */
        left: 50%; /* 向右偏移50% */
        transform: translate(-50%, -50%); /* 回移50% */
        background-image:url('../../img/backgroundFourCorner.png');
        background-repeat: no-repeat; /* 可选，防止图像重复 */
        background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
        /*background-size: cover; !* 宽度为100%，高度自适应保持宽高比 *!*/

        /*display: flex; !* 将容器设置为 Flex 容器 *!*/
        /*justify-content: center; !* 水平居中子元素 *!*/
        /*align-items: center; !* 垂直居中子元素 *!*/

        .list{
            width: 95%;
            height: 84%;
            margin-left: 2.5%;
            overflow-y: auto;
            overflow-y: scroll;
            overflow-x: hidden;
            border: none;
            ::v-deep .network {
                float: right;
                cursor: pointer;
                font-size: 14px;
                color: #857BFF;
                text-decoration: none; /* 取消默认的下划线 */
            }
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
}
</style>
