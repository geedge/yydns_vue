<template>
    <div class="rule-section">
        <div class="task-box">
            <div class="header">
                <span>规则列表</span>
                <img @click="addRule" src="../../../../../img/icon/addTrafficBtn.png" alt="" style="width: 194px; height: 40px;">
            </div>
            <div class="content">
                <el-table
                    class="main-table styleTable"
                    ref="multipleTable"
                    height="230px"
                    style="width: 100%;"
                    :data="tableData"
                    tooltip-effect="dark"
                    highlight-current-row
                >
                    <el-table-column
                        align="center" 
                        prop="id"
                        label="id"
                        width="100"/>
                    <el-table-column 
                        align="center"
                        prop="rule_name"
                        label="规则名称"
                        min-width="130"/>
                    <el-table-column
                        align="center"
                        prop="rule"
                        label="具体规则"
                        min-width="130"
                    >
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="update_time"
                        label="添加时间"
                        min-width="130"
                    >
                    <template slot-scope="scope">
                        {{ scope.row.update_time | formatDate }}
                    </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="use_count"
                        label="使用次数"
                        min-width="130"/>
                    <el-table-column
                        align="center"
                        label="操作"
                        min-width="300"
                    >
                        <template slot-scope="scope">
                            <el-button type="text" size="medium" @click="editRule(scope.row)">修改</el-button>
                            <el-button type="text" size="medium" :loading="scope.row.delLoading" @click="delRule(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="mask"></div>
        <RuleForm ref="ruleForm" :is-add="isAdd" @refresh="init"/>
    </div>  
    </template>
    
    <script>
    import RuleForm from './module/RuleForm'
    export default {
        name: 'RuleList',
        components: { RuleForm },
        props: {},
        data() {
            return {
                tableData: [],
                isAdd: true,
                visible:false,
                loading: false
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
                this.$axios.get(this.$http.api.getRuleList, reqParams).then(res => {
                    if (res.code == 200 || res.code == "OK") {
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
            // 添加流量采集规则
            addRule() {
                this.isAdd = true
                this.$refs.ruleForm.visible = true
            },
            // 编辑规则
            editRule(row) {
                this.isAdd = false
                this.$refs.ruleForm.rule_id = row.id
                this.$refs.ruleForm.form.rule_name = row.rule_name
                this.$refs.ruleForm.form.rule = row.rule
                this.$refs.ruleForm.visible = true
            },
            // 删除规则
            delRule(row) {
                this.$confirm('此操作将永久删除该规则, 是否继续?', '确认删除', {
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
                const url = this.$http.api.rule + '/' + row.id
                row.delLoading = true
                this.$axios.delete(url, {}).then(res => {
                    if (res.code == 200 || res.code == "OK") {
                        this.$notify({
                            title: '删除成功',
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
            // 关闭
            close() {
                document.querySelector('.mask').style.display = 'none'
                this.visible = false
                this.resetForm()         
            }
        }
    }
    </script>
    
    <style lang="less" scoped>
    .rule-section{
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
    }
    </style>