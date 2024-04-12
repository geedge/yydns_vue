<template>
<div class="console-dialog" v-if="visible">
    <!-- 在此处指定弹窗的样式和内容 -->
    <i class="el-icon-close" @click="close"></i>
    <div class="tag">
        <el-tag class="tags" :style="{'color': (tag==='添加任务') ? '#f8fdff': '#565e6e'}">添加任务</el-tag>
        <el-tag class="tags" :style="{'color': (tag==='被操作节点') ? '#f8fdff': '#565e6e'}">被操作节点</el-tag>
        <el-tag class="tags" :style="{'color': (tag==='操作') ? '#f8fdff': '#565e6e'}">操作</el-tag>
    </div>
    <div class="basic-box" v-if="tag==='添加任务'">
        <el-form
            ref="addTaskForm"
            :model="form"
            :rules="taskRules"
            label-width="150px"
            class="basic-form"
            size="small"
        >
            <el-row>
                <el-col :span="12" :offset="6">
                    <el-form-item label="任务名称" prop="task_name">
                        <el-input v-model="form.task_name" placeholder="请输入任务名称"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :offset="6">
                    <el-form-item label="任务描述" prop="task_description">
                        <el-input v-model="form.task_description" placeholder="请输入任务描述">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <footer class="anDiv">
            <el-button class="glBut" type="primary" @click="close">取消</el-button>
            <el-button class="glBut but-color" type="primary" @click="updateTag('被操作节点', true)">下一步</el-button>
        </footer>
    </div>
    <div class="table-box" v-if="tag==='被操作节点'">
        <div class="tip-message">请勾选多个节点</div>
        <div class="content">
            <el-table
                class="main-table styleTable"
                ref="multipleTable"
                height="100%"
                style="width: 100%;"
                :data="nodeList"
                tooltip-effect="dark"
                highlight-current-row
                @selection-change="handleSelectionNode"
            >
                <el-table-column
                    align="center"
                    type="selection"
                    width="80"/>
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
        </div>
        <div class="anDiv">
            <div>
                <el-button class="glBut" type="primary" @click="close">取消</el-button>
                <el-button class="glBut but-color" type="primary" @click="updateTag('添加任务')">上一步</el-button>
                <el-button class="glBut but-color" type="primary" @click="updateTag('操作', true)">下一步</el-button>
            </div>
        </div>

    </div>
    <div class="basic-box" v-if="tag==='操作'">
        <el-form
            ref="operateForm"
            :model="form"
            :rules="oprateRules"
            label-width="150px"
            class="basic-form"
            size="small"
        >
            <el-row>
                <el-col :span="12" :offset="6">
                    <el-form-item label="选择规则" prop="traffic_collect_rule_id">
                        <el-select v-model="form.traffic_collect_rule_id" placeholder="请选择规则" @focus="getRuleList">
                            <el-option
                                    v-for="item in ruleDict"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :offset="6">
                    <el-form-item label="是否过滤噪音流量" prop="filter_noise">
                        <el-radio-group v-model="form.filter_noise">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="anDiv">
            <div>
                <el-button class="glBut" type="primary" @click="close">取消</el-button>
                <el-button class="glBut but-color" type="primary" @click="updateTag('被操作节点')">上一步</el-button>
                <el-button class="glBut but-color" type="primary" @click="submit" :loading="loading">确认</el-button>
            </div>
        </div>
    </div>
</div>  
</template>

