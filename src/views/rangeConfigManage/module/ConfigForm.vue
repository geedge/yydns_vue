<template>
<div class="config-dialog" v-if="visible">
    <!-- 在此处指定弹窗的样式和内容 -->
    <i class="el-icon-close" @click="close"></i>
    <div class="tag">
        <el-tag class="tags" :style="{'color': (tag==='基本配置') ? '#f8fdff': '#565e6e'}">基本配置</el-tag>
        <el-tag class="tags" :style="{'color': (tag==='网络配置') ? '#f8fdff': '#565e6e'}">网络配置</el-tag>
        <el-tag class="tags" :style="{'color': (tag==='部署') ? '#f8fdff': '#565e6e'}">部署</el-tag>
    </div>
    <div class="basic-box" v-if="tag==='基本配置'">
        <el-form
            ref="basicForm"
            :model="form"
            :rules="rules"
            label-width="150px"
            class="basic-form"
            size="small"
        >
            <el-row>
                <el-col :span="20">
                    <el-form-item label="角色选择" prop="role">
                        <el-select v-model="form.role" placeholder="请选择角色" @change="selectRole">
                            <el-option
                                    v-for="item in roleDict"
                                    :key="item.value"
                                    :label="item.value === 'other' ? `${item.label}(${otherRole})` : `${item.label}(${item.value})`"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.role!=='other'">
                <el-col :span="20">
                    <el-form-item label="tor 版本" prop="tor_version" :rules="form.role!=='other' ? rules.tor_version : [{required: false}]">
                        <el-select v-model="form.tor_version" placeholder="tor 版本" @change="selectTor">
                            <el-option
                                    v-for="item in torDict"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="选择镜像" prop="image_id">
                        <el-select v-model="form.image_id" placeholder="镜像名">
                            <el-option
                                    v-for="item in imageDict"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="复本数" prop="replicas">
                        <el-input v-model="form.replicas" placeholder="请输入内容  (默认值是1)"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="带宽限制" prop="bandwidth">
                        <el-input v-model="form.bandwidth" placeholder="请输入内容  (默认值是10)">
                            <p slot="suffix" class="el-input__icon">M</p>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="内存限制" prop="memory">
                        <el-input v-model="form.memory" placeholder="请输入内容  (默认值是100)">
                            <p slot="suffix" class="el-input__icon">Mi</p>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.role==='onion'">
                <el-col :span="20">
                    <el-form-item label="服务器地址" prop="service" :rules="form.role==='onion' ? rules.service : [{required: false}]">
                        <el-input v-model="form.service" placeholder="请输入内容  (onion角色必填)"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.role==='client'">
                <el-col :span="20">
                    <el-form-item label="代理端口" prop="out_port" :rules="form.role==='client' ? rules.out_port : [{required: false}]">
                        <!-- <el-input v-model="form.out_port" placeholder="请输入内容  (client角色必填，范围30000-32767)"></el-input> -->
                        <el-select v-model="form.out_port" placeholder="请选择代理端口" @visible-change="showOutPortSelect">
                            <el-option
                                    v-for="item in outPortDict"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.role==='da'||form.role==='relay'||form.role ==='guard'||form.role ==='exit'">
                <el-col :span="20">
                    <el-form-item label="or端口" prop="or_port">
                        <el-input v-model="form.or_port" placeholder="请输入内容  (默认值是7000)"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.role==='da'||form.role==='relay'||form.role ==='guard'||form.role ==='exit'">
                <el-col :span="20">
                    <el-form-item label="dir端口" prop="dir_port">
                        <el-input v-model="form.dir_port" placeholder="请输入内容 (默认值是9030)"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.role ==='onion'||form.role==='client'">
                <el-col :span="20">
                    <el-form-item label="客户端监听端口" prop="socks_port">
                        <el-input v-model="form.socks_port" placeholder="请输入内容  (默认值是19001)"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.role ==='onion'||form.role==='client'">
                <el-col :span="20">
                    <el-form-item label="客户端控制端口" prop="control_port">
                        <el-input v-model="form.control_port" placeholder="请输入内容  (默认值是19002)"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <footer class="anDiv">
            <el-button class="glBut" type="primary" @click="close">取消</el-button>
            <el-button class="glBut but-color" type="primary" @click="updateTag('网络配置', true)">下一步</el-button>
        </footer>
    </div>
    <div class="network-box" v-if="tag==='网络配置'">
        <el-form
            ref="netForm"
            :model="form"
            :rules="netFormRules"
            label-width="150px"
            class="basic-form"
        >
            <el-row>
                <el-col :span="20">
                    <el-form-item label="国家" prop="country_id">
                        <el-select v-model="form.country_id" placeholder="请选择国家" @change="getNetworkDict">
                            <el-option
                                    v-for="item in countryDict"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="网络" prop="network_id">
                        <el-select v-model="form.network_id" placeholder="请选择网络地址">
                            <el-option
                                    v-for="item in networkDict"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="anDiv">
            <div>
                <el-button class="glBut" type="primary" @click="close">取消</el-button>
                <el-button class="glBut but-color" type="primary" @click="updateTag('基本配置')">上一步</el-button>
                <el-button class="glBut but-color" type="primary" @click="updateTag('部署', true)">下一步</el-button>
            </div>
        </div>

    </div>
    <div class="deploy-box" v-if="tag==='部署'">
        <div class="dmgxdjx">
            <div style="margin-right: 45%">
                <el-radio-group v-model="form.deployType" @change="selectDeploy">
                    <el-radio label="direct">直接部署</el-radio>
                    <el-radio label="only">仅添加配置</el-radio>
                    <el-radio label="start">启动采集程序并部署</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="anDiv">
            <div>
                <el-button class="glBut" type="primary" @click="close">取消</el-button>
                <el-button class="glBut but-color" type="primary" @click="updateTag('网络配置')">上一步</el-button>
                <el-button class="glBut but-color" type="primary" @click="submit" :loading="loading">确认</el-button>
            </div>
        </div>
    </div>
