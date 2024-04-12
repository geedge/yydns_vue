<template>
    <div class="range-manage" ref="appRef">
        <div class="show">
            <div class="head">
                <span style="font-size: 16px;float: left;padding-top: 1%">镜像列表</span>
<!--                <img src="../../img/customImages.png" style="height: 70% ;width: 10%;margin-right: 2%;color: #ffffff" @click="newlyPztj=true">-->
                <img src="../../img/customImages.png" style="height: 70% ;width: 10%;margin-right: 2%;color: #ffffff" @click="customizationImage(null)">
                <div class="input" @keyup.enter="updateAndQuery">
                    <el-input v-model="queryByImageName" placeholder="名称查询输入" suffix icon="">
                        <template v-slot:suffix>
                            <div class="icon-group">
                                <img src="../../img/inputl.png" alt="**">
                                <img src="../../img/inputIcon.png" alt="*" @click="updateAndQuery">
                            </div>
                        </template>
                    </el-input>
                </div>
                <div class="project">
                    <el-select v-model="selectImageStateValue" placeholder="全部镜像"  @change="selectImageState()">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>


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
                                     prop="image_name"
                                     label="镜像名称"
                                     min-width="200">
                    </el-table-column>
                    <el-table-column align="center"
                                     prop="image_version"
                                     label="镜像版本"
                                     min-width="100">
                    </el-table-column>
                    <el-table-column align="center"
                                     prop="image_type"
                                     label="镜像类别"
                                     min-width="100">
                    </el-table-column>
                    <el-table-column align="center"
                                     prop="publish_time"
                                     label="推送时间"
                                     min-width="200">
                    </el-table-column>
                    <el-table-column align="center"
                                     prop="image_size"
                                     label="镜像大小"
                                     min-width="150">
                    </el-table-column>
                    <el-table-column align="center"
                                     label="构建方式"
                                     min-width="130">
                        <template slot-scope="scope">
                            <span v-if="scope.row.define_image.length===0">
                                导入
                            </span>
                            <span v-if="scope.row.define_image.length>0">
                                {{scope.row.define_image[0].establish_mode}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center"
                                     label="镜像状态"
                                     min-width="130">
                        <template slot-scope="scope">
                            <span v-if="scope.row.define_image.length===0">
                                已构建
                            </span>
                            <span v-if="scope.row.define_image.length>0">
                                {{scope.row.define_image[0].has_build==='True'?scope.row.define_image[0].build_status==='True'?'已构建':'构建失败':'未构建'}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center"
                                     label="操作"
                                     min-width="380">
                        <template slot-scope="scope">
                            <!--                            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
                            <el-button type="text" size="medium" :style="{'color': (scope.row.define_image.length===0) ? '#565e6e': '#409eff'}"
                                @click="scope.row.define_image.length===0?'':getInfo(scope.row)">查看详情</el-button>
                            <el-button type="text" size="medium" :style="{'color': (scope.row.image_type==='system' || scope.row.image_type==='buildin') ? '#565e6e': '#409eff'}"
                                @click="(scope.row.image_type==='system' || scope.row.image_type==='buildin') ? '' : customizationImage(scope.row)">修改配置</el-button>
                            <el-button type="text" size="medium" :style="{'color': (scope.row.define_image.length===0
                            ||(scope.row.define_image[0].has_build==='True'&&scope.row.define_image[0].build_status==='True')) ? '#565e6e': '#409eff'}"
                                       @click="(scope.row.define_image.length===0
                                       ||((scope.row.define_image[0].has_build==='True'&&scope.row.define_image[0].build_status==='True')))?NobuildingImage():buildImage(scope.row.id)">
                                {{scope.row.define_image.length===0?'构建镜像':(scope.row.define_image[0].has_build==='True'&&scope.row.define_image[0].build_status==='False')?"重新构建":"构建镜像"}}
                                </el-button>
                            <el-button type="text" size="medium" @click="delImage(scope.row.id)">删除镜像</el-button>
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
        <div class="infoTar" v-if="infoType==='tar'">
            <i class="el-icon-close" style="float: right; padding-right: 7%;padding-top: 6%" @click="infoType=''"></i>
            <div class="infoTypography">
                <div class="container">
                    <div class="row">
                        <div class="cell">Tar包名称：{{infoType}}</div>
                        <div class="cell">上传时间：{{infoType}}</div>
                    </div>
                    <div class="row">
                        <div class="cell">Tar包大小：{{infoType}}</div>
                        <div class="cell">状态：{{infoType}}</div>
                    </div>
                    <div class="row">
                        <div class="cellA">上传者：{{infoType}}</div>
                    </div>
                    <div class="row">
                        <div class="cellA">描述：{{infoType}}</div>
                    </div>
                </div>
            </div>

            <div class="anType">
                <div>
                    <el-button class="glBut" type="primary" @click="closeInfo()">关闭</el-button>
                </div>
            </div>



        </div>
        <div class="infoDocker" v-if="infoType==='docker'">
            <i class="el-icon-close" style="float: right; padding-right: 5%;padding-top: 2%" @click="closeInfo()"></i>
            <div  class="infoCode">
                <Card>
                    <prism-editor class="my-editor" v-model="code" :highlight="highlighter" readonly :line-numbers="true"></prism-editor>
                </Card>
            </div>
            <div  class="infoInfo">
                <div>
                    <div class="infoText">
