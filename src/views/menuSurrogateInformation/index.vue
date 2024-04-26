<template>
    <div class="range-manage" ref="appRef">
        <div class="show">
            <Header
            ></Header>
            <div>
                <span style="font-size: 20px;margin-bottom: 1%;margin-top: 0.5%;float: left;margin-left: 3%;color: #00C0FF">至少需要一个代理才能创建任务,每个代理同时只执行一项任务</span>
            </div>
            <div class="project">
                <el-select v-model="powerValue" placeholder="能力筛选" clearable @change="query">
                    <el-option
                            v-for="item in powerFilter"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="project">
                <el-select v-model="stateValue" placeholder="状态筛选" clearable @change="query">
                    <el-option
                            v-for="item in stateFilter"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="project">
                <el-select v-model="freeValue" placeholder="空闲筛选" clearable @change="query">
                    <el-option
                            v-for="item in freeFilter"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="list" >
                <el-table class="custom-table"
                    ref="multipleTable"
                    :data="tableData"
                    height="100%"
                    style="width: 100%;"
                    tooltip-effect="dark"
                    highlight-current-row
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="index" align="center" min-width="100">
                        <template slot="header" slot-scope="scope">
                            <span>序号</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center"
                                     prop="id"
                                     label="编号"
                                     min-width="200">
                    </el-table-column>
                    <el-table-column align="center" label="IP地址" min-width="300">
                        <template slot-scope="scope">
                            <!-- 在这个插槽中自定义单元格的渲染方式 -->
                            <div style="white-space: pre-line;">
                                <!-- 使用 v-for 循环遍历每个 IP 地址，并使用换行符分隔 -->
                                <span v-for="(ip, index) in scope.row.ipaddr" :key="index">
                                    {{ ip }}
                                     <br> <!-- 在每个 IP 地址后面添加换行符 -->
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center"
                                     prop="atype"
                                     label="能力类型"
                                     min-width="150">
                    </el-table-column>
                    <el-table-column align="center"  label="当前状态" min-width="100">
                        <template slot-scope="scope">{{ scope.row.status?"在线":"离线" }}</template>
                    </el-table-column>
                    <el-table-column align="center"  label="是否空闲" min-width="100">
                        <template slot-scope="scope">{{ scope.row.idle?"空闲":"执行中" }}</template>
                    </el-table-column>

                    <el-table-column align="center"
                                     label="操作"
                                     min-width="150">
                        <template slot-scope="scope">
                            <el-button type="text" size="medium" style="{'color': '#409eff'}"
                                @click="getInfo(scope.row)">详情</el-button>
                            <el-button type="text" size="medium" @click="agentdel(scope.row.id)">删除</el-button>
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
        </div>
        <div class="popup" v-if="newlyPztj">
            <!-- 在此处指定弹窗的样式和内容 -->
            <i class="el-icon-close" style="float: right; padding-right: 7%;padding-top: 2.8%" @click="CustomizationImageFales()"></i>
            <span style="color: #f5f7f0;font-size: 20px;float: left;margin-left: 6%;margin-top: 1%">代理{{info.id}}详情</span>
            <div class="jbpz">
                <template>
                   <el-row style="display: flex; flex-direction: row;">
                       <el-col :span="20">当前状态</el-col>
                       <el-col :span="20">{{info.status?'在线':'离线'}}</el-col>
                   </el-row>
                    <el-divider content-position="center"></el-divider>
                    <el-row style="display: flex; flex-direction: row;">
                        <el-col>编号</el-col>
                        <el-col>{{info.id}}</el-col>
                    </el-row>
                    <el-divider content-position="center"></el-divider>
                    <el-row style="display: flex; flex-direction: row;">
                        <el-col>通信端口</el-col>
                        <el-col>{{info.port}}</el-col>
                    </el-row>
                    <el-divider content-position="center"></el-divider>
                    <el-row style="display: flex; flex-direction: row;">
                        <el-col>运行平台</el-col>
                        <el-col>{{info.sys}}</el-col>
                    </el-row>
                    <el-divider content-position="center"></el-divider>
                    <el-row style="display: flex; flex-direction: row;">
                        <el-col>IP地址</el-col>
                        <el-col>
                            <span v-for="i in info.ipaddr">
                                {{i}}
                                <br>
                            </span>
