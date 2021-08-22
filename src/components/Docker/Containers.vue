<template>
  <div class="containers-com">
    <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>Docker</el-breadcrumb-item>
      <el-breadcrumb-item>容器</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入容器名"
            prefix-icon="el-icon-search"
            clearable
            v-model="queryInfo.search"
          >
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getContainersList">搜索</el-button>
        </el-col>
        <el-col :span="4" :offset="8">
          <el-button
            style="float: right"
            type="primary"
            @click="addDialogVisible = true"
            >新建容器</el-button
          >
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table
        v-loading="isLoading"
        :data="containersList"
        style="width: 100%"
        border
        stripe
        lazy
        @expand-change="inspectDetails"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-skeleton
              :loading="
                !containerDetails[scope.row.ContainerId] && detailLoading
              "
              :rows="6"
              animated
            >
              <template>
                <span>{{ containerDetails[scope.row.ContainerId] }}</span>
              </template>
            </el-skeleton>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ContainerId" label="容器ID">
          <template slot-scope="scope">
            <el-tag type="text">{{ scope.row.ContainerId }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="Image" label="镜像">
        </el-table-column>
        <el-table-column align="left" prop="Command" label="启动命令">
        </el-table-column>
        <el-table-column align="left" prop="Created" label="创建时间">
        </el-table-column>
        <el-table-column align="left" prop="Status" label="状态">
        </el-table-column>
        <el-table-column align="left" prop="Ports" label="端口">
        </el-table-column>
        <el-table-column align="left" prop="Names" label="容器名">
        </el-table-column>
        <el-table-column align="left" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.Status.split(' ')[0] == 'Up'"
              @click="containerSwitch(scope.row.ContainerId, 0)"
              >停止</el-button
            >
            <el-button
              type="text"
              v-else
              @click="containerSwitch(scope.row.ContainerId, 1)"
              >启动</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.skip"
        :page-sizes="[1, 5, 10]"
        :page-size="queryInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 新增容器对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="addDialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          :label-position="'top'"
          size="small"
          ref="addFormRef"
          label-width="100px"
        >
          <el-form-item label="镜像名" prop="image">
            <el-input
              v-model="addForm.Image"
              placeholder="请输入镜像名"
            ></el-input>
          </el-form-item>
          <el-form-item label="容器名" prop="containerName">
            <el-input
              v-model="addForm.ContainerName"
              placeholder="请输入容器名"
            ></el-input>
          </el-form-item>
          <el-form-item label="系统环境变量" prop="Env">
            <el-select
              v-model="addForm.Env"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请输入环境变量"
              :popper-class="'empty-select'"
            >
            </el-select>
          </el-form-item>
          <el-form-item label="端口映射" prop="BindPort">
            <el-input
              v-model="addForm.BindPort"
              placeholder="请输入端口映射"
            ></el-input>
          </el-form-item>
          <el-form-item label="端口映射" prop="BindPort">
            <el-input
              v-model="addForm.BindPort"
              placeholder="请输入端口映射"
            ></el-input>
          </el-form-item>
          <el-form-item label="网络模式" prop="BindPort">
            <el-input
              v-model="addForm.BindPort"
              placeholder="请输入端口映射"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Conatiners',
  components: {},
  props: [],
  data() {
    return {
      containersList: [], // 容器数据列表
      total: 0, // 总数目
      // 查询信息
      queryInfo: {
        skip: 1, // 当前页号
        limit: 5, // 每页显示条目数
        search: '' // 查询条件
      },
      isLoading: true,
      // 容器详情
      containerDetails: {},
      detailLoading: true, // 容器详情缓冲
      addDialogVisible: false, // 添加容器对话框是否可见
      addForm: {
        Image: '', // 镜像
        ContainerName: '', // 容器名
        Env: [], // 系统环境变量
        BindPort: '', // 端口映射
        NetworkModule: '', // 网络模式
        Type: '', // 挂载类型
        Mounts: '', // 系统挂载路经
        Source: '', // 系统挂载路经-宿主主机路径
        Target: '', // 系统挂载路径-容器路径
        ReadOnly: '', // 系统挂载-卷模式
        RestartPolicy: '', // 重启策略
        AutoRemove: '' // 是否自动删除
      },
      addFormRules: {
        image: [{ required: true, message: '请输入镜像', trigger: 'change' }],
        containerName: [
          { required: true, message: '请输入容器名', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getContainersList()
  },
  methods: {
    // 获取容器数数据列表
    async getContainersList() {
      this.isLoading = true
      const params = this._.cloneDeep(this.queryInfo)
      params.skip -= 1
      const { data: res } = await this.axios.get('containers', {
        params
      })
      if (res.Code === 0) {
        this.containersList = res.Data.Containers
        this.total = res.Data.Len
      } else {
        this.$message.error('获取容器信息失败！')
      }
      this.isLoading = false
    },
    // 展开行，查看详情信息
    async inspectDetails(row, expandedRows) {
      if (expandedRows.length > 0) {
        this.detailLoading = true
        const { data: res } = await this.axios.get('containers/inspect/', {
          params: { containerId: row.ContainerId }
        })
        if (res.Code === 0) {
          this.containerDetails[row.ContainerId] = res.Data.ContainerInfo
          this.detailLoading = false
        } else {
          this.$message.error('获取容器详情失败！')
        }
      }
    },
    // 新增容器
    handleClose() {
      console.log('关闭')
    },
    // 开关容器
    async containerSwitch(containerId, opt) {
      // 启动或关闭容器
      const { data: res } = await this.axios.get('containers/option', {
        params: {
          containerId,
          opt
        }
      })
      if (res.Code === 0) {
        this.getContainersList()
      } else {
        let msg = opt ? '启动' : '停止'
        msg += '容器失败！'
        this.$message.error(msg)
      }
    },
    // 修改每页数据条目数
    pageSizeChange(newSize) {
      this.queryInfo.skip = 1 // 重置起始页为 1
      this.queryInfo.limit = newSize
      this.getContainersList()
    },
    // 切换当前显示页
    handleCurrentChange(newPage) {
      this.queryInfo.skip = newPage
      this.getContainersList()
    }
  }
}
</script>

<style lang="less" scoped>
.containers-com {
  .el-dialog {
    .el-form {
      .el-form-item__label {
        padding: 0;
      }
      .el-select {
        width: 100%;
        .el-input__suffix {
          visibility: hidden;
        }
      }
    }
  }
}
</style>
