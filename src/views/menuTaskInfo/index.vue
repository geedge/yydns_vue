<template>
  <div class="range-config-manage" ref="appRef">
      <div class="show">
          <Header
              @addRole="addRole"
          ></Header>
          <div class="header2">
              <div style="width: 45%; display: inline-block;">
                  <el-descriptions class="custom-descriptions" >
                      <el-descriptions-item label="任务名称" >{{parentLevelRow.name}}</el-descriptions-item>
                      <el-descriptions-item label="代理编号">{{parentLevelRow.id}}</el-descriptions-item>
                      <el-descriptions-item label="执行状态">
                          <el-tag type="info" v-if="parentLevelRow.status==='stop'">暂停</el-tag>
                          <el-tag type="warning" v-if="parentLevelRow.status==='working'">执行中</el-tag>
                          <el-tag type="danger" v-if="parentLevelRow.status==='finish'">已完成</el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item label="任务目标">
                          {{parentLevelRow.target}}
                          <span style="color: #00C0FF;margin-left: 5%" @click="getInfoByIp(parentLevelRow)">查看实时状态</span>
                      </el-descriptions-item>
                  </el-descriptions>
              </div>
              <div style="width: 45%; display: inline-block;">
                  <el-row style="display: flex; flex-direction: row;">
                      <el-col>
                          <div style="display: flex; flex-direction: column; align-items: center;">
                              <el-button type="danger" class="enlarged-button" icon="el-icon-full-screen" circle @click="taskOps(parentLevelRow.id,'stop')"></el-button>
                              <span style="margin-top: 7%">停止</span>
                          </div>
                      </el-col>
                      <el-col>
                          <div style="display: flex; flex-direction: column; align-items: center;">
                              <el-button type="info" class="enlarged-button" icon="el-icon-video-pause" circle @click="taskOps(parentLevelRow.id,'suspend')"></el-button>
                              <span style="margin-top: 7%">暂停</span>
                          </div>
                      </el-col>
                      <el-col>
                          <div style="display: flex; flex-direction: column; align-items: center;">
                              <el-button type="success" class="enlarged-button" icon="el-icon-video-play" circle @click="taskOps(parentLevelRow.id,'start')"></el-button>
                              <span style="margin-top: 7%">开始</span>
                          </div>
                      </el-col>
                  </el-row>
              </div>
          </div>
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
              >
                  <el-table-column
                      align="center"
                      type="index"
                      label="序号"
                      width="150"/>
                  <el-table-column
                      align="center"
                      prop="start_time"
                      label="开始执行时间"
                      width="280"/>
                  <el-table-column
                      align="center"
                      prop="status"
                      label="当前状态"
                      min-width="150"
                      style="width: 50%; height: 10%;"
                  >
                      <template slot-scope="scope">
                          <el-result icon="success" style="transform: scale(0.8)" v-if="scope.row.policy_id === index0tableDataId">
                              <template #title style="color: white;">执行中</template>
                          </el-result>
                          <el-result icon="warning" style="transform: scale(0.8)" v-if="scope.row.policy_id != index0tableDataId">
                              <template #title style="color: white;">无效</template>
                          </el-result>

                      </template>
                  </el-table-column>
                  <el-table-column
                          align="center"
                          prop="policy_name"
                          label="当前策略名称"
                          width="280"/>
                  <el-table-column
                          align="center"
                          prop="policy_param"
                          label="策略载荷生成参数"
                          width="280">
                  </el-table-column>
                  <el-table-column
                          align="center"
                          label="执行输出"
                          min-width="150">
                      <template slot-scope="scope">
                          <el-button type="primary" @click="newlyPztj=!newlyPztj,getLog(scope.row.policy_id)">查看</el-button>
                      </template>
                  </el-table-column>
                  <el-table-column
                          align="center"
                          prop="policy_status"
                          label="效果评估"
                          width="280">
                  </el-table-column>

              </el-table>
          </div>
          <div class="mask"></div>
          <UserForm
              ref="userForm"
              :is-add="isAdd"
              :permission-dict="permissionDict"
              @refresh="init">
          </UserForm>
          <div class="popup" v-if="newlyPztj">
              <span style="font-size: 30px;margin-left: 2%;margin-top: 20%">执行日志 <i class="el-icon-close" style="font-size:15px;float: right; padding-right: 7%;padding-top: 2.8%" @click="CustomizationImageFales()"></i></span>
              <!-- 在此处指定弹窗的样式和内容 -->