<!--                        状态：{{infoType}}-->
                        状态：
                        <template>
                            <span v-if="addImage.define_image.length===0">
                                已构建
                            </span>
                            <span v-if="addImage.define_image.length>0">
                                {{addImage.define_image[0].has_build==='True'?addImage.define_image[0].build_status==='True'?'已构建':'构建失败':'未构建'}}
                            </span>
                        </template>
                    </div>
                    <div class="infoText">
                        上传者99：{{addImage.user_id}}
                    </div>
                    <div class="infoText">
                        上传时间：{{addImage.publish_time}}
                    </div>
                    <div class="infoText">
                        描述：{{addImage.image_description}}
                    </div>
                </div>
                <div style="margin-top: 135%">
                    <div>
                        <el-button  type="primary" @click="closeInfo()">关闭</el-button>
                    </div>
                </div>
            </div>


        </div>
        <div class="popup" v-if="newlyPztj">
            <!-- 在此处指定弹窗的样式和内容 -->
<!--            <i class="el-icon-close" style="float: right; padding-right: 7%;padding-top: 2.8%" @click="newlyPztj=false"></i>-->
            <i class="el-icon-close" style="float: right; padding-right: 7%;padding-top: 2.8%" @click="CustomizationImageFales()"></i>
            <div class="tag">
                <el-tag class="tags" :style="{'color': (tag==='基本配置') ? '#f8fdff': '#565e6e'}" @click="updateTag('基本配置'),tagStep=1">基本配置</el-tag>
                <el-tag class="tags" :style="{'color': (tag==='镜像配置') ? '#f8fdff': '#565e6e'}" @click="updateTag('镜像配置'),tagStep=2">镜像配置</el-tag>
                <el-tag class="tags" :style="{'color': (tag==='构建') ? '#f8fdff': '#565e6e'}" @click="updateTag('构建'),tagStep=3">构建</el-tag>
            </div>
            <div class="jbpz" v-if="tagStep===1">
                <div class="srkType">
                    <span style="margin-right: 3%">镜像名称</span>
                    <el-input class="srk" v-model="addImage.image_name" placeholder="请输入内容"></el-input>
                </div>
                <div class="srkType">
                    <span style="margin-right: 3%">镜像版本</span>
                    <el-input class="srk" v-model="addImage.image_version" placeholder="请输入内容"></el-input>
                </div>
                <div class="srkType">
                    <span style="margin-right: 3%">镜像描述</span>
                    <el-input class="srk" v-model="addImage.image_description" placeholder="请输入内容"></el-input>
                </div>
                <div class="radioType">
                    <div style="margin-right: 25%">
                        <span style="margin-right: 6%">拥有权</span>
                        <el-radio v-model="addImage.attribute" label="private">私有</el-radio>
                        <el-radio v-model="addImage.attribute" label="public">公有</el-radio>
                    </div>
                </div>
                <div class="anType">
                    <div>
                        <el-button class="glBut" type="primary" @click="CustomizationImageFales()">取消</el-button>
                        <el-button class="glBut" type="primary" @click="tagStep+=1 , tag='镜像配置'">下一步</el-button>
                    </div>
                </div>
            </div>
            <div class="jbpz" v-if="tagStep===2" >
