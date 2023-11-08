<template>
  <div
    v-loading="loading"
    class="roles-box"
  >

    <div class="role-table">
      <div class="table-head">
        <div>模块权限</div>
        <div>菜单权限</div>
        <div>按钮权限</div>
      </div>
      <div class="role-table-wrapper">
        <el-scrollbar
          ref="scrollbar"
          class="role-table__scrollbar"
          tag="div"
          wrap-style="overflow-x: hidden;"
        >
          <table>
            <tr v-for="(level1, index1) in roles" :key="index1">
              <!--模块权限-->
              <td style="flex: none;text-align: center;width: 170px;">
                <div class="level1">{{ level1.name }}</div>
              </td>
              <!--二级菜单-->
              <td style="flex: none;text-align: center;">
                <div class="content-wrapper">
                  <div v-for="(level2, index2) in level1.children" :key="index2" class="level2" style="display: flex;">
                    <div class="level2-name" style="flex: none;width: 170px;">{{ level2.name }}</div>
                    <div class="content-children">

                      <div class="level4" style="display: flex;flex-wrap: wrap;">
                        <div class="roles_check">
                                <span v-if="level2.children && level2.children.length">
                                  <el-checkbox
                                    :key="level2.id"
                                    v-model="selectAll[level2.id]"
                                    @change="selectColumn(level2.children,$event,{},'all',level2.id)"
                                  >
                                    全选
                                  </el-checkbox>
                                </span>
                          <span v-else>无</span>
                        </div>
                        <div v-for="(model,index) in level2.children" :key="index">
                          <div v-if="model.name !=='标识页面权限' " class="roles_check">
                            <el-checkbox
                              v-model="model.checked"
                              @change="selectColumn(model, $event, level2, 'single', level2.id)">
                              {{ model.name }}
                            </el-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </el-scrollbar>
      </div>
    </div>
    <el-button :loading="loading" size="small" type="primary" @click="submit">保存</el-button>
    <el-button :loading="loading" size="small" type="info" @click="handleCancel">取消</el-button>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    roles: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filterIdLength: 8,
      checkedList: [],
      roleStatusList: [
        {
          name: '启用',
          value: true
        },
        {
          name: '禁用',
          value: false
        }
      ],
      roleTypeAllList: new Map(), // 全部按钮权限
      ruleForm: {
        name: '',
        status: '',
        type: '',
        attribute: 'unit'
      },
      selectAll: {},
    }
  },
  mounted() {
    this.setCheckedItems(this.roles) // 菜单按钮权限
    this.getMapRoleTypeAllList(this.roles)
  },
  methods: {
    // 全选-菜单按钮权限
    selectColumn(data = [], valb, childData, key, allname) {
      // 全选 涉及到数据记录的更改、单选的变动
      if (key === 'all') {
        this.selectAll[allname] = valb
        for (let i = 0; i < data.length; i++) {
          data[i].checked = valb
          this.setCheckedData(data[i], valb)
        }
      } else if (key === 'single') {
        // 单选 涉及到数据记录的更改、全选的变动
        // 取消查看-取消当前菜单下全部操作权限
        if (data.alias.includes('_CHECK') && !valb) {
          childData.children.map(v => {
            this.$set(v, 'checked', false)
          })

          childData.children.map(child => {
            this.checkedList.map(item => {
              if (child.id === item.id) {
                this.$set(item, 'checked', child.checked)
              }
            })
          })

          let tempList = []
          let list = JSON.parse(JSON.stringify(this.checkedList))
          for (let i = 0; i < list.length; i++) {
            if (list[i].checked) {
              tempList.push(list[i])
            }
          }
          this.$set(this, 'checkedList', tempList)

          this.selectAll[allname] = false
        }
        const checkObj = childData.children.find(v => v.alias.includes('_CHECK')) || {}
        if (!data.alias.includes('_CHECK') && !checkObj.checked && valb) {
          this.$set(checkObj, 'checked', true)
          this.checkedList.push(checkObj)
        }
        this.setCheckedData(data, valb)
        this.selectAll[allname] = this.hasAllChecked(childData.children) // 子集一变动，全选重置
      }
    },

    // 数据增删当前已选
    setCheckedData(role, valb) {
      if (!role) {
        return
      }
      // 选中就添加，取消就去掉()
      const hadLen = this.hasExist(role)
      if (hadLen < 0 && valb) {
        this.checkedList.push(role)
      }
      if (hadLen >= 0 && !valb) {
        this.checkedList.splice(this.hasExist(role), 1)
      }
    },
    // 该选项是否已经存在
    hasExist(role) {
      const list = this.checkedList
      let exist = -1
      for (let i = 0; i < list.length; i++) {
        if (list[i] && list[i].hasOwnProperty('id')) {
          if (list[i].id === role.id) {
            exist = i
          }
        }
      }
      return exist
    },
    // 是否全部选中
    hasAllChecked(list) {
      return list.every(item => {
        return item.checked
      })
    },
    // 递归处理树结构，将树结构最后一级元素抽离出来
    getAllLastChildrenItem(list) {
      if (list.children.length) {
        this.selectAll[list.id] = this.hasAllChecked(list.children)
        for (let i = 0; i < list.children.length; i++) {
          this.getAllLastChildrenItem(list.children[i])
        }
      } else {
        if (list.checked) {
          this.checkedList.push(list)
        }
      }
    },

    // 抽取全部按钮权限
    getMapRoleTypeAllList(list) {
      list.forEach((item) => {
        if (item.children && item.children.length > 0) {
          if (item.id.length === this.filterIdLength) {
            this.roleTypeAllList.set(item.id, (this.roleTypeAllList.get(item.id)) || item.children)
          }
          this.getMapRoleTypeAllList(item.children)
        }
      })
    },
    // 对于编辑而言，一进来应该把标记的选项保存
    setCheckedItems(list) {
      for (let i = 0; i < list.length; i++) {
        this.getAllLastChildrenItem(list[i])
      }
    },
    submit() {
      this.$refs.detailsFormId.validate(valid => {
        if (valid) {
          if (!this.checkedList.length) {
            this.$message.warning("菜单权限为空")
            return
          }
          const roleOption = {
            name: this.ruleForm.name,
            use: this.ruleForm.status,
            type: this.ruleForm.type,
            unitDepartmentLevel: this.ruleForm.attribute,
            permissions: this.checkedList
          }
          this.$emit('save-role', roleOption)
        }
      })
    },
    handleCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="stylus" scoped>
.roles-box
  height 75vh

  .button_list
    margin-top 24px

    .el-button + .el-button
      margin-left 10px

  >>> .collapse_panel
    .el-collapse-item__wrap
      border-bottom none

    .el-collapse-item__content
      padding-bottom 0

  .content-children
    width 100%

.role-name
  margin-top 20px

.role-name span
  padding-right 15px
  width 70px
  color #606266
  font-size 14px
  line-height 38px

.role-name input
  box-sizing border-box
  padding 0 15px
  width calc(100% - 95px)
  height 38px
  outline none
  border 1px solid #ebebeb
  border-radius 19px
  background rgba(245, 248, 253, 1)
  font-size 15px

.role-all_show
  margin-bottom 15px
  color #303133
  font-size 16px

.table-head
  display flex
  align-items center
  box-sizing border-box
  width 100%
  height 40px
  border 1px solid #ebebeb
  font-size 16px

.table-head > div:first-child, .table-head > div:nth-child(2), .table-head > div:nth-child(3), .table-head > div:nth-child(4)
  width 170px
  text-align center

.table-head > div:last-child
  flex 1
  text-align center

.role-table table
  margin 0 0 2px 0
  padding 0
  width 100%
  border-collapse collapse

tr td
  margin 0
  padding 0

.title-about__model
  width 170px
  text-align center

.title-about__name
  border-top solid 1px #ebebeb
  border-left solid 1px #ebebeb

.roles_list
  display flex
  width 100%

.roles_pege
  display flex
  justify-content center
  align-items center
  padding 30px 10px
  width 170px
  border-top solid 1px #ebebeb
  border-left solid 1px #ebebeb

td
  border-right solid 1px #ebebeb
  border-bottom solid 1px #ebebeb
  border-left solid 1px #ebebeb

.level1
  padding 10px 0

.level2-name
  padding 10px 0

.level3, .level4
  border-left solid 1px #ebebeb

.level2:not(:last-child)
  border-bottom solid 1px #ebebeb

.level3:not(:last-child)
  border-bottom solid 1px #ebebeb

.level2, .level3, .level4
  align-items center

.roles_roles
  display flex
  flex-wrap wrap
  align-items center
  width calc(100% - 170px)
  border-top solid 1px #ebebeb
  border-right solid 1px #ebebeb
  border-left solid 1px #ebebeb

.roles_check
  padding 10px

.role-modal-footer
  display flex
  justify-content center
  margin-top 15px
  width 100%

.role-table-wrapper
  height 55vh
  border-bottom solid 1px #ebebeb

.role-table__scrollbar
  overflow hidden
  width 100%
  height 99%
</style>
