<template>
    <div class="task-section">
        <div class="task-box">
            <div class="header">
                <span>任务列表</span>
                <img @click="addTask" src="../../../../../img/icon/batchCollectBtn.png" alt="" style="width: 194px; height: 40px;">
            </div>
            <div class="content">
                <el-table
                    class="main-table styleTable"
                    ref="multipleTable"
                    v-loading="loading"
                    height="230px"
                    style="width: 100%;"
                    :data="tableData"
                    tooltip-effect="dark"
                    highlight-current-row
                    @expand-change="handleExpandChange"
                >
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-table
                                class="main-table styleTable"
                                ref="multipleTable"
                                v-loading="loading"
                                height="100%"
                                style="width: 100%; margin: 5px 20px;"
                                :data="taskNodeList"
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
                                min-width="100"/>                       
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
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="create_time"
                                label="创建开始时间"
                                min-width="100"
                            >
                            <template slot-scope="scope">
                                {{ scope.row.create_time | formatDate }}
                            </template>
                            </el-table-column>
                                <el-table-column
                                align="center"
                                prop="complete_time"
                                label="创建完成时间"
                                min-width="100"
                            >
                            <template slot-scope="scope">
                                {{ scope.row.complete_time | formatDate }}
                            </template>
                            </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center" 
                        prop="id"
                        label="id"
                        width="60"/>
                    <el-table-column 
                        align="center"
                        prop="task_name"
                        label="任务名称"
                        min-width="100"/>
                    <el-table-column 
                        align="center"
                        prop="traffic_collect_rule_id"
                        label="采集规则"
                        min-width="100"/>                       
                    <el-table-column
                        align="center"
                        prop="collecting"
                        label="任务状态"
                        min-width="80"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.collecting ? (scope.row.collecting === true ? '正在采集' : '采集失败') : '采集完成' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="start_collect_time"
                        label="开始时间"
                        min-width="110"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.start_collect_time | formatTime }}
                        </template>
                    </el-table-column>
                        <el-table-column
                        align="center"
                        prop="end_collect_time"
                        label="结束时间"
                        min-width="110"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.end_collect_time | formatTime }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作"
                        min-width="300"
                    >
                        <template slot-scope="scope">
                            <el-button type="text" size="medium" :loading="startLoading" @click="startTask(scope.row)">开始</el-button>
                            <el-button type="text" size="medium" :loading="stopLoading" @click="endTask(scope.row)">结束</el-button>
                            <el-button type="text" size="medium" @click="editTask(scope.row)">修改</el-button>
                            <el-button type="text" size="medium" @click="delTask(scope.row)">删除</el-button>
                            <!-- <el-button type="text" size="medium" @click="viewNode(scope.row)">查看节点</el-button> -->
                            <el-button type="text" size="medium" @click="downloadPack(scope.row)">下载pcap包</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="mask"></div>
        <TaskForm
            ref="taskForm"
            :node-list="nodeList"
            :is-add="isAdd"
            :target_id="target_id"
            @refresh="init">
        </TaskForm>
        <DownloadPack
            ref="downloadPack"
            @refresh="init">
        </DownloadPack>
    </div>  
    </template>
    
    <script>
    import TaskForm from './module/TaskForm'
    import DownloadPack from './module/DownloadPack'
    export default {
        name: 'Console',
        components: { TaskForm, DownloadPack },
        props: {
            target_id: {
                typeof: String,
                default: 0
            },
            nodeList: {
                typeof: Array,
                require: true
            },
        },
        data() {
            return {
                tableData: [],
                taskNodeList: [],
                isAdd: true,
                visible:false,
                loading: false,
                startLoading: false,
                stopLoading: false
            }
        },
        created() {
            this.init()
        },
        methods: {
            init() {
                const reqParams = {
                    page: 1,
                    size: 99,
                }
                this.loading = true
                this.$axios.get(this.$http.api.getTaskList, reqParams).then(res => {
                    if (res.code == 200 || res.code == "OK") {
                        // this.total = res?.result?.total
                        this.tableData = res?.result?.items
                        this.tableData.map(item => {
                            this.$set(item, 'delLoading', false)
                            return item
                        })
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    this.loading = false
                })
            },
            // 创建批量采集流量任务
            addTask() {
                this.isAdd = true
                document.querySelector('.mask').style.display = 'block'
                this.$refs.taskForm.visible = true
            },
            // 编辑任务
            editTask(row) {
                this.isAdd = false
                this.$refs.taskForm.task_id = row.id ?? ''
                this.$refs.taskForm.form.task_name = row.task_name ?? ''
                this.$refs.taskForm.form.task_description = row.task_description ?? ''
                this.$refs.taskForm.form.node_list = row.node_list ?? []
                this.$refs.taskForm.form.traffic_collect_rule_id = row.traffic_collect_rule_id
                this.$refs.taskForm.form.filter_noise = row.filter_noise ?? ''
                this.$refs.taskForm.visible = true
            },
            // 开始
            startTask(row) {
                const reqParams = {
                    task_id: row.id,
                    command: 'start'
                }
                this.startLoading = true
                this.$axios.get(this.$http.api.taskStartStop, reqParams).then(res => {
                    if (res.code == 200 || res.code == "OK") {
                        this.$notify({
                            title: '开始统计流量',
                            type: 'success',
                            duration: 2500
                        })
                    }
                }).catch(err => {
                    console.log(err)
                    this.startLoading = false
                }).finally(() => {
                })
            },
            // 结束
            endTask(row) {
                const reqParams = {
                    task_id: row.id,
                    command: 'stop'
                }
                this.stopLoading = true
                this.$axios.get(this.$http.api.taskStartStop, reqParams).then(res => {
                    if (res.code == 200 || res.code == "OK") {
                        this.startLoading = false
                        this.$notify({
                            title: '结束统计流量',
                            type: 'success',
                            duration: 2500
                        })
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    setTimeout(() => {
                        this.stopLoading = false
                        this.init()
                    }, 5 * 1000)
                }) 
            },

            // 删除任务
            delTask(row) {
                this.$confirm('此操作将永久删除该任务, 是否继续?', '确认删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.del(row)
                }).catch(() => {
                    this.$notify({
                        title: '已取消删除',
                        type: 'success',
                        duration: 2500
                    })        
                });
            },
            del(row) {
                const url = this.$http.api.trafficTask + '/' + row.id
                row.delLoading = true
                this.$axios.delete(url, {delete_minio: true}).then(res => {
                    if (res.code == 200 || res.code == "OK") {
                        this.$notify({
                            title: '删除任务成功',
                            type: 'success',
                            duration: 2500
                        })
                        this.init()
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    row.delLoading = false
                })
            },
            // 展开行查看节点
            handleExpandChange(row, expandedRows) {
                this.getTaskNodeList(row)
            },
            // // 查看节点
            // viewNode(row) {
            //     this.getTaskNodeList(row)
            // },
            // 获取节点列表
            getTaskNodeList(row) {
                const params = {
                    page:1,
                    size: 99,
                    task_id: row.id
                }
                this.$axios.get(this.$http.api.getTrafficNodes, params).then(res => {
                    if (res.code == 200 || res.code == "OK") {
                        this.taskNodeList = res?.result?.items
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 下载pcap包
            downloadPack(row) {
                this.$refs.downloadPack.task_id = row.id
                this.$refs.downloadPack.init()
                document.querySelector('.mask').style.display = 'block'
                this.$refs.downloadPack.visible = true
            }
        }
    }
    </script>
    
    <style lang="less" scoped>
    .task-section{
        // height: 100%;
        .styleTable {
            background-color: transparent !important;
        }
        .base-input {
            width: 100%;
            float: left;
            margin-top: 2%;
            text-align: center;     
        }
        .label-span {
            margin-right: 3%;
            display: inline-block;
            width: 60px;
            text-align: right;
        }
        .but-color {
            background-color: #02DDEA !important;
        }
        .task-box{
            width: 100%;
            min-height: 45%;
            display: flex;
            flex-direction: column;
            padding: 2%;
            .header{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                width: 100%;
                height: 50px;
                line-height: 50px;
                margin-bottom: 1%;
            }
            .content {
                flex: 1;
                ::v-deep .el-textarea__inner {
                    background-color: #1A2648;
                }
            }
        }
        ::v-deep .el-table tbody tr>td {
            // background: rgba(25, 33, 61, 0.5) !important;
            background-color: #0A162C !important;
        }
    }
    </style>