<!--              <i class="el-icon-close" style="float: right; padding-right: 7%;padding-top: 2.8%" @click="CustomizationImageFales()"></i>-->
              <div class="list"  style="width: 90%;margin-left: 5%;margin-top: 5%">
                  <el-table
                          class="custom-table"
                          ref="multipleTable"
                          v-loading="loading"
                          element-loading-text="加载中..."
                          height="100%"
                          style="width: 100%;"
                          :data="tableDataLog"
                          tooltip-effect="dark"
                          highlight-current-row
                  >
                      <el-table-column
                              align="center"
                              type="index"
                              label="序号"
                              width="50"/>
                      <el-table-column
                              align="center"
                              prop="time"
                              label="时间"
                              width="160"/>
                      <el-table-column
                              align="center"
                              prop="ip"
                              label="IP"
                              width="130">
                      </el-table-column>
                      <el-table-column
                              align="center"
                              prop="targetip"
                              label="目标IP"
                              width="200"/>
                      <el-table-column
                              align="center"
                              prop="level"
                              label="日志级别"
                              width="100">
                      </el-table-column>
                      <el-table-column
                              align="center"
                              prop="info"
                              label="日志内容"
                              width="200">
                      </el-table-column>

                  </el-table>
              </div>
              <el-pagination
                      class="custom-paginationLog"
                      background
                      :current-page="page"
                      :page-sizes="[10, 20, 30, 40]"
                      :page-size="10"
                      :total="total"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="handleSizeChangeLog"
                      @current-change="handleCurrentChangeLog"
              >
              </el-pagination>


              <footer style="margin-top: 10%">
                  <el-button class="glBut" type="primary" @click="CustomizationImageFales()">取消</el-button>
              </footer>





          </div>
      </div>
  </div>
