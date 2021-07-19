<template>
  <div>
    <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>Docker</el-breadcrumb-item>
      <el-breadcrumb-item>网络</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入网络名"
            prefix-icon="el-icon-search"
            clearable
            v-model="queryInfo.search"
          >
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getNetworksList">搜索</el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table
        v-loading="isLoading"
        :data="networksList"
        style="width: 100%"
        border
        stripe
        @expand-change="inspectDetails"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <span
              v-loading="!networkDetails[scope.row.NetworkId] && detailLoading"
            >
              {{ networkDetails[scope.row.NetworkId] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="NetworkId" label="网络设备ID">
          <template slot-scope="scope">
            <el-tag type="text">{{ scope.row.NetworkId }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="Name" label="网络名">
        </el-table-column>
        <el-table-column align="left" prop="Driver" label="驱动">
        </el-table-column>
        <el-table-column align="left" prop="Scope" label="模式">
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
  components: {},
  props: [],
  data() {
    return {
      networksList: [], // 奖项数据列表
      total: 0, // 总数目
      // 查询信息
      queryInfo: {
        skip: 1, // 当前页号
        limit: 5, // 每页显示条目数
        search: '' // 查询条件
      },
      isLoading: true,
      networkDetails: {},
      detailLoading: true
    }
  },
  created() {
    this.getNetworksList()
  },
  mounted() {},
  methods: {
    // 获取容器数数据列表
    async getNetworksList() {
      const params = this._.cloneDeep(this.queryInfo)
      params.skip -= 1
      const { data: res } = await this.axios.get('networks/', {
        params
      })
      if (res.Code === 0) {
        this.networksList = res.Data.Networks
        this.total = res.Data.Len
      } else {
        this.$message.error('获取网络信息失败！')
      }
      this.isLoading = false
    },
    // 获取网络详情信息
    async inspectDetails(row, expandedRows) {
      if (expandedRows.length > 0) {
        this.detailLoading = true
        const { data: res } = await this.axios.get('networks/inspect/', {
          params: { networkId: row.NetworkId }
        })
        if (res.Code === 0) {
          this.networkDetails[row.NetworkId] = res.Data.NetworkInfo
          this.detailLoading = false
        } else {
          this.$message.error('获取容器详情失败！')
        }
      }
    },
    // 修改每页数据条目数
    pageSizeChange(newSize) {
      this.isLoading = true
      this.queryInfo.skip = 1 // 重置起始页为 1
      this.queryInfo.limit = newSize
      this.getNetworksList()
    },
    // 切换当前显示页
    handleCurrentChange(newPage) {
      this.isLoading = true
      this.queryInfo.skip = newPage
      this.getNetworksList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
