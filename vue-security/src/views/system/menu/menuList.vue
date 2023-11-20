<template>
  <el-main>
    <!--  新增按钮  -->
    <el-button icon="el-icon-plus" size="small" type="success" @click="openAddWindow()">新增</el-button>
    <!--  表格数据  -->
    <el-table
      :data="tableData"
      :height="tableHeight"
      :tree-props="{children: 'children'}"
      border
      default-expand-all
      row-key="id"
      style="width: 100%;margin-top: 20px;">
      <el-table-column label="菜单名称" prop="label"></el-table-column>
      <el-table-column align="center" label="菜单类型" prop="type">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type=='0'" size="normal">目录</el-tag>
          <el-tag v-else-if="scope.row.type=='1'" size="normal" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type=='2'" size="normal" type="warning">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="菜单图标" prop="icon">
        <template slot-scope="scope">
          <!--     如果包含el-开头的用i标签，否则用svg-icon     -->
          <i v-if="scope.row.icon.includes('el-icon')" :class="scope.row.icon"/>
          <svg-icon v-else :icon-class="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column label="路由名称" prop="name"></el-table-column>
      <el-table-column label="路由地址" prop="path"></el-table-column>
      <el-table-column label="组件路径" prop="url"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit-outline"
            size="mini"
            type="primary"
            @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button
            icon="el-icon-delete-solid"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  新增或修改窗口  -->
    <system-dialog
      :height="menuDialog.height"
      :title="menuDialog.title"
      :visible="menuDialog.visible"
      :width="menuDialog.width"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form ref="menuForm" :inline="true" :model="menu" :rules="rules" label-width="80px" size="small">
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="menu.type">
                <el-radio :label="0">目录</el-radio>
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-form-item label="所属菜单" prop="parentName" size="small">
            <el-input v-model="menu.parentName" :readonly="true" @click.native="selectParentMenu"/>
          </el-form-item>
          <el-form-item label="菜单名称" prop="label" size="small">
            <el-input v-model="menu.label"></el-input>
          </el-form-item>
          <el-form-item v-if="menu.type==1" label="路由名称" prop="name" size="small">
            <el-input v-model="menu.name"></el-input>
          </el-form-item>
          <el-form-item v-if="menu.type!=2" label="路由地址" prop="path" size="small">
            <el-input v-model="menu.path"></el-input>
          </el-form-item>
          <el-form-item v-if="menu.type==1" label="组件路径" prop="url" size="small">
            <el-input v-model="menu.url"></el-input>
          </el-form-item>
          <el-form-item label="权限字段" prop="code" size="small">
            <el-input v-model="menu.code"></el-input>
          </el-form-item>
          <el-form-item label="菜单图标" size="small">
            <my-icon ref="child" @selectIcon="setIcon"/>
          </el-form-item>
          <el-form-item label="菜单序号" size="small">
            <el-input v-model="menu.orderNum"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
    <!--  选择上级菜单弹框  -->
    <!-- 选择所属菜单弹框 -->
    <system-dialog
      :height="parentDialog.height"
      :title="parentDialog.title"
      :visible="parentDialog.visible"
      :width="parentDialog.width"
      @onClose="onParentClose"
      @onConfirm="onParentConfirm"
    >
      <div slot="content">
        <el-tree
          ref="parentTree"
          :data="parentMenuList"
          :expand-on-click-node="false"
          :highlight-current="true"
          :props="defaultProps"
          :show-checkbox="false"
          default-expand-all
          empty-text="暂无数据"
          node-key="id"
          style="font-size: 14px"
          @node-click="handleNodeClick"
        >
          <div slot-scope="{ node, data }" class="customer-tree-node">
            <!--            &lt;!&ndash; 长度为0说明没有下级 &ndash;&gt;-->
            <!--            <span v-if="data.children.length === 0">-->
            <!--              <i class="el-icon-document" style="color: #8c8c8c; font-size: 18px"/>-->
            <!--            </span>-->
            <!--            <span v-else>-->
            <!--              <svg-icon v-if="data.open" icon-class="add_circle_outlined"/>-->
            <!--              <svg-icon v-else icon-class="remove_circle_outlined"/>-->
            <!--            </span>-->
            <span style="margin-left: 3px">{{ node.label }}</span>
          </div>
        </el-tree>
      </div>
    </system-dialog>
  </el-main>
</template>

<script>
import {addMenu, checkPermission, deletePermissionById, getMenuList, getParentMenuList, updateMenu} from "@/api/menu";
import systemDialog from "@/components/system/systemDialog.vue";
import myIcon from "@/components/system/MyIcon.vue";