<!--                            {{info.ipaddr}}-->
                        </el-col>
                    </el-row>
                    <el-divider content-position="center"></el-divider>
                    <el-row style="display: flex; flex-direction: row;">
                        <el-col>CPU核心数</el-col>
                        <el-col>{{info.cpu_num}}</el-col>
                    </el-row>
                    <el-divider content-position="center"></el-divider>

                    <el-row style="display: flex; flex-direction: row;">
                        <el-col>系统内存</el-col>
                        <el-col>{{info.mem}}</el-col>
                    </el-row>
                    <el-divider content-position="center"></el-divider>

                    <el-row style="display: flex; flex-direction: row;">
                        <el-col>运行时间</el-col>
                        <el-col>{{info.start_time}}</el-col>
                    </el-row>
                    <el-divider content-position="center"></el-divider>

                </template>
                <footer class="anDiv">
                    <el-button class="glBut" type="primary" @click="CustomizationImageFales">关闭</el-button>
                </footer>
            </div>

        </div>
    </div>
</template>

<script>

    import { PrismEditor } from 'vue-prism-editor';
    import 'vue-prism-editor/dist/prismeditor.min.css';
    import { highlight, languages } from 'prismjs/components/prism-core';
    import 'prismjs/components/prism-clike';
    import 'prismjs/components/prism-javascript';
    import 'prismjs/themes/prism.css';  // 如果想代码换个样式风格，把这个注释了，上面的三个放开一个
    import Header from './module/Header.vue'

    export default {
        name: "imageMange",
        // props:['fTag','fInput','fFrom','FIsConfigQuery'],
        // components:{
        //     router
        // },
        components: { PrismEditor ,Header},
        data(){
            return{
                infoTable:  [
                    {
                        id: 1,
                        title: "用户ID",
                        value: 1,
                    },
                    {
                        id: 2,
                        title: "微信昵称",
                        value:2,
                    },
                    {
                        id: 3,
                        title: "会员名称",
                        value:3,
                    }
                ],
                info:[],
                powerValue:'',
                stateValue:'',
                freeValue:'',
                powerFilter:[
                    {
                      value:'全部',
                      label:'全部'
                    },
                    {
                        value:'渗透',
                        label:'渗透'
                    },
                    {
                        value:'状态感知',
                        label:'状态感知'
                    },
                    {
                        value:'参数感知',
                        label:'参数感知'
                    },
                ],
                stateFilter:[
                    {
                        value:'全部',
                        label:'全部'
                    },
                    {
                        value:'在线',
                        label:'在线'
                    },
                    {
                        value:'离线',
                        label:'离线'
                    },
                ],
                freeFilter:[
                    {
                        value:'全部',
                        label:'全部'
                    },
                    {
                        value:'空闲',
                        label:'空闲'
                    },
                    {
                        value:'执行中',
                        label:'执行中'
                    },
                ],
                file:'',
                image_id:0,
                addImage:{
                    direct:false,
                    attribute:"private",
                    image_name:"",
                    image_version:"",
                    version_operate:"add",
                    image_description:"",
                    establish_mode:"gitOrCode",
                    git_address:"",
                    git_branch:"",
                    git_account:"",
                    git_password:"",
                    run_command:"",
                    run_args:""
                },
                barkImageParmer:{
                    direct:false,
                    attribute:"private",
                    image_name:"",
                    image_version:"",
                    version_operate:"add",
                    image_description:"",
                    establish_mode:"gitOrCode",
                    git_address:"",
                    git_branch:"",
                    git_account:"",
                    git_password:"",
                    run_command:"",
                    run_args:""
                },
                queryByImageName:"",
                selectImageStateValue: '',
                page:1,
                size:10,
                code: '/**\n* JS判断两个数组是否相等\n* @param {Array} arr1\n* @param {Array} arr2\n* @returns {boolean} 返回true 或 false\n*/\nfunction arrayEqual(arr1, arr2) {\n    if (arr1 === arr2) return true;\n    if (arr1.length != arr2.length) return false;\n    for (var i = 0; i < arr1.length; ++i) {\n        if (arr1[i] !== arr2[i]) return false;\n    }\n    return true;\n}',
                infoType:"",
                tag:"基本配置",
                tableData:[],
                total:0,
                multipleSelection: [],
                fileList: [
                    // {
                    //     name: '',
                    //     url: ''
                    // }
                ],

                newlyPztj:false,
                newlyPztjNext:false,
                trackCountriesJson:["0","0","0","0","0","0","0","0","0","0","0","0"],
                input:"",
                bcmc:"",
                bcms:"",
                dockerOrTar:"dockerfile",
                radioRatio: '1',
                radioOwnership2: '1',
                radioUpdateImage: '2',
                radioHowToCreate: '1',
                delTimer: null,
                counter: 0

            };
        },
        mounted() {
        },
        watch: {
        },
        created() {
            // this.getImages()
            this.query();
        },
        destroyed() {
            // if (this.pendingTimer) {
            //     clearInterval(this.pendingTimer)
            //     this.pendingTimer = null
            // }
            if(this.delTimer) {
                clearInterval(this.delTimer)
                this.delTimer = null
            }
            this.counter = 0
        },
        methods:{
            formatIPs(row, column, cellValue) {
                // let formattedIPs = cellValue.join(',\n');
                // return formattedIPs;
                // 使用 map 方法处理每个 IP 地址，然后连接成带有换行符的字符串
                let formattedIPs = cellValue.map(ip => ip).join(',\n');

                return formattedIPs;

            },
            query(){
                let data={
                    "page":this.page,
                    "per_page":this.size,
                    "atype":this.powerValue==='参数感知'?'csgz':(this.powerValue==='状态感知'?'ztgz':(this.powerValue==='渗透'?'gjst':'all')),
                    "status":this.stateValue==='在线'?1:(this.stateValue==='离线'?0:2),
                    "idle":this.freeValue==='空闲'?1:(this.stateValue==='执行中'?0:2)
                }
                this.$axios.get(this.$http.api.agentQueryList,data).then(res=>{
                    if(res.code===200){
                        this.tableData=res.agent_data
                        this.total=res.total
                    }
                }).catch(err=>{
                    console.log(err)
                })


            },
            agentdel(val){
                let data={
                    "id":val.toString(),
                }
                this.$axios.post(this.$http.api.agentDel,data).then(res=>{
                    if(res.code===200){
                        this.$message.success(res.msg)
                    }else {
                        this.$message.error(res.msg)
                    }
                }).catch(err=>{
                    console.log(err)
                })


            },
            onFileChange(event) {
                this.file = event.target.files[0];
            },
            oneByThere(){
                if(this.dockerOrTar==='tar'){
                    this.addImage.establish_mode="tar";
                }else {
                    if(this.radioOwnership2==='1'){
                        this.addImage.establish_mode="code";
                    }else {
                        this.addImage.establish_mode="git"
                    }
                }

            },
            thereToOne(val){
                if(val==='tar'){
                    this.dockerOrTar='tar'
                }else {
                    if(val==='git'){
                        this.dockerOrTar='dockerfile'
                        this.radioOwnership2='2'
                    }else {
                        this.dockerOrTar='dockerfile'
                        this.radioOwnership2='1'
                    }
                }
            },
            closeInfo(){
              this.infoType='';
              document.querySelector('.mask').style.display = 'none'
                this.addImage=this.barkImageParmer
            },
            CustomizationImageFales(){
                this.newlyPztj=false;
                document.querySelector('.mask').style.display = 'none'
                // this.image_id=0
                // this.addImage=this.barkImageParmer
            },
            buildImage(val){
                let data={
                    "image_id":val,
                }
                this.$axios.get(this.$http.api.asyncBuildImage,data).then(res=>{
                    if(res.code===200){
                        this.CustomizationImageFales()

                        this.getImages()
                        this.image_id=0

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
                        }, 10 * 1000)
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            infoImage(val){
                let data={
                    "image_id":val,
                }
                this.$axios.get(this.$http.api.infoImage,data).then(res=>{
                    if(res.code===200){
                        this.addImage.git_account=res.result.pipeline.git_account;
                        this.addImage.git_password=res.result.pipeline.git_password;
                        this.addImage.git_address=res.result.pipeline.git_address;
                        this.addImage.git_account=res.result.pipeline.git_account;
                        this.addImage.git_branch=res.result.pipeline.git_branch;
                        this.addImage.run_command=res.result.pipeline.run_command;
                        this.addImage.run_args=res.result.pipeline.run_args;
                        this.addImage.version_operate=res.result.pipeline.version_operate;
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            delImage(val){
                let data={
                    "image_id":val,
                }
                this.$axios.delete(this.$http.api.delImage,data).then(res=>{
                    if(res.code===200){
                        this.image_id=0
                        this.getImages()
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            updateImageToBark(){
                this.oneByThere();
                let formData = new FormData();
                formData.append('image_name', this.addImage.image_name);
                formData.append('image_version', this.addImage.image_version);
                formData.append('version_operate', this.addImage.version_operate);
                formData.append('image_description', this.addImage.image_description);
                formData.append('establish_mode', this.addImage.establish_mode);
                formData.append('git_address', this.addImage.git_address);
                formData.append('git_branch', this.addImage.git_branch);
                formData.append('git_account', this.addImage.git_account);
                formData.append('git_password', this.addImage.git_password);
                formData.append('run_command', this.addImage.run_command);
                formData.append('run_args', this.addImage.run_args);
                const config = {
                    direct:this.addImage.direct,
                    attribute:this.addImage.attribute,
                    image_id:this.image_id
                    // headers: {
                    //     'Content-Type': 'multipart/form-data',
                    // }
                };
                this.$axios.put(this.$http.api.asyncUpdateImage, formData ,config).then(res=>{
                    if(res.code===200){
                        this.CustomizationImageFales()

                        this.page=1;
                        this.getImages()
                        this.image_id=0

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
                        }, 10 * 1000)
                    }
                }).catch(err=>{
                    console.log(err)
                })

            },
            addImageToBark(){
                this.oneByThere();
                let formData = new FormData();
                formData.append('image_name', this.addImage.image_name);
                formData.append('image_version', this.addImage.image_version);
                formData.append('version_operate', this.addImage.version_operate);
                formData.append('image_description', this.addImage.image_description);
                formData.append('establish_mode', this.addImage.establish_mode);
                formData.append('git_address', this.addImage.git_address);
                formData.append('git_branch', this.addImage.git_branch);
                formData.append('git_account', this.addImage.git_account);
                formData.append('git_password', this.addImage.git_password);
                formData.append('run_command', this.addImage.run_command);
                formData.append('run_args', this.addImage.run_args);
                formData.append('code_file', this.file);

                const config = {
                    direct:this.addImage.direct,
                    attribute:this.addImage.attribute,
                    // headers: {
                    //     'Content-Type': 'multipart/form-data',
                    // }
                };
                this.$axios.post(this.$http.api.asyncAddImage, formData ,config).then(res=>{
                    console.log('getImages======',res)
                    if(res.code===200){
                        this.CustomizationImageFales()

                        this.page=1;
                        this.getImages()

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
                        }, 10 * 1000)
                    }
                }).catch(err=>{
                    console.log(err)
                })

            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size=val
                this.query()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.page=val
                this.query()
            },
            getImages(){
                let data={

                }
                this.$axios.get(this.$http.api.agentQueryList,data).then(res=>{
                        console.log('getImages======',res)
                        // if(res.code===200){
                            this.tableData=res.agent_data
                            this.total=100
                        // }
                    }).catch(err=>{
                        console.log(err)
                })
            },
            highlighter(code) {
                return highlight(code, languages.js)
            },
            getInfo(val){
                this.info=val
                this.newlyPztj=true
                document.querySelector('.mask').style.display = 'block'
            },
            updateTag(val){
                this.tag=val
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$notify.warning(`当前限制选择 1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
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
                        this.getImages()
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    this.counter++
                    if (this.counter >= 60) {
                        clearInterval(this.delTimer)
                        this.delTimer = null
                        this.counter = 0
                        this.getImages()
                    }
                })
            }

        }
    }

</script>

<style lang='less' scoped="scoped">
    .state{
        display: inline-block;
        height: auto;
        width: 10%;
        margin-left: 0.5%;
        .custom-popper .el-select-dropdown {
            max-height: 3px;
        }
    }
    .project{
        display: inline-block;
        height: auto;
        width: 10%;
        margin-left: 0.5%;
        margin-right: 3%;
        .el-input::placeholder {
            width: auto;
        }
        .icon-group {
            display: flex; /* 设置容器为 Flexbox 容器 */
            align-items: center; /* 垂直居中图片 */
            gap: 5px; /* 图片和文字之间的间距，可以根据需要进行调整 */

        }
        .icon-group img {
            transform: scale(1);
            margin-right: 15px;
            margin-top: 6px;
        }

    }
    .custom-table {
        width: 100%;
        height: 100%;
    }
    .my-editor {
        background: transparent;
        /*color: #000;*/
        color: #fafafa;

        font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
        font-size: 16px;
        line-height: 1.5;
        padding: 5px;
        font-weight: 500;
    }

    .my-editor ::v-deep .prism-editor__textarea::selection{
        background-color: #322dff !important;
        color: #ed1210 !important;
        user-select:none;
    }

    .my-editor ::v-deep .prism-editor__textarea:focus {
        border: 0px solid #007bff;
        outline: none;
    }

    .my-editor ::v-deep .prism-editor__line-numbers{
        padding-right: 10px;
    }
    .popup{
        z-index: 997;
        width: 43%;
        height: 75%;
        position: absolute; /* 绝对定位 */
        top: 50%; /* 向下偏移50% */
        left: 50%; /* 向右偏移50% */
        transform: translate(-50%, -50%); /* 回移50% */
        background-image:url('../../img/tjpz.svg');
        background-repeat: no-repeat; /* 可选，防止图像重复 */
        background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
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
        .jbpz{
            margin-top: 10%;
            margin-left: 15%;
            height: 100%;
            width: 70%;
            text-align: center;
            position:relative;
            .project{
                display: inline-block;
                width: 100%;
                margin-top: 3%;
                text-align: center;
                padding-right: 10%;

            }
            .tar{
                display: flex;
                margin-left: 23%;
                width: 100%;
                text-align: center;
                ::v-deep .el-upload-list {
                    margin: 0;
                    list-style: none;
                    width: 300px !important;
                    padding-left: 20%;
                }
                .uploadBgImg{
                    margin-top: 5%;
                    width: 300px;
                    height: 40px;
                    background-image: url("../../img/shangchuan.png");
                    background-repeat: no-repeat; /* 可选，防止图像重复 */
                    background-size: 100% auto; /* 宽度为100%，高度自适应保持宽高比 */
                    text-align: right;
                    padding-right: 10%;
                    padding-top: 2%;
                    font-size:0;
                    color: rgba(81, 84, 102, 0.84);
                }
                .uploadBgImg::file-selector-button{
                    padding: 0;
                    background-color: transparent;
                    cursor: pointer;
                    font-size: 0;
                }
            }
            .srkType{
                width: 100%;
                float: left;
                margin-top: 2%;
                text-align: center;
                .srk{
                    width: 40%;
                    margin-left: 2%;
                    background-color: #0c295b;
                    display: inline-block;
                    border: none;
                }
            }
            .radioType{
                width: 100%;
                float: left;
                margin-top: 2%;
                text-align: center;
            }
            .anType{
                height: 10%;
                position:absolute;
                bottom:4%;
                left: 50%;
                transform: translateX(-50%);
                .glBut{
                    width: 90px;
                    height: 30px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba(24, 133, 234, 0.2);
                    color: #1b7cc4;
                }

            }
        }
    }
    .range-manage{
        width: 100%;
        height: 100%;
        float: right;
        position: relative; /* 确保相对定位生效 */
        .infoTar{
            z-index: 997;
            width: 40%;
            height: 50%;
            position: absolute; /* 绝对定位 */
            /*position: relative;*/
            top: 50%; /* 向下偏移50% */
            left: 50%; /* 向右偏移50% */
            transform: translate(-50%, -50%); /* 回移50% */
            background-image:url('../../img/torInfo.svg');
            background-repeat: no-repeat; /* 可选，防止图像重复 */
            background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
            .infoTypography{
                display: flex;
                justify-content: center;
                width: 100%;
                height: 70%;
                margin-top: 5%;
                .container{

                    width: 85%;
                    .row {
                        width: 100%;
                        .cell {
                            float: left;
                            display: inline-block;
                            width: 50%;
                            padding: 10px;
                            border: none;
                            text-align: left;
                            font-size: 18px;
                            color: #8c8faf;
                        }
                        .cellA {
                            float: left;
                            display: inline-block;
                            width: 51%;
                            padding: 10px;
                            border: none;
                            text-align: left;
                            font-size: 18px;
                            color: #8c8faf;
                        }
                    }
                }
            }
        }
        .infoDocker{
            z-index: 997;
            width: 60%;
            height: 70%;
            position: absolute; /* 绝对定位 */
            /*position: relative;*/
            top: 50%; /* 向下偏移50% */
            left: 50%; /* 向右偏移50% */
            transform: translate(-50%, -50%); /* 回移50% */
            background-image:url('../../img/infoDocker.svg');
            background-repeat: no-repeat; /* 可选，防止图像重复 */
            background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
            .infoCode{
                width: 62%;
                height: 92%;
                margin-left: 4%;
                margin-top: 2%;
                display: inline-block;
                float: left;
                /*background-color: #0b6f08;*/
            }
            .infoInfo{
                float: right;
                margin-right: 3%;
                margin-top: 2%;
                width: 27%;
                height: 70%;
                /*background-color: #ed1210;*/
                .infoText{
                    width: 100%;
                    margin-top: 2%;
                    color: #8c8faf;
                    font-size: 20px;
                    text-align: left;
                    padding-left: 2%;
                    overflow: wrap;
                    word-wrap: break-word;
                }
            }
        }
        .show{
            width: 95%;
            height: 95%;
            /*background-color: #67c23a;*/
            position: absolute; /* 绝对定位 */
            top: 50%; /* 向下偏移50% */
            left: 50%; /* 向右偏移50% */
            transform: translate(-50%, -50%); /* 回移50% */
            background-image:url('../../img/backgroundFourCorner.png');
            /*background-image:url('../../img/777.png');*/
            background-repeat: no-repeat; /* 可选，防止图像重复 */
            background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
            /*background-size: cover; !* 宽度为100%，高度自适应保持宽高比 *!*/

            /*display: flex; !* 将容器设置为 Flex 容器 *!*/
            /*justify-content: center; !* 水平居中子元素 *!*/
            /*align-items: center; !* 垂直居中子元素 *!*/
            .head{
                width: 95%;
                height: 7%;
                margin-top: 1%;
                margin-left: 2.5%;
                text-align: right;

                /*background-color: #5daf34;*/
                .block{
                    display: inline-block;
                    margin-left: 2%;

                }
                .input{
                    display: inline-block;
                    height: 60%;
                    width: 10%;
                    margin-left: 0.5%;
                    /*background-color: rgba(223, 230, 236, 0.1); !* 使用 rgba 函数设置颜色和透明度 *!*/
                    /*background-image:url('../../img/bcglinput.png');*/
                    /*background-repeat: no-repeat; !* 可选，防止图像重复 *!*/
                    /*background-size: cover; !* 图像将被调整以完全填充，同时保持比例不变 *!*/
                    .el-input::placeholder {
                        width: auto;
                    }
                    .icon-group {
                        display: flex; /* 设置容器为 Flexbox 容器 */
                        align-items: center; /* 垂直居中图片 */
                        gap: 5px; /* 图片和文字之间的间距，可以根据需要进行调整 */

                    }

                    .icon-group img {
                        /*margin-right: 10px; !* 图片之间留出一些距离 *!*/
                        /*width: 1px; !* 指定图片的宽度 *!*/
                        /*height: 10px; !* 指定图片的高度 *!*/
                        transform: scale(1);
                        margin-right: 15px;
                        margin-top: 6px;
                    }

                }
                .project{
                    display: inline-block;
                    height: 60%;
                    width: 10%;
                    margin-top: 0.5%;
                    margin-left: 0.5%;
                    margin-right: 1%;
                    /*background-color: rgba(223, 230, 236, 0.1); !* 使用 rgba 函数设置颜色和透明度 *!*/
                    /*background-image:url('../../img/bcglinput.png');*/
                    /*background-repeat: no-repeat; !* 可选，防止图像重复 *!*/
                    /*background-size: cover; !* 图像将被调整以完全填充，同时保持比例不变 *!*/
                    .el-input::placeholder {
                        width: auto;
                    }
                    .icon-group {
                        display: flex; /* 设置容器为 Flexbox 容器 */
                        align-items: center; /* 垂直居中图片 */
                        gap: 5px; /* 图片和文字之间的间距，可以根据需要进行调整 */

                    }

                    .icon-group img {
                        /*margin-right: 10px; !* 图片之间留出一些距离 *!*/
                        /*width: 1px; !* 指定图片的宽度 *!*/
                        /*height: 10px; !* 指定图片的高度 *!*/
                        transform: scale(1);
                        margin-right: 15px;
                        margin-top: 6px;
                    }

                }
                .state{
                    font-size: 10px;
                    float: left;
                    margin-top: 0.5%;
                    display: inline-block;
                    height: 60%;
                    width: 7%;
                    margin-left: 0.5%;
                    .custom-popper .el-select-dropdown {
                        max-height: 3px;
                    }
                    ::v-deep .el-input__inner{
                        color: #000 !important;
                    }

                }
            }
            .list{
                width: 95%;
                height: 76%;
                margin-left: 2.5%;
                overflow-y: auto;
                overflow-y: scroll;
                overflow-x: hidden;
                border: none;
            }
            // .list::-webkit-scrollbar {
            //     width: 0px;  /* 隐藏滚动条 */
            //     height: 0px;
            //     background-color: transparent; /* 让背景透明 */

            // }
            // /* 隐藏火狐浏览器滚动条 */
            // @-moz-document url-prefix() {
            //     .trackSource {
            //         scrollbar-width: none;
            //     }
            // }
            /*.page{*/
            /*    width: 95%;*/
            /*    height: 5%;*/
            /*    margin-left: 2%;*/
            /*    !*background-color: #ec171d;*!*/
            /*    padding-left: 35%;*/
            /*    padding-top: 0.9%;*/
            /*    .el-pagination {*/
            /*        transform: scale(1.5);*/
            /*    }*/
            /*    .el-pagination .btn-next, .el-pagination .btn-prev {*/
            /*        background: #0b6f08 !important;*/
            /*        color: #00F1FF !important;*/
            /*    }*/
            /*    !*.el-pagination .number:not(.active) {*!*/
            /*    !*    background-color: red !important;*!*/
            /*    !*    color: white;*!*/
            /*    !*}*!*/
            /*    !*.el-pagination button:disabled{*!*/
            /*    !*    background-color: #a10e0e;*!*/
            /*    !*}*!*/


            /*}*/
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