<!--                <div class="srkType">-->
<!--                    <span style="margin-right: 3%">镜像名称</span>-->
<!--                    <el-input class="srk" v-model="addImage.image_name" placeholder="请输入内容"></el-input>-->
<!--                </div>-->
<!--                <div class="radioType">-->
<!--                    <div style="margin-right: 15%">-->
<!--                        <span style="margin-right: 5%">镜像构建方式</span>-->
<!--                        <el-radio v-model="dockerOrTar" label="dockerfile">Dockerfile</el-radio>-->
<!--                        <el-radio v-model="dockerOrTar" label="tar">Tar包导入</el-radio>-->
<!--                    </div>-->
<!--                </div>-->
                <div class="tar" v-if="dockerOrTar==='tar'">
                    <span style="margin-right: 5%;margin-top: 4%">上传Tar包</span>
                    <el-upload
                            class="upload-demo"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            multiple
                            :limit="1"
                            :on-exceed="handleExceed"
                            :file-list="fileList">
                        <div class="uploadBgImg">
                            <!--                            只能上传jpg/png文件，且不超过500kb-->
                        </div>
                    </el-upload>
                </div>
                <div class="radioType" v-if="dockerOrTar==='dockerfile'">
                    <div style="margin-right: 15%;margin-top: 5%">
<!--                        <span style="margin-right: 5%">代码形式</span>-->
                        <span style="margin-right: 5%">镜像构建方式</span>
                        <el-radio v-model="radioOwnership2" label="1">直接上传</el-radio>
                        <el-radio v-model="radioOwnership2" label="2">git拉取</el-radio>
                    </div>
                </div>
                <div class="tar" v-if="dockerOrTar==='dockerfile'&&radioOwnership2==='1'" style="margin-left: 36%">
<!--                    <div class="uploadBgImg">-->
                        <input class="uploadBgImg" type="file" @change="onFileChange">
                        <!--                            只能上传jpg/png文件，且不超过500kb-->
<!--                    </div>-->
<!--                    <el-upload-->
<!--                            class="upload-demo"-->
<!--                            :on-preview="handlePreview"-->
<!--                            :on-remove="handleRemove"-->
<!--                            :before-remove="beforeRemove"-->
<!--                            multiple-->
<!--                            :limit="1"-->
<!--                            :on-exceed="handleExceed"-->
<!--                            :file-list="fileList">-->
<!--                        <div class="uploadBgImg">-->
<!--                            &lt;!&ndash;                            只能上传jpg/png文件，且不超过500kb&ndash;&gt;-->