</div>  
</template>

<script>
export default {
    name: 'ConfigForm',
    props: {
        isAdd: {
        typeof: Boolean,
        required: true
        },
        target_id: {
            typeof: String,
            required: true
        },
        otherRole: {
            typeof: String,
            required: true
        },
        countryDict: {
            typeof: Array,
            require: true
        }
    },
    data() {
        return {
            visible:false,
            loading: false,
            tag:"基本配置",
            setting_id: '',
            form: {
                role: 'da', // 角色选择
                tor_version: '', // tor版本
                image_id: '', // 选择镜像
                replicas: null, // 复本数
                bandwidth: null, // 宽带限制
                memory: null, // 内存限制
                service: '', // 服务器地址
                out_port: null, // 代理端口
                or_port: null, // or端口
                dir_port: null, // dir端口
                socks_port: null, // 客户端监听端口
                control_port: null, // 客户端控制端口

                country_id: '', // 国家
                network_id: '', // 网络

                deployType: 'direct', // 部署方式
                direct: true, // 直接部署true 仅添加配置false
                start_tcpdump: false // 启动采集程序并部署 true
            },
            roleDict:[
                {label: '权威目录节点', value: 'da'},
                {label: '路由节点', value: 'relay'},
                {label: '出口节点', value: 'exit'},
                {label: '洋葱服务节点', value: 'onion'},
                {label: '客户端节点', value: 'client'},
                {label: '入口节点', value: 'guard'},
                {label: '其他节点', value: 'other'}
            ],
            torDict: [],
            networkDict: [],
            outPortDict: [],
            imageDict: [],
            rules: {
                role: [
                    { required: true, message: '请选择角色', trigger: 'blur' }
                ],
                tor_version: [
                    { required: true, message: '请选择tor版本', trigger: 'blur' }
                ],
                image_id: [
                    { required: true, message: '请选择镜像', trigger: 'blur' }
                ],
                service:[
                    { required: true, message: '请输入服务器地址', trigger: 'blur' }
                ],
                out_port: [
                    { required: true, message: '请输入代理端口', trigger: 'blur' }
                ]
            },
            netFormRules: {
                country_id: [
                    { required: true, message: '请选择国家', trigger: 'blur' }
                ],
                network_id: [
                    { required: true, message: '请选择网络', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getOutPortDict()
    },
    methods: {
        // 关闭
        close() {
            document.querySelector('.mask').style.display = 'none'
            this.visible = false
            this.tag = '基本配置'
            this.resetForm()
            this.$emit('clearRoleForm')
        },
        // 重置
        resetForm() {
            this.form = {
                role: 'da', // 角色选择
                tor_version: '', // tor版本
                image_id: '', // 选择镜像
                replicas: '', // 复本数
                bandwidth: '', // 宽带限制
                memory: '', // 内存限制
                service: '', // 服务器地址
                out_port: '', // 代理端口
                or_port: '', // or端口
                dir_port: '', // dir端口
                socks_port: '', // 客户端监听端口
                control_port: '', // 客户端控制端口

                country_id: '', // 国家
                network_id: '', // 网络

                deployType: 'direct', // 部署方式
                direct: true, // 直接部署true 仅添加配置false
                start_tcpdump: false // 启动采集程序并部署 true
            }
        },
        // 选择哪个页面
        updateTag(val, isValid){
            if (val === '网络配置' && isValid) {
                this.$refs.basicForm.validate((valid) => {
                    if (valid) {
                        this.tag=val
                    }
                })
            } else if(val === '部署' && isValid) {
                this.$refs.netForm.validate((valid) => {
                    if (valid) {
                        this.tag=val
                    }
                })
            } else  {
                this.tag=val
            }
        },
        // 角色选择
        selectRole(node) {
            if (node === 'other') {
                this.$emit('openRoleForm')
            }
            // 获取torDict
            this.getTorDict()
            // 获取镜像字典
            this.getImageDict()
        },
        // tor选择
        selectTor(tor){
            // 获取镜像字典
            this.getImageDict()
        },
        // 获取torDick
        getTorDict() {
            this.$axios.get(this.$http.api.getTorDict, {role: this.form.role}).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.torDict = res?.result
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 获取imageDict
        getImageDict(){
            const params = {
                page:1,
                size: 99,
                image_name: this.form.role,
                image_version: this.form.tor_version
            }
            if (this.form.role === 'other' && this.otherRole) {
                params.image_name = this.otherRole
                params.image_type = 'define'
            }
            this.$axios.get(this.$http.api.getImageDict, params).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.imageDict = res?.result?.items.map(item => {
                        return {
                            label: item.image_name + ':' + item.image_version,
                            value: item.id
                        }
                    })
                }
            }).catch(err => {
                console.log(err)
            })            
        },
        // 获取网络
        getNetworkDict(){
            const params = {
                page:1,
                size: 99,
                country_id: this.form.country_id,
            }
            this.$axios.get(this.$http.api.getNetworkDict, params).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.networkDict = res?.result?.items.map(item => {
                        return {
                            label: item.cidr,
                            value: item.id
                        }
                    })
                }
            }).catch(err => {
                console.log(err)
            })            
        },
        showOutPortSelect() {
            this.getOutPortDict()
        },
        // 获取代理端口字典
        getOutPortDict(){
            const params = {}
            this.$axios.get(this.$http.api.getOutPortDict, params).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.outPortDict = res?.result
                }
            }).catch(err => {
                console.log(err)
            })            
        },
        selectDeploy(deployType) {
            switch (deployType) {
                case 'direct':
                    this.form.direct = true
                    break
                case 'only':
                    this.form.direct = false
                    break
                case 'start':
                    this.form.start_tcpdump = true
                    break
                default:
                    this.form.direct = true
                    break
            }
        },
        // 提交数据
        submit() {
            const submitForm = this.setSubmitForm()
            if (this.isAdd) {
                this.add(submitForm)
            } else {
                this.edit(submitForm)
            }
        },
        setSubmitForm() {            
            const {role, image_id } = this.form
            let submitForm = {role, image_id }
            if (this.form.replicas) {
                submitForm.replicas = this.form.replicas
            }
            if (this.form.bandwidth) {
                submitForm.bandwidth = this.form.bandwidth
            }
            if (this.form.memory) {
                submitForm.memory = this.form.memory
            }
            if (this.form.role === 'other') {
                submitForm.role = this.otherRole
            } else if (this.form.role==='da'||this.form.role==='relay'||this.form.role ==='guard'||this.form.role ==='exit') {
                submitForm.tor_version = this.form.tor_version
                if (this.form.or_port) {
                    submitForm.or_port = this.form.or_port
                }
                if (this.form.dir_port) {
                    submitForm.dir_port = this.form.dir_port
                }
            } else if (this.form.role==='onion') {
                // 服务器地址
                submitForm.tor_version = this.form.tor_version
                submitForm.service = this.form.service
                if (this.form.socks_port) {
                    submitForm.socks_port = this.form.socks_port
                }
                if (this.form.control_port) {
                    submitForm.control_port = this.form.control_port
                }
            } else if (this.form.role==='client') {
                // 代理端口
                submitForm.tor_version = this.form.tor_version
                submitForm.out_port = this.form.out_port
                if (this.form.socks_port) {
                    submitForm.socks_port = this.form.socks_port
                }
                if (this.form.control_port) {
                    submitForm.control_port = this.form.control_port
                }
                
                
                
            }
            return submitForm
        },
        add(submitForm) {
            this.loading = true
            const url = this.$http.api.setting + `/?target_id=${this.target_id}&network_id=${this.form.network_id}&direct=${this.form.direct}&start_tcpdump=${this.form.start_tcpdump}`
            this.$axios.post(url, submitForm).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.close()
                    this.$emit('refresh')
                    this.$notify({
                        title: '添加靶场配置成功',
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
        edit(submitForm) {
            this.loading = true
            const url = this.$http.api.setting+ `/${this.setting_id}/?target_id=${this.target_id}&network_id=${this.form.network_id}&direct=${this.form.direct}&start_tcpdump=${this.form.start_tcpdump}`
            this.$axios.put(url, submitForm).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.close()
                    this.$emit('refresh')
                    this.$notify({
                        title: '修改靶场配置成功',
                        type: 'success',
                        duration: 2500
                    })
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

<style lang="less" scoped>
.config-dialog{
    z-index: 997;
    width: 620px;
    height: 555px;
    position: absolute; /* 绝对定位 */
    top: 50%; /* 向下偏移50% */
    left: 50%; /* 向右偏移50% */
    transform: translate(-50%, -50%); /* 回移50% */
    background-image:url('../../../img/tjpz.svg');
    background-repeat: no-repeat; /* 可选，防止图像重复 */
    background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
    .el-icon-close{
        float: right; 
        padding-right: 7%;
        padding-top: 3%
    }
    .basic-form {
        margin-top: 20px;
        text-align: left;
        ::v-deep .el-select {
            width: 100%;
        }
    }
    .tag{
        margin-left: 9%;
        .tags{
            margin-right: 5%;
            margin-top: 2%;
            font-size: 23px;
            border: none;
            background-color: transparent !important;
            color: #565e6e;
        }
    }
    .but-color {
        background-color: #02DDEA !important;
    }
    .basic-box{
        .anDiv{
            width: 100%;
            float: left;
            margin-bottom: 10%;
            text-align: center;
            .glBut{
                width: 90px;
                height: 30px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-left: 5%;
                background-color: rgba(24, 133, 234, 0.2);
                color: #1b7cc4;
            }
        }
    }
    .network-box{
        .anDiv{
            width: 100%;
            float: left;
            margin-top: 50%;
            text-align: center;
            .glBut{
                width: 90px;
                height: 30px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-left: 5%;
                background-color: rgba(24, 133, 234, 0.2);
                color: #1b7cc4;
            }
        }

    }
    .deploy-box{
        .dmgxdjx{
            width: 100%;
            float: left;
            display: block;
            margin-top: 3%;
            margin-left: 20%;
            text-align: left;
            .el-radio {
                display: block;
                margin-top: 20%;
                font-size: 14px;
                color: #ffffff;
            }
        }
        .anDiv{
            width: 100%;
            float: left;
            margin-top: 49%;
            text-align: center;
            .glBut{
                width: 90px;
                height: 30px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-left: 5%;
                background-color: rgba(24, 133, 234, 0.2);
                color: #1b7cc4;
            }
        }
    }
}
</style>