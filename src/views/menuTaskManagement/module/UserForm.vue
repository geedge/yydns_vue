<template>
    <div 
        class="user-dialog" 
        v-if="visible"
    >
<!--        <span class="dialog-title">{{ title }}</span>-->
        <span class="dialog-title">任务创建</span>
        <!-- 在此处指定弹窗的样式和内容 -->
        <i class="el-icon-close" style="float: right; padding-right: 8%;padding-top: 3%" @click="close"></i>
        <el-form
            ref="userForm"
            :model="form"
            :rules="rules"
            label-width="150px"
            class="user-form"
        >
            <el-row style="margin-left: 25%;margin-top: 8%">
                <el-col :span="15">
                    <el-form-item label="任务名称" prop="name">
                        <el-input v-model="form.name"  placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="任务目标" prop="ip">
                        <div style="display: flex;margin-right: 5px;">
                            <el-input v-model="form.ip"  placeholder="请输入目标IP"></el-input>
                            <el-button type="primary" style="margin-left: 1%" @click="getTagsByIP(form.ip),agencyLabel=true">确认</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="目标信息" prop="role_id" v-if="agencyLabel && roleDict.length>0">
                        <el-tag class="el-tag_en" v-for="i in this.roleDict" style="margin-right: 1%">{{i}}</el-tag>
                    </el-form-item>
                    <el-form-item label="执行代理" prop="agencyChange">
                        <el-select v-model="form.agencyChange" placeholder="代理选择">
                            <el-option
                                    v-for="item in agencyChange"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="目标域名" prop="domain">
                        <el-input v-model="form.domain"  placeholder="www.google.com"></el-input>
                    </el-form-item>
                    <el-form-item label="期望注入记录" prop="inject">
                        <el-input v-model="form.inject"  placeholder="域名记录类型+域名记录"></el-input>
                    </el-form-item>
                    <el-form-item label="期望策略" prop="strategy">
                        <el-select v-model="form.strategy" placeholder="自动选择">
                            <el-option
                                    v-for="item in strategy"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-divider content-position="center">附加选项</el-divider>
                    <el-form-item label="状态感知方式" prop="stateAwareMode">
                        <el-select v-model="form.stateAwareMode" placeholder="自动选择">
                            <el-option
                                    v-for="item in stateAwareMode"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="策略切换时间" prop="switchoverTime">
                        <el-input v-model="form.switchoverTime"  placeholder="单位：分钟"></el-input>
                    </el-form-item>
                    <el-form-item label="任务执行时限" prop="executeTime">
                        <el-input v-model="form.executeTime"  placeholder="单位：分钟"></el-input>
                    </el-form-item>
                    <el-form-item label="运行配置" prop="operationalConfiguration">
                        <el-select v-model="form.operationalConfiguration" placeholder="运行配置选择">
                            <el-option
                                    v-for="item in operationalConfiguration"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                </el-col>
            </el-row>
        </el-form>
        <div class="submit-footer" style="margin-top: 1%">
            <div>
                <el-button class="glBut" type="primary" @click="resetForm">重置</el-button>
                <el-button class="glBut but-color" type="primary" @click="submit" :loading="loading">确认创建</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UserForm',
    // props: ['isAdd', 'permissionDict'],
    data() {
        return {
            agencyLabel:false,
            visible: false,
            loading: false,
            title: '任务创建',
            form: {
                name:"", //代理名称
                ip:"",  //任务目标
                agencyChange:"", //执行代理
                domain:"", //目标域名
                inject:"", //期望注入记录
                strategy:"",//策略
                stateAwareMode:"",//状态感知方式
                switchoverTime:"", //策略切换时限
                executeTime:"", //任务执行时限
                operationalConfiguration:"",//运行配置
            },
            role_id: '',
            rules: {
                name: [
                    // { required: true, message: '请输入任务名称', trigger: 'blur' },
                    { message: '请输入任务名称', trigger: 'blur' },
                    { max: 50, message: '任务名称长度不能超过50个字符', trigger: 'blur' }
                ],
                permissions: [
                    { required: true, message: '请选择权限', trigger: 'change' }
                ],

            },
            roleDict:[],
            strategy:[
                { value: 'auto', label: '自动选择', type: 'success' },
                { value: 'ddos', label: '拒绝服务', type: 'warning' },
                { value: 'sjqp', label: '数据欺骗', type: 'warning' },
            ],
            agencyChange:[
                { value: '中国北京', label: '中国北京', type: 'success' },
                { value: '美国纽约', label: '美国纽约', type: 'warning' },
            ],
            stateAwareMode:[
                { value: 'auto', label: '自动选择', type: 'success' },
                { value: 'tcp', label: 'TCP时延', type: 'warning' },
                { value: 'icmp', label: 'ICMP/v6', type: 'danger' },
                { value: 'dns', label: 'DNS解析时延', type: 'danger' },
                { value: 'record', label: '记录正确性验证', type: 'danger' },
            ],
            operationalConfiguration:[
                { value: 'now', label: '立刻执行', type: 'success' },
                { value: 'man', label: '手动执行', type: 'warning' },
            ]


        }
    },
    methods: {
        getTagsByIP(val){
            let data={
                "ip":val?val:'1.1.1.1'
            }
            this.$axios.get(this.$http.api.targetQueryList,data).then(res=>{
                if(res.code===200){
                    this.roleDict=res?.data[0]?.protect
                }
            }).catch(err=>{
                console.log(err)
            })


        },
        close() {
            this.resetForm()
            document.querySelector('.mask').style.display = 'none'
            this.visible = false
        },
        submit() {
            let data={
                "target":this.form.domain,
                "agent":this.form.agencyChange,
                "name":this.form.name,
                "target_domain":"",
                "target_rr":this.form.inject,
                "policy_time":this.form.switchoverTime,
                "run_time":this.form.executeTime,
                "run_flag":this.form.operationalConfiguration,
                "policy":this.form.strategy,
                "scan":this.form.stateAwareMode,
            }
            console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
            console.log(data)
            console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
            this.$axios.post(this.$http.api.taskCreate,data).then(res=>{
                if(res.code===200){
                    this.$message.success('任务创建成功!')
                }else {
                    this.$message.error(res.msg)
                }
            }).catch(err=>{
                console.log(err)
            })

        },
        add () {
            this.loading = true
            const url = this.$http.api.addRole
            this.$axios.post(url, this.form).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.resetForm()
                    this.close()
                    this.$emit('refresh')
                    this.$notify({
                        title: '创建角色成功',
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
            const url = this.$http.api.editRole + `/${this.role_id}`
            this.$axios.put(url, this.form.permissions).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.resetForm()
                    this.close()
                    this.$emit('refresh')
                    this.$notify({
                        title: '编辑角色成功',
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
        resetForm() {
            this.agencyLabel=false,
            this.roleDict=[],
            this.form = {
                name:"", //代理名称
                ip:"",  //任务目标
                agencyChange:"", //执行代理
                domain:"", //目标域名
                inject:"", //期望注入记录
                strategy:"",//策略
                stateAwareMode:"",//状态感知方式
                switchoverTime:"", //策略切换时限
                executeTime:"", //任务执行时限
                operationalConfiguration:"",//运行配置
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .user-dialog{
        width: 963px;
        height: 863px;
        position: absolute; /* 绝对定位 */
        top: 50%; /* 向下偏移50% */
        left: 50%; /* 向右偏移50% */
        transform: translate(-50%, -50%); /* 回移50% */
        /*background-image:url('../../../img/background/dialog520-363.svg');*/
        background-image:url('../../../img/tjpz.svg');
        background-repeat: no-repeat; /* 可选，防止图像重复 */
        background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
        .dialog-title {
            font-size: 20px;
            float: left;
            margin: 11px 0 11px 35px;
        }
        .user-form {
            margin-top: 70px;
            text-align: left;
            ::v-deep .el-form-item__content {
                line-height: 15px;
            }
        }
        .submit-footer{
            width: 100%;
            float: left;
            margin-top: 50px;
            text-align: center;
            .glBut{
                width: 90px;
                height: 30px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-left: 2%;
                background-color: rgba(24, 133, 234, 0.2);
                color: #1b7cc4;
            }
            .but-color {
                background-color: #02DDEA;
            }
        }
    }
</style>