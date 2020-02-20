<template>
  <el-card class="z-table">
    <!-- <el-divider content-position="left">所有设备指令</el-divider> -->
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="z-table-control">
          <el-button type="primary" @click="handleProductCreate">新增GPS产品</el-button>
        </div>
        <template v-if="productList.length > 0">
          <el-divider content-position="left">产品类型</el-divider>
          <!-- <el-menu default-active="0" @select="handleSelect" style="border-right: none;">
            <el-menu-item v-for="(device, index) in productList" :key="index" :index="String(index)">
              <i class="el-icon-s-promotion"></i>
              <span slot="title">{{device.deviceDesc}}</span>
            </el-menu-item>
          </el-menu> -->
          <el-table :data="productList" :show-header="false" @row-click="handleSelect" :highlight-current-row="true">
            <el-table-column prop="deviceDesc"> </el-table-column>
            <el-table-column fixed="right" width="100px">
              <template slot-scope="scope">
                <el-link type="primary" @click.native.stop="handleProductEdit(scope.row)">修改</el-link>
                <el-divider direction="vertical"></el-divider>
                <el-link type="danger" @click.native.stop="handleProductDelete(scope.row.id)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-col>
      <el-col :span="18">
        <div class="z-table-control">
          <el-button type="primary" @click="handleCreate">新增指令</el-button>
          <el-button type="primary" @click="handleImport">一键导入指令</el-button>
        </div>
        <el-divider content-position="left">{{ currentDeviceDesc ? `当前产品：${currentDeviceDesc} 指令列表` : '所有产品指令列表' }}</el-divider>
        <el-table :data="list" v-loading="listLoading" :default-sort="{prop: 'cmdLevel'}" border>
          <el-table-column prop="cmdLevel" width="50" label="序号"></el-table-column>
          <el-table-column prop="cmdName" label="指令名称"></el-table-column>
          <el-table-column prop="cmdDescr" label="描述"></el-table-column>
          <el-table-column align="center" label="同步命令" width="100">
            <template slot-scope="scope">
              <el-tag :type="scope.row.sync ? 'success' : 'info'">{{scope.row.sync ? '是' : '否'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="140px">
            <template slot-scope="scope">
              <el-link type="primary" @click="handleSort(scope.row)">排序</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="primary" @click="handleEdit(scope.row)">修改</el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link type="danger" @click="handleDelete(scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="z-table-footer">
          <el-select v-model="transDevice" placeholder="请选择设备">
            <el-option v-for="(prod, index) in productList" :key="index" :label="prod.deviceDesc" :value="prod.id">
            </el-option>
          </el-select>
          <el-select :disabled="!transDevice" v-model="transCommand" placeholder="请选择命令" style="margin: 0 20px;">
            <el-option v-for="(command, index) in deviceCommand" :key="index" :label="command.cmdName" :value="command.cmdCode">
            </el-option>
          </el-select>
          <el-button type="primary" @click="handleCopyCommand">复制</el-button>
        </div>
      </el-col>
    </el-row>
    <command-form :dialogVisible="dialogVisible" :dialogType="dialogType" :commandInfo="commandInfo" @close="handleClose"></command-form>
    <product-form :dialogVisible="dialogProductVisible" :dialogType="dialogProductType" :typeInfo="productInfo" @close="handleProductClose"></product-form>
  </el-card>
</template>

<script>
export default {
  components: {
    CommandForm: () => import('./Form'),
    ProductForm: () => import('./ProductForm'),
  },
  mounted() {
    this.init()
  },
  watch: {
    transDevice() {
      this.transCommand = null
    },
  },
  data() {
    return {
      productList: [],
      commandList: [],
      list: [],
      commandListQuery: {
        pagesize: 0,
        offset: 0,
      },
      currentDeviceTypeIndex: 0,
      currentDeviceDesc: null,
      listLoading: false,
      transDevice: null,
      transCommand: null,
      deleteConfirmVisible: false,
      dialogVisible: false,
      dialogType: 'create',
      commandInfo: null,

      dialogProductVisible: false,
      dialogProductType: 'create',
      productInfo: null,
    }
  },
  computed: {
    deviceCommand() {
      let list = []
      if (this.transDevice) {
        list = this.commandList.filter((e) => e.deviceType == this.transDevice)
      }
      return list
    },
  },
  methods: {
    async init() {
      try {
        const deviceType = await this.$api.system.getProductByUser()
        const command = await this.$api.system.getAllCommand(this.commandListQuery)
        this.productList = deviceType.data
        this.commandList = command.data
        // this.handleSelect(this.currentDeviceTypeIndex)
        this.getProductList()
        var prod = this.productList[this.currentDeviceTypeIndex]
        if (prod) {
          this.currentDeviceDesc = prod.deviceDesc
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    handleCreate() {
      this.dialogType = 'create'
      this.dialogVisible = true
    },
    handleEdit(command) {
      this.dialogType = 'edit'
      this.commandInfo = command
      this.dialogVisible = true
    },
    handleImport() {
      var devicetype = this.productList[this.currentDeviceTypeIndex].id
      this.$api.system.importCommand({ prodId: devicetype }).then((res) => {
        if (res.code === 0) {
          this.init()
          this.$message.success('导入命令成功！')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleProductCreate() {
      this.dialogProductType = 'create'
      this.dialogProductVisible = true
    },
    handleProductEdit(product) {
      this.dialogProductType = 'edit'
      this.productInfo = product
      this.dialogProductVisible = true
    },
    handleProductDelete(id) {
      this.$api.system.deleteProduct(id).then(res => {
        if (res.code === 0) {
          this.$message.success('成功删除！')
          this.init()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getProductList() {
      this.listLoading = true
      const command = this.commandList
      var device = this.productList[this.currentDeviceTypeIndex]
      while (!device && this.currentDeviceTypeIndex > 0) {
        this.currentDeviceTypeIndex--
        device = this.productList[this.currentDeviceTypeIndex]
      }
      if (device) {
        this.list = command.filter((e) => e.deviceType == device.id)
      }
      this.listLoading = false
    },
    handleSelect(row) {
      var e = row.id
      this.currentDeviceDesc = row.deviceDesc
      this.currentDeviceTypeIndex = this.productList.findIndex((n) => n.id === e)
      this.getProductList()
    },
    handleCopyCommand() {
      let command = null
      this.deviceCommand.map((e) => {
        if (e.cmdcode === this.transCommand) {
          command = e
        }
      })
      if (command) {
        let cloneObj = this.$extra.deepClone(command)
        // console.log(cloneObj)
        cloneObj.deviceType = this.productList[this.currentDeviceTypeIndex].id
        this.$api.system.addCommand(cloneObj).then((res) => {
          if (res.code === 0) {
            this.init()
            this.$message.success('复制命令成功！')
          }
        })
      }
    },
    handleDelete(command) {
      this.$api.system.delCommand(command.predictCmdId).then((res) => {
        if (res.code === 0) {
          this.init()
          this.$message.success('删除命令成功！')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleSort(command) {
      this.$prompt('输入序号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(([0-9]*[1-9][0-9]*)|(0+))$/,
        inputErrorMessage: '请输入数字',
        customClass: 'z-message-box',
      })
        .then(({ value }) => {
          const data = {
            ...command,
            cmdLevel: value,
          }
          this.$api.system.updateCommand(data).then((res) => {
            if (res.code === 0) {
              this.init()
            } else {
              this.$message.error(res.msg)
            }
          })
        })
        .catch(() => { })
    },
    handleClose(update) {
      this.dialogVisible = false
      update && this.init()
    },
    handleProductClose(update) {
      this.dialogProductVisible = false
      update && this.init()
    },
  },
}
</script>

<style>
.z-message-box {
  width: 200px;
}
</style>