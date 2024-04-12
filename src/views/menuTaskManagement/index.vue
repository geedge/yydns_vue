<template>
  <div class="range-config-manage" ref="appRef">
      <div class="show">
          <Header
              @addRole="addRole"
          ></Header>
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
                      prop="role_name"
                      label="角色"
                      width="200"/>
                  <el-table-column
                      align="center"
                      prop="permissions"
                      label="权限"
                      min-width="150">
                      <template slot-scope="scope">
                        <div class="permission-btn" v-for="permission in scope.row.permissions" :key="scope.row.id + '' + permission.id">
                          <span v-loading="permission.delLoading">
                            {{ permission.permission_name }}
                          </span>
                          <svg-icon icon-class="closeBtn" @click="delPermission(permission, scope.row.id)"></svg-icon>
                        </div>
                      </template>
                  </el-table-column>
                  <el-table-column
                      align="center"
                      label="操作"
                      width="200"
                  >
                      <template slot-scope="scope">
                          <el-button type="text" size="medium" @click="edit(scope.row)">修改权限</el-button>
                          <el-button type="text" size="small" :loading="scope.row.delLoading" @click="del(scope.row)">删除</el-button>
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
          size: 10,
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
      this.getPermissionDict()
      this.init()
  },
  methods:{
      init(params={}) {
        //   this.tableData = getTargetsResponse?.result?.items
        //   this.total = getTargetsResponse?.result?.total

          // TODO: 暂时注释接口
          const reqParams = {
              page: this.page,
              size: this.size,
              ...params
          }
          this.loading = true
          this.$axios.get(this.$http.api.getRoleList, reqParams).then(res => {
              if (res.code == 200 || res.code == "OK") {
                  this.total = res?.result?.total
                  this.tableData = res?.result?.items
                  this.tableData.map(item => {
                    item.permissions.map(permi => {
                        this.$set(permi, 'delLoading', false)
                        return permi
                    })
                    return item
                  })
              }
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
      }
  }
}

</script>

<style lang='less' scoped="scoped">
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
          height: 84%;
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