export default {
  components: {
    systemDialog,
    myIcon
  },
  data() {
    return {
      tableData: [],
      tableHeight: 0,
      menuDialog: {
        title: '新增菜单',
        visible: false,
        width: 630,
        height: 270
      },
      //菜单属性
      menu: {
        id: "",
        type: "",
        parentId: "",
        parentName: "",
        label: "",
        icon: "",
        name: "",
        path: "",
        url: "",
        code: "",
        orderNum: ""
      },
      rules: {
        type: [{required: true, trigger: "change", message: "请选择菜单类型"}],
        parentName: [{required: true, trigger: "change", message: "请选择所属菜单"}],
        label: [{required: true, trigger: "blur", message: "请输入菜单名称"}],
        name: [{required: true, trigger: "blur", message: "请输入路由名称"}],
        path: [{required: true, trigger: "blur", message: "请输入路由路径"}],
        url: [{required: true, trigger: "blur", message: "请输入组件路径"}],
        code: [{required: true, trigger: "blur", message: "请输入权限字段"}],
      },
      //上级菜单弹框属性
      parentDialog: {
        title: '选择所属菜单',
        width: 280,
        height: 450,
        visible: false
      },
      //树属性定义
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      parentMenuList: [] //所属菜单列表
    }
  },
  methods: {
    /**
     * 打开新增窗口
     */
    openAddWindow() {
      //加入快速清空表单
      this.$resetForm('menuForm', this.menu)
      //清空菜单图标
      this.$nextTick(() => {
        this.$refs['child'].userChooseIcon = ''
      })
      //设置窗口标题
      this.menuDialog.title = '新增菜单'
      //显示窗口
      this.menuDialog.visible = true

    },
    /**
     * 关闭取消按钮的点击事件
     */
    onClose() {
      this.menuDialog.visible = false
    },
    /**
     * 确认按钮点击事件
     */
    async onConfirm() {
      //表单验证
      this.$refs.menuForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          //判断当前操作事更新还是新增
          if (this.menu.id === '') {
            res = await addMenu(this.menu)
          } else {
            //发送修改请求
            res = await updateMenu(this.menu)
          }

          if (res.success) {
            this.$message.success(res.message)
            this.search();
            this.menuDialog.visible = false
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    /**
     * 选择所属菜单
     */
    selectParentMenu() {
      //显示窗口
      this.parentDialog.visible = true;
      //发起请求
      getParentMenuList().then((res => {
        if (res.success) {
          this.parentMenuList = res.data
        }
      }))
    },
    /**
     * 所属菜单节点点击事件
     */
    handleNodeClick(data) {
      //所属父级菜单ID
      this.menu.parentId = data.id;
      //所属父级菜单名称
      this.menu.parentName = data.label;
    },
    onParentClose() {
      this.parentDialog.visible = false
    },
    onParentConfirm() {
      this.parentDialog.visible = false
    },
    //给icon绑定的点击事件
    setIcon(icon) {
      //将i的样式设为选中的样式el-icon-xxx
      //将选中的图标传递给父组件
      // this.$emit("selectIcon",icon)
      this.menu.icon = icon;
    },
    handleEdit(row) {
      this.$objCopy(row, this.menu)
      //回显菜单图标
      this.$nextTick(() => {
        this.$refs['child'].userChooseIcon = row.icon
      })
      //设置窗口标题
      this.menuDialog.title = '编辑菜单'
      //显示窗口
      this.menuDialog.visible = true
    },
    async handleDelete(row) {
      //查询菜单下是否有子菜单
      let result = await checkPermission({id: row.id});
      //判断是否可以删除
      if (!result.success) {
        //提示不能删除
        this.$message.warning(result.message);
      } else {
        //确认是否删除
        let confirm = await this.$myconfirm("确定要删除该数据吗?");
        if (confirm) {
          //发送删除请求
          let res = await deletePermissionById({id: row.id});
          //判断是否成功
          if (res.success) {
            //成功提示
            this.$message.success(res.message);
            //刷新
            this.search();
          } else {
            //失败提示
            this.$message.error(res.message);
          }
        }
      }
    },


    search() {
      //发送查询请求 注意参数
      getMenuList({}).then(res => {
        if (res.success) {
          this.tableData = res.data
        }
      })
    }
  },
  mounted() {
    //计算form表单的高度
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 180;
    })
  },
  created() {
    this.search()
  }
}
</script>

<style lang="scss" scoped>
.iconList {
  width: 400px;
  height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  i {
    display: inline-block;
    width: 60px;
    height: 45px;
    color: #000000;
    font-size: 20px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    line-height: 45px;
    margin: 5px;

    &:hover {
      color: orange;
      border-color: orange;
    }
  }
}

.chooseIcons {
  width: 175px;
  background-color: #FFFFFF;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 33px;
  line-height: 25px;
  outline: none;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>
