<template>
  <div class="head">
      <span style="font-size: 14px;float: left;padding-top: 1%">靶场列表</span>
      <img src="../../../img/btn/quickCreateRangeBtn.svg" style="height: 70% ;width: 10%;margin-right: 7%;color: #ffffff" @click="quickAdd">
      <img src="../../../img/btn/customCreateRangeBtn.svg" style="height: 70% ;width: 10%;margin-right: 7%;color: #ffffff" @click="customAdd">
      <div class="input">
          <el-input v-model="target_name" placeholder="名称查询输入" suffix icon="">
              <template v-slot:suffix>
                  <div class="icon-group">
                      <img src="../../../img/inputl.png" alt="**">
                      <img src="../../../img/inputIcon.png" alt="*" @click="query">
                  </div>
              </template>
          </el-input>
      </div>
      <div class="state">
          <el-select v-model="deploy_status" placeholder="全部状态" clearable @change="query">
              <el-option
                      v-for="item in statusDict"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
          </el-select>
      </div>
      <div class="project">
          <el-select v-model="attribute" placeholder="全部工程" clearable @change="query">
              <el-option
                      v-for="item in attributeDict"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
          </el-select>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      target_name: '', // 靶场名称
      deploy_status: '',
      attribute: '',
      statusDict: [
        {
            value: '部署成功',
            label: '部署成功'
        }, 
        {
            value: '部署中',
            label: '部署中'
        }, 
        {
            value: '未部署',
            label: '未部署'
        }, 
        {
            value: '部署失败',
            label: '部署失败'
        }
     ],
     attributeDict: [
        {
            value: 'public',
            label: '公用'
        }, 
        {
            value: 'private',
            label: '私有'
        }
     ],


    }
  },
  methods: {
    quickAdd() {
        this.$emit('quickAdd')
    },
    customAdd() {
        this.$emit('customAdd')
    },
    query() {
        const params = {
            target_name: this.target_name,
            deploy_status: this.deploy_status,
            attribute: this.attribute
        }
        this.$emit('query', params)
    }
  }
}
</script>

<style lang="less" scoped>
  .head{
      width: 95%;
      height: 7%;
      margin-top: 1%;
      margin-left: 2.5%;
      text-align: right;
      .block{
          display: inline-block;
          margin-left: 2%;

      }
      .input{
          display: inline-block;
          height: 60%;
          width: 10%;
          margin-left: 0.5%;
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
      .state{
          display: inline-block;
          height: 60%;
          width: 10%;
          margin-left: 0.5%;
          .custom-popper .el-select-dropdown {
              max-height: 3px;
          }
      }
      .project{
          display: inline-block;
          height: 60%;
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
  }
</style>