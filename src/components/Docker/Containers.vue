<template>
  <div>
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
            <span
              v-loading="
                !containerDetails[scope.row.ContainerId] && detailLoading
              "
            >
              {{ containerDetails[scope.row.ContainerId] }}
            </span>
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
      detailLoading: true
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
</style>
