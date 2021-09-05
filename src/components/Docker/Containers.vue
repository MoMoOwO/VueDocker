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
              type="danger"
              size="small"
              round
              v-if="scope.row.Status.split(' ')[0] == 'Up'"
              @click="containerSwitch(scope.row.ContainerId, 0)"
              >停止</el-button
            >
            <el-button
              type="success"
              size="small"
              round
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
        title="新增容器"
        :visible.sync="addDialogVisible"
        width="65%"
        @closed="addDialogClosed"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          :label-position="'right'"
          size="small"
          ref="addFormRef"
          label-width="100px"
        >
          <el-form-item class="el-form-item-inline">
            <el-col :span="12">
              <el-form-item label="镜像名" prop="Image">
                <el-input
                  v-model="addForm.Image"
                  placeholder="请输入镜像名"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="容器名" prop="ContainerName">
                <el-input
                  v-model="addForm.ContainerName"
                  placeholder="请输入容器名"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item class="el-form-item-inline">
            <el-col :span="12">
              <el-form-item label="系统环境变量" prop="Env">
                <el-select
                  class="created-input"
                  v-model="addForm.Env"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请输入环境变量，输入一个变量后按回车结束"
                  :popper-class="'empty-select'"
                >
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="端口映射" prop="BindPort">
                <el-input
                  v-model="addForm.BindPort"
                  placeholder="请输入端口映射"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item class="el-form-item-inline">
            <el-col :span="12">
              <el-form-item label="网络模式" prop="NetworkModule">
                <el-select v-model="addForm.NetworkModule" placeholder="请选择">
                  <el-option
                    v-for="item in NetworkModuleArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="挂载类型" prop="Type">
                <el-select v-model="addForm.Type" placeholder="请选择">
                  <el-option
                    v-for="item in TypeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="系统挂载路经" prop="Mounts">
            <el-button
              size="small"
              round
              icon="el-icon-plus"
              plain
              @click="addMounts"
              >新增路径</el-button
            >
            <div v-for="(item, index) in addForm.Mounts" :key="item.key">
              <el-col :span="9">
                <el-form-item
                  label="宿主主机路径"
                  label-width="110px"
                  :prop="'Mounts.' + index + '.Source'"
                  :rules="addFormRules.sourcePath"
                >
                  <el-input
                    placeholder="请输入宿主主机路径"
                    v-model="item.Source"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item
                  label="容器路径"
                  :prop="'Mounts.' + index + '.Target'"
                  :rules="addFormRules.targetPath"
                >
                  <el-input
                    placeholder="请输入容器路径"
                    v-model="item.Target"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label-width="55px" label="只读" prop="AutoRemove">
                  <el-switch v-model="item.ReadOnly"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="text-align: center">
                <el-button
                  size="small"
                  type="danger"
                  icon="el-icon-close"
                  circle
                  plain
                  @click="removeMounts(item, index)"
                ></el-button>
              </el-col>
            </div>
          </el-form-item>

          <el-form-item class="el-form-item-inline">
            <el-col :span="12">
              <el-form-item label="重启策略" prop="RestartPolicy">
                <el-select
                  v-model="addForm.RestartPolicy"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in restartPolicyArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="自动删除" prop="AutoRemove">
                <el-switch v-model="addForm.AutoRemove"></el-switch>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addContainer">确 定</el-button>
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
        Mounts: [], // 系统挂载路经-source 宿主主机路径、target 容器路径
        ReadOnly: '', // 系统挂载-卷模式
        RestartPolicy: '', // 重启策略
        AutoRemove: false // 是否自动删除
      },
      // 网络模式选择项
      NetworkModuleArr: [{ value: 'defalut', label: 'defalut' }],
      // 挂载类型选择项
      TypeArr: [{ value: 'bind', label: 'bind' }],
      // 重启策略选项
      restartPolicyArr: [
        { value: 'always', label: 'always' },
        { value: 'on-failure', label: 'on-failure' }
      ],
      addFormRules: {
        Image: [{ required: true, message: '请输入镜像', trigger: 'blur' }],
        ContainerName: [
          { required: true, message: '请输入容器名', trigger: 'blur' }
        ],
        sourcePath: [
          { required: true, message: '请输入宿主主机路径', trigger: 'blur' }
        ],
        targetPath: [
          { required: true, message: '请输入容器路径', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getContainersList()
  },
  watch: {
    'addForm.RestartPolicy': {
      handler(newVal, oldVal) {
        if (newVal) {
          this.addForm.AutoRemove = true
        } else {
          this.addForm.AutoRemove = false
        }
      }
    },
    'addForm.AutoRemove': {
      handler(newVal, oldVal) {
        if (!newVal) {
          this.addForm.RestartPolicy = ''
        }
      }
    }
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
    // 新增容器关闭
    addDialogClosed() {
      // 将表单清空
      // this.$refs.addFormRef.resetFields()
      this.addForm = {
        Image: '',
        ContainerName: '',
        Env: [],
        BindPort: '',
        NetworkModule: '',
        Type: '',
        Mounts: [],
        ReadOnly: '',
        RestartPolicy: '',
        AutoRemove: false
      }
    },
    // 提交新增容器信息
    addContainer() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          // 表单验证不通过
          return 0
        } else {
          console.log(this.addForm)
          const { data: res } = this.axios.post(
            'containers/create',
            JSON.stringify(this.addForm),
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
          // 这样直接是 application/json 格式
          /* const { data: res } = this.axios.post(
            'containers/create',
            this.addForm
          ) */
          console.log(res)
          if (res.Code === 0) {
            this.$message.error('添加容器成功！')
            this.getContainersList()
          } else {
            this.$message.error('添加容器失败！')
          }
          this.addDialogVisible = false
        }
      })
    },

    // 新增容器-新增系统挂载路径
    addMounts() {
      this.addForm.Mounts.push({
        key: new Date().getTime(),
        Source: '',
        Target: '',
        ReadOnly: false
      })
    },
    // 新增容器-删除系统挂载路径
    removeMounts(item) {
      const index = this.addForm.Mounts.indexOf(item)
      if (index !== -1) {
        this.addForm.Mounts.splice(index, 1)
      } else {
        this.$message.error('删除失败！')
      }
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
      }
    }
  }
}
</style>