<script>
export default {
    name: 'TaskForm',
    props: {
        isAdd: {
        typeof: Boolean,
        required: true
        },
        nodeList: {
            typeof: Array,
            require: true
        },
        target_id: {
            typeof: String,
            required: true
        }
    },
    data() {
        return {
            visible:false,
            loading: false,
            tag:"添加任务",
            task_id: '',
            ruleDict: [],
            form: {
                task_name: '', // 任务名称
                task_description: '', // 任务描述
                node_list: [], // 节点列表
                traffic_collect_rule_id: null, // 选择规则
                filter_noise: true, // 是否过滤噪音流量
            },
            taskRules: {
                task_name:[
                    { required: true, message: '请输入任务名称', trigger: 'blur' }
                ],
                task_description: [
                    { required: true, message: '请输入任务描述', trigger: 'blur' }
                ]
            },
            oprateRules: {
                traffic_collect_rule_id: [
                    { required: true, message: '请选择规则', trigger: 'blur' }
                ],
                filter_noise: [
                    { required: true, message: '请选择是否过滤噪音流量', trigger: 'blur' }
                ]
            },
            setting_id: '',
            torDict: [],
            networkDict: [],
            imageDict: []
        }
    },
    created() {
        // 获取规则字典
        this.getRuleList()
    },
    methods: {
        // 选择添加任务
        handleSelectionNode(selectRows) {
            this.form.node_list = selectRows.map(row => {
                return row.id
            })
        },
        // 关闭
        close() {
            document.querySelector('.mask').style.display = 'none'
            this.visible = false
            this.tag = '添加任务'
            this.resetForm()         
        },
        // 重置
        resetForm() {
            this.form = {
                task_name: '', // 任务名称
                task_description: '', // 任务描述
                node_list: [], // 节点列表
                traffic_collect_rule_id: null, // 选择规则
                filter_noise: true, // 是否过滤噪音流量
            }
        },
        // 选择哪个页面
        updateTag(val, isValid){
            if (val === '被操作节点' && isValid) {
                this.$refs.addTaskForm.validate((valid) => {
                    if (valid) {
                        this.tag=val
                    }
                })
            } else if(val === '操作' && isValid) {
                if (this.form.node_list.length > 0) {
                    this.tag=val
                } else {
                    this.$notify({
                    title: '请勾选要被操作的节点！',
                    type: 'success',
                    duration: 2500
                })
                    return
                }
            } else  {
                this.tag=val
            }
        },
        // 获取规则列表
        getRuleList() {
            const reqParams = {
                page: 1,
                size: 99,
            }
            this.loading = true
            this.$axios.get(this.$http.api.getRuleList, reqParams).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.ruleDict = res?.result?.items.map(item => {
                        return {
                            label: item.rule_name,
                            value: item.id
                        }
                    })
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.loading = false
            })
        },
        // 提交数据
        submit() {
            this.$refs.operateForm.validate((valid) => {
                if (valid) {
                    if (this.isAdd) {
                        this.add()
                    } else {
                        this.edit()
                    }
                }
            })
        },
        add () {
            this.loading = true
            const url = this.$http.api.trafficTask
            this.$axios.post(url, this.form).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.resetForm()
                    this.close()
                    this.$emit('refresh')
                    this.$notify({
                        title: '创建任务成功',
                        type: 'success',
                        duration: 2500
                    })
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.loading = false
            })
        },
        edit() {
            this.loading = true
            const url = this.$http.api.trafficTask + `/${this.task_id}`
            this.$axios.put(url, this.form).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.resetForm()
                    this.close()
                    this.$emit('refresh')
                    this.$notify({
                        title: '编辑任务成功',
                        type: 'success',
                        duration: 2500
                    })
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.loading = false
            })
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
        }
    }
}
</script>

<style lang="less" scoped>
.console-dialog{
    z-index: 997;
    width: 1171px;
    height: 705px;
    position: absolute; /* 绝对定位 */
    top: 50%; /* 向下偏移50% */
    left: 50%; /* 向右偏移50% */
    transform: translate(-50%, -50%); /* 回移50% */
    background-image:url('../../../../../../img/background/NodeListDialog.svg');
    background-repeat: no-repeat; /* 可选，防止图像重复 */
    background-size: cover; /* 宽度为100%，高度自适应保持宽高比 */

    .el-icon-close{
        float: right; 
        padding-right: 7%;
        padding-top: 1.8%
    }
    .tag{
        margin-left: 9%;
        .tags{
            margin-right: 5%;
            margin-top: 1%;
            font-size: 23px;
            border: none;
            background-color: transparent !important;
            color: #565e6e;
        }
    }
    .basic-form {
        margin-top: 50px;
        text-align: left;
        ::v-deep .el-select {
            width: 100%;
        }
    }
    .but-color {
        background-color: #02DDEA !important;
    }

    .basic-box{
        .anDiv{
            width: 100%;
            float: left;
            margin-top: 450px;
            text-align: center;
            .glBut{
                width: 90px;
                height: 30px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-left: 5%;
                margin-right: 5%;
                background-color: rgba(24, 133, 234, 0.2);
                color: #1b7cc4;
            }

        }
    }

    .table-box{
        width: 100%;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        padding: 2%;
        .tip-message{
            width: 100%;
            height: 50px;
            text-align: left;
            padding: 11px 0 12px 20px;
            font-size: 20px;
            background-color: #1A2648;
            border-radius: 4px;
            margin-bottom: 2%;
        }
        .content {
            flex: 1;
            display: flex;
            flex-direction: row;
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
        .anDiv{
            width: 100%;
            float: left;
            margin-bottom: 7%;
            text-align: center;
            .glBut{
                width: 90px;
                height: 30px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-left: 5%;
                margin-right: 5%;
                background-color: rgba(24, 133, 234, 0.2);
                color: #1b7cc4;
            }
        }
    }
}
</style>