<template>
  <div class="range-config-manage" ref="appRef">
      <div class="show">
          <Header
              @addRole="addRole"
          ></Header>
          <div>
              <span style="font-size: 20px;margin-bottom: 1%;margin-top: 0.5%;float: left;margin-left: 3%;color: #00C0FF">至少需要一个代理才能创建任务,每个代理同时只执行一项任务</span>
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
                      prop="id"
                      label="任务编号"
                      width="280"/>
                  <el-table-column
                          align="center"
                          prop="agent"
                          label="执行代理编号"
                          width="280"/>
                  <el-table-column
                      align="center"
                      prop="status"
                      label="当前状态"
                      min-width="150">
                      <template slot-scope="scope">
                          <el-tag type="info" v-if="scope.row.status==='stop'">暂停</el-tag>
                          <el-tag type="warning" v-if="scope.row.status==='working'">执行中</el-tag>
                          <el-tag type="danger" v-if="scope.row.status==='finish'">已完成</el-tag>
                      </template>
                  </el-table-column>
                  <el-table-column
                          align="center"
                          prop="create_time"
                          label="创建时间"
                          width="280"/>
                  <el-table-column
                      align="center"
                      label="操作"
                      width="250"
                  >
                      <template slot-scope="scope">
                          <el-button type="text" size="medium" @click="taskInfo(scope.row)">详情</el-button>
                          <el-button type="text" size="small"  @click="del(scope.row.id)">删除</el-button>
                      </template>
                  </el-table-column>
              </el-table>
          </div>
          <el-pagination
              background
              :current-page="page"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="20"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          >
          </el-pagination>
          <div class="mask"></div>
          <UserForm
              ref="userForm"
              :is-add="isAdd"
              :permission-dict="permissionDict"
              @refresh="init">
          </UserForm>
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
          page: 1,
          size: 20,
          total: 0,
          isAdd: false,
          loading: false,
          target_id: '',
          tableData: [],
          permissionDict: []
      }
  },
  mounted() {

  },
  watch: {},
  created() {
      this.init()
  },
  methods:{
      init(params={}) {
          // TODO: 暂时注释接口
          const reqParams = {
              "page": this.page,
              "per_page": this.size,
              ...params
          }
          this.loading = true
          this.$axios.get(this.$http.api.taskList, reqParams).then(res => {
              // if (res.code == 200 || res.code == "OK") {
              //     this.total = res?.data?.total
                  this.total = 100
                  this.tableData = res?.data
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
          // this.$refs.userForm.title = '新增角色'
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
      del(id) {
          let data={
              "id":id,
          }
          this.$axios.post(this.$http.api.taskDel,data).then(res=>{
              if(res.code===200){
                  this.$message.success(res.msg)
              }else {
                  this.$message.error(res.msg)
              }
          }).catch(err=>{
              console.log(err)
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
      // 详情
      taskInfo(val) {
          this.$router.push({ path: 'menuTaskInfo', query: { row: val } });
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
      }
  }
}

</script>

<style lang='less' scoped="scoped">
    .popup{
        z-index: 997;
        width: 40%;
        height: 70%;
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
          height: 77%;
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