<!--                        </div>-->
<!--                    </el-upload>-->
                </div>
                <div class="tar" v-if="dockerOrTar==='dockerfile'&&radioOwnership2==='1'" style="margin-left: 36%">
                    <span style="color: #00C0FF">仅支持zip tar.gz，且文件名不可包含特殊字符 '!@#)(' </span>
                </div>
                <div  v-if="radioOwnership2==='2'&&dockerOrTar==='dockerfile'">
                    <div class="srkType">
                        <span style="margin-right: 3%">git地址</span>
                        <el-input class="srk" v-model="addImage.git_address" placeholder="请输入内容"></el-input>
                    </div>
                    <div class="srkType">
                        <span style="margin-right: 3%">分支名</span>
                        <el-input class="srk" v-model="addImage.git_branch" placeholder="请输入内容"></el-input>
                    </div>
                    <div class="srkType">
                        <span style="margin-right: 3%">git账号</span>
                        <el-input class="srk" v-model="addImage.git_account" placeholder="请输入内容"></el-input>
                    </div>
                    <div class="srkType">
                        <span style="margin-right: 3%">git密码</span>
                        <el-input class="srk" v-model="addImage.git_password" placeholder="请输入内容"></el-input>
                    </div>
                    <div class="srkType">
                        <span style="margin-right: 3%">启动命令</span>
                        <el-input class="srk" v-model="addImage.run_command" placeholder="请输入内容"></el-input>
                    </div>
                    <div class="srkType">
                        <span style="margin-right: 3%">启动参数</span>
                        <el-input class="srk" v-model="addImage.run_args" placeholder="请输入内容"></el-input>
                    </div>
                    <div class="radioType" v-if="addImage.establish_mode==='git'">
                        <div style="margin-left: 1%">
                            <span style="margin-right: 5%">递增镜像版本号</span>
                            <el-radio v-model="addImage.version_operate" label="add">是</el-radio>
                            <el-radio v-model="addImage.version_operate">其他</el-radio>
                            <el-input style="width: 20%;margin-left: 2%;background-color: #0c295b;display: inline-block;border: none;"
                                      v-model="addImage.image_version" placeholder="必须含有数字" v-if="addImage.version_operate!='add'"></el-input>
                        </div>
                    </div>
                </div>
                <div class="dockerFile" v-if="radioOwnership2==='2'">
                    <el-upload
                            class="upload-demo"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            multiple
                            :limit="1"
                            :on-exceed="handleExceed"
                            :file-list="fileList">
                        <div class="uploadBgImg">
                            <!--                            只能上传jpg/png文件，且不超过500kb-->
                        </div>
                    </el-upload>

                </div>
                <div class="anType">
                    <div>
                        <el-button class="glBut" type="primary" @click="CustomizationImageFales()">取消</el-button>
                        <el-button class="glBut" type="primary" @click="tagStep-=1 , tag='基本配置'">上一步</el-button>
                        <el-button class="glBut" type="primary" @click="tagStep+=1 , tag='构建'">下一步</el-button>
                    </div>
                </div>
            </div>
            <div class="jbpz" v-if="tagStep===3">
                <div style="width: 50%;float: left;margin-left: 10%">
                    <div style="margin-right: 10%">
                        <div><el-radio v-model="addImage.direct"  :label="getLabel(true)" style="margin-top: 15%">直接构建</el-radio></div>
                        <div><el-radio v-model="addImage.direct"  :label="getLabel(false)" style="margin-top: 15%">仅添加配置</el-radio></div>
                    </div>
                </div>
                <div class="anType">
                    <div>
                        <el-button class="glBut" type="primary" @click="CustomizationImageFales()">取消</el-button>
                        <el-button class="glBut" type="primary" @click="tagStep-=1 , tag='镜像配置'">上一步</el-button>
                        <el-button class="glBut" type="primary" @click="image_id===0?addImageToBark():updateImageToBark()">确定</el-button>
                    </div>
                </div>
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
    // import 'prismjs/themes/prism-solarizedlight.css';  // 代码的其他样式风格
    // import 'prismjs/themes/prism-coy.css';
    // import 'prismjs/themes/prism-tomorrow.css';
    import 'prismjs/themes/prism.css';  // 如果想代码换个样式风格，把这个注释了，上面的三个放开一个
    export default {
        name: "imageMange",
        // props:['fTag','fInput','fFrom','FIsConfigQuery'],
        // components:{
        //     router
        // },
        components: { PrismEditor },
        data(){
            return{
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
                tagStep:1,
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
                options: [{
                    value: '',
                    label: '全部镜像'
                }, {
                    value: 'system',
                    label: '系统'
                }, {
                    value: 'buildin',
                    label: '内置'
                }, {
                    value: 'define',
                    label: '自定义'
                }],
                delTimer: null,
                counter: 0

            };
        },
        mounted() {
        },
        watch: {
        },
        created() {
            this.getImages()
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
                console.log("RRRRRRRRRRRRRRRRRRRRRRRRR")
                console.log(val)
                console.log("RRRRRRRRRRRRRRRRRRRRRRRRR")
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
                this.image_id=0
                this.addImage=this.barkImageParmer
            },
            customizationImage(val){
                this.tagStep=1;
                this.tag="基本配置"
                if(val!=null){
                    this.image_id=val.id
                    this.addImage=val
                    this.infoImage(this.image_id);
                    this.thereToOne(val.define_image[0].establish_mode)
                }
                this.newlyPztj=true;
                document.querySelector('.mask').style.display = 'block'
            },
            getLabel(boolValue) {
                return boolValue ? true: false;
            },
            buildImage(val){
                let data={
                    "image_id":val,
                }
                this.$axios.get(this.$http.api.asyncBuildImage,data).then(res=>{
                    console.log('getImages======',res)
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
                    console.log('getImages======',res)
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
                    console.log('getImages======',res)
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
                    console.log('getImages======',res)
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
            updateAndQuery(){
                this.page=1;
                this.getImages()
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size=val
                this.getImages()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.page=val
                this.getImages()
            },
            getImages(){
                let data={
                    // "image_name":"da",
                    "image_type":this.selectImageStateValue,
                    "image_name":this.queryByImageName,
                    "image_state":this.selectImageStateValue,
                    "page":this.page,
                    "size":this.size
                }
                this.$axios.get(this.$http.api.getImages,data).then(res=>{
                        console.log('getImages======',res)
                        if(res.code===200){
                            this.tableData=res.result.items
                            this.total=res.result.total
                        }
                    }).catch(err=>{
                        console.log(err)
                })
            },
            selectImageState(){
                this.page=1
                console.log(this.selectImageStateValue)
                this.getImages()
            },
            NobuildingImage(){
                console.log("无需重新构建")
            },
            highlighter(code) {
                return highlight(code, languages.js)
            },
            getInfo(info){
                document.querySelector('.mask').style.display = 'block'
                this.addImage=info;
                if(info.define_image[0].establish_mode==='tar'){
                    this.infoType='tar'
                }else if(info.define_image[0].establish_mode==='git'
                    || info.define_image[0].establish_mode==='code'){
                    this.infoType='docker'
                }
            },
            updateTag(val){
                this.tag=val
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleRemove(file, fileList) {
                console.log("111111111")
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log("2222222222222")
                console.log(file);
            },
            handleExceed(files, fileList) {
                console.log("3333333333333")
                this.$notify.warning(`当前限制选择 1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                console.log("444444444444")
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
    .custom-table {
        width: 100%;
        height: 100%;
    }
    .my-editor {
        /*background: #fa3919;*/
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
        /*background-color: #cce2ff !important;*/
        background-color: #322dff !important;
        /*color: #000 !important;*/
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
        width: 40%;
        height: 70%;
        position: absolute; /* 绝对定位 */
        /*position: relative;*/
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
            height: 100%;
            position:relative;
            .project{
                display: inline-block;
                width: 100%;
                /*float: left;*/
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
                /*margin-bottom: 2%;*/
                /*width: 100%;*/
                /*text-align: center;*/
                .glBut{
                    width: 90px;
                    height: 30px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    /*margin-left: 10%;*/
                    background-color: rgba(24, 133, 234, 0.2);
                    color: #1b7cc4;
                }

            }
        }
    }
    .range-manage{
        width: 100%;
        height: 100%;
        /*background-color: #010f4e;*/
        /*background-color: rgba(255, 25, 49, 0.4);*/
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
                    /*background-color: #af321e;*/
                    .row {
                        width: 100%;
                        .cell {
                            float: left;
                            display: inline-block;
                            width: 50%;
                            /*background-color: #2daf23;*/
                            padding: 10px;
                            /*border: 1px solid #ccc;*/
                            border: none;
                            text-align: left;
                            font-size: 18px;
                            color: #8c8faf;
                        }
                        .cellA {
                            float: left;
                            display: inline-block;
                            width: 51%;
                            /*background-color: #2daf23;*/
                            padding: 10px;
                            /*border: 1px solid #ccc;*/
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
                height: 84%;
                /*max-height: 84%;*/
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
            .page{
                width: 95%;
                height: 5%;
                margin-left: 2%;
                /*background-color: #ec171d;*/
                padding-left: 35%;
                padding-top: 0.9%;
                .el-pagination {
                    transform: scale(1.5);
                }
                .el-pagination .btn-next, .el-pagination .btn-prev {
                    background: #0b6f08 !important;
                    color: #00F1FF !important;
                }
                /*.el-pagination .number:not(.active) {*/
                /*    background-color: red !important;*/
                /*    color: white;*/
                /*}*/
                /*.el-pagination button:disabled{*/
                /*    background-color: #a10e0e;*/
                /*}*/


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