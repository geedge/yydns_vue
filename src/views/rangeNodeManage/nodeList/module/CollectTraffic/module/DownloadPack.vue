<template>
    <div 
        class="custom-dialog" 
        v-if="visible"
    >
        <span class="dialog-title">pcap包下载</span>
        <!-- 在此处指定弹窗的样式和内容 -->
        <i class="el-icon-close" style="float: right; padding-right: 10%;padding-top: 2.5%" @click="close"></i>
        <div class="basic-box">
            <div class="content">
                <el-table
                    class="main-table styleTable"
                    ref="multipleTable"
                    v-loading="loading"
                    height="420px"
                    style="width: 100%;"
                    :data="tableData"
                    tooltip-effect="dark"
                    highlight-current-row
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        align="center"
                        type="selection"
                        width="80"/>
                    <el-table-column
                        align="center" 
                        prop="bucket_name"
                        label="桶名称"
                        width="80"/>
                    <el-table-column 
                        align="center"
                        prop="file_name"
                        label="文件名称"
                        min-width="100"/>
                    <el-table-column
                        align="center"
                        prop="size"
                        label="文件大小"
                        min-width="100"
                    >
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="last_modified"
                        label="生成时间"
                        min-width="100"
                    >
                    <template slot-scope="scope">
                        {{ scope.row.last_modified | formatTime }}
                    </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="anDiv">
                <div>
                    <el-button class="glBut but-color" type="primary" @click="download" :loading="downLoading">下载</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RuleForm',
    // props: ['task_id'],
    data() {
        return {
            visible: false,
            loading: false,
            downLoading: false,
            task_id: '',
            tableData: [],
            selectFileNameList: []
        }
    },
    created() {
    },
    methods: {
        init() {
            const reqParams = {
                page: 1,
                size: 99,
                task_id: this.task_id
            }
            this.loading = true
            this.$axios.get(this.$http.api.getPackList, reqParams).then(res => {
                if (res.code == 200 || res.code == "OK") {
                    this.tableData = res?.result?.items
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.loading = false
            })
        },
        handleSelectionChange(selectData) {
            this.selectFileNameList = selectData.map(item => {
                return {
                    bucket_name: item.bucket_name,
                    file_name: item.file_name
                }
            })
        },
        close() {
            this.resetForm()
            document.querySelector('.mask').style.display = 'none'
            this.visible = false
        },
        resetForm() {
        },
        // 下载
        download() {
            if (this.selectFileNameList.length <= 0) {
                this.$notify({
                    title: '请勾选要下载的文件',
                    type: 'warning',
                    duration: 2500
                })
                return
            }
            const reqParams = {
                task_id: this.task_id,
                object_info_list: JSON.stringify(this.selectFileNameList)
            }
            this.downLoading = true
            this.$axios.getFile(this.$http.api.downloadPacp, reqParams).then(res => {
                    if (res.status == 200 || res.statusText == "OK") {
                        const { data, headers } = res
                        const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
                        // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
                        //const blob = new Blob([JSON.stringify(data)], ...)
                        const blob = new Blob([data], {type: headers['content-type']})
                        let dom = document.createElement('a')
                        let url = window.URL.createObjectURL(blob)
                        dom.href = url
                        dom.download = decodeURI(fileName)
                        dom.style.display = 'none'
                        document.body.appendChild(dom)
                        dom.click()
                        dom.parentNode.removeChild(dom)
                        window.URL.revokeObjectURL(url)
                        this.$notify({
                            title: '下载文件成功',
                            type: 'success',
                            duration: 2500
                        })
                    } else {
                        this.$notify({
                            title: '下载文件失败',
                            type: 'success',
                            duration: 2500
                        })                    
                    }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.downLoading = false
                this.close()
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .custom-dialog{
        z-index: 998;
        width: 620px;
        height: 555px;
        position: absolute; /* 绝对定位 */
        top: 50%; /* 向下偏移50% */
        left: 50%; /* 向右偏移50% */
        transform: translate(-50%, -50%); /* 回移50% */
        background-image:url('../../../../../../img/background/dialog660-553.svg');
        background-repeat: no-repeat; /* 可选，防止图像重复 */
        // background-size: 100% 100%; /* 宽度为100%，高度自适应保持宽高比 */
        .dialog-title {
            font-size: 20px;
            float: left;
            margin: 11px 0 11px 20px;
        }
        .basic-box {
            width: 100%;
            min-height: 100%;
            padding: 2%;
            display: flex;
            flex-direction: column;
            .content {
                flex: 1;
                .bcmcDiv{
                    width: 100%;
                    float: left;
                    margin-top: 5%;
                    text-align: center;
                    .bcmc {
                        width: 60%;
                    }
                }
            }
        }
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