</template>
<script>
import Header from './module/Header.vue'
import UserForm from './module/UserForm.vue'
import { getTargetsResponse } from './mock.js'
export default {
  name: "RangeConfigManage",
  components:{ Header, UserForm },
  data(){
      return{
          logId:0,
          parentLevelRow:{},
          id_log:'',
          page_log:1,
          per_page_log:10,
          newlyPztj:false,
          page: 1,
          size: 10,
          total: 0,
          isAdd: false,
          loading: false,
          target_id: '',
          tableData: [],
          tableDataLog: [],
          index0tableDataId:0,
          permissionDict: [],
      }
  },
  mounted() {

  },
  watch: {},
  created() {
      this.parentLevelRow = this.$route.query.row;
      this.init()
  },
  methods:{
      getInfoByIp(val){
          this.$router.push({ path: 'menuMBZTGZ', query: { row: val } });
      },
      CustomizationImageFales(){
          this.newlyPztj=false;
          document.querySelector('.mask').style.display = 'none'
      },
      init(params={}) {
          // TODO: 暂时注释接口
          const reqParams = {
              "taskid": (this.parentLevelRow.id)?(this.parentLevelRow.id):0,
              ...params
          }
          this.loading = true
          this.$axios.get(this.$http.api.taskInfo, reqParams).then(res => {
              // if (res.code == 200 || res.code == "OK") {
              //     this.total = res?.data?.total
              //     this.total = 100
                  this.tableData = res?.data
                  this.index0tableDataId=res?.data[0].policy_id
                  this.tableData.map(item => {
                    item.permissions.map(permi => {
                        this.$set(permi, 'delLoading', false)
                        return permi
                    })
                    return item
                  })
              // }
          }).catch(err => {
              console.log(err)
          }).finally(() => {
              this.loading = false
          })
      },
      taskOps(id,type){
          const reqParams = {
              "taskid":id,
              "ops": type,
          }
          this.loading = true
          this.$axios.get(this.$http.api.taskOps, reqParams).then(res => {
              if (res.code == 200) {
                  this.$message.success(type+'成功!')

              }
          }).catch(err => {
              console.log(err)
          }).finally(() => {
              this.loading = false
          })
      },
      getLog(val) {
          // TODO: 暂时注释接口
          document.querySelector('.mask').style.display = 'block',
          this.logId=val

          const reqParams = {
              "id":this.logId,
              "page": this.page_log,
              "per_page": this.per_page_log,
          }
          this.loading = true
          this.$axios.get(this.$http.api.taskInfoLog, reqParams).then(res => {
              // if (res.code == 200 || res.code == "OK") {
              //     this.total = res?.data?.total
              this.total = 100
              this.tableDataLog = res?.data
              this.tableData.map(item => {
                  item.permissions.map(permi => {
                      this.$set(permi, 'delLoading', false)
                      return permi
                  })
                  return item
              })
              // }
          }).catch(err => {
              console.log(err)
          }).finally(() => {
              this.loading = false
          })
      },
      getLogPage() {
          // TODO: 暂时注释接口
          document.querySelector('.mask').style.display = 'block'
          const reqParams = {
              "id":this.logId,
              "page": this.page_log,
              "per_page": this.per_page_log,
          }
          this.loading = true
          this.$axios.get(this.$http.api.taskInfoLog, reqParams).then(res => {
              // if (res.code == 200 || res.code == "OK") {
              //     this.total = res?.data?.total
              this.total = 100
              this.tableDataLog = res?.data
              this.tableData.map(item => {
                  item.permissions.map(permi => {
                      this.$set(permi, 'delLoading', false)
                      return permi
                  })
                  return item
              })
              // }
          }).catch(err => {
              console.log(err)
          }).finally(() => {
              this.loading = false
          })
      },
      query(params) {
          this.init(params)
      },
      // 打开添加角色dialog
      addRole() {
          this.isAdd = true
          this.$refs.userForm.title = '新增角色'
          document.querySelector('.mask').style.display = 'block'
          this.$refs.userForm.visible = true
      },
      // 删除权限
      delPermission(permission, role_id) {
        const url = this.$http.api.delPermission + '/' + role_id
        permission.delLoading = true
          this.$axios.put(url, {}, {permission_id: permission.id}).then(res => {
              if (res.code == 200 || res.code == "OK") {
                  this.$notify({
                      title: '删除权限成功',
                      type: 'success',
                      duration: 2500
                  })
                  this.init()
              }
          }).catch(err => {
              console.log(err)
          }).finally(() => {
              permission.delLoading = false
          })
      },
      // 删除
      del(row) {
          this.$confirm('此操作将永久删除该角色, 是否继续?', '确认删除', {
              confirmButtonText: '确认删除',
              cancelButtonText: '取消',
              type: 'info'
              }).then(() => {
                  this.delUser(row)
              }).catch(() => {
                  this.$notify({
                      type: 'info',
                      message: '已取消删除'
                  })     
          })
      },
      delUser(row) {
          const url = this.$http.api.delRole + '/' + row.id
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
      // 修改
      edit(row) {
          this.isAdd = false
          this.$refs.userForm.title = '修改权限'
          this.$refs.userForm.role_id = row.id
          this.$refs.userForm.form.role_name = row.role_name
          this.$refs.userForm.form.permissions = row.permissions.map(permission => permission.id)
          this.getPermissionDict()
          document.querySelector('.mask').style.display = 'block'
          this.$refs.userForm.visible = true
      },
      // 获取权限字典
      getPermissionDict() {
          const params = {
              page: 1,
              size: 99
          }
          this.$axios.get(this.$http.api.getPermissionList, params).then(res => {
              if (res.code == 200 || res.code == "OK") {
                  this.permissionDict = res?.result?.items.map(item => {
                      return {
                          label: item.permission_name,
                          value: item.id
                      }
                  })
              }
          }).catch(err => {
              console.log(err)
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
      handleSizeChangeLog(val) {
          console.log(`每页 ${val} 条`)
          this.page=1
          this.size=val
          this.getLogPage()
      },
      // 修改页数
      handleCurrentChangeLog(val) {
          console.log(`当前页: ${val}`)
          this.page=val
          this.getLogPage()
      },
  }
}

</script>

<style lang='less' scoped="scoped">
    .custom-paginationLog{
        /*float: right;*/
        /*margin-left: 20%;*/
        transform: scale(0.8);
        /*display: flex;*/
        /*justify-content: flex-end; !* 使用 Flexbox 将内容靠右 *!*/
        /*/deep/ .el-pagination{*/
        /*    float: right;*/
        /*}*/
    }
    /*.custom-paginationLog /deep/ .el-pagination  /deep/ .is-background {*/
    /*    float: right;*/
    /*}*/
    .popup{
        z-index: 997;
        width: 50%;
        height: 90%;
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
            margin-left: 23%;
            height: 100%;
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
    .header2{
        white-space: nowrap;
        width: 100%;
        height: auto;
        margin-bottom: 1%;
        margin-left: 2.5%;
        .enlarged-button {
            transform: scale(1.5); /* 将按钮和图标整体放大 1.5 倍 */
            margin-left: 3%;
            margin-right: 3%;
        }
        .custom-descriptions{
            background-color: rgba(0,0,0,0);
            /deep/ .el-descriptions-item{
                background-color: rgba(19, 34, 99, 1);
            }


        }
        /*.custom-descriptions /deep/ .el-descriptions{*/
        /*    background-color: #f04247; !* 设置背景颜色为灰色 *!*/
        /*}*/
    }
.custom-table {
  width: 100%;
  height: 100%;
  .permission-btn {
    display: inline-block;
    margin: 6px;
    padding: 5px 8px;
    border-radius: 3px;
    color:rgba(0, 0, 0, 0.90);
    background: #02DDEA;
  }
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
          height: 70%;
          margin-left: 2.5%;
          overflow-y: auto;
          overflow-y: scroll;
          overflow-x: hidden;
          border: none;
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
