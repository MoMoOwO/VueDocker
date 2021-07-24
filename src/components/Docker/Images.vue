<template>
  <div>
    <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>Docker</el-breadcrumb-item>
      <el-breadcrumb-item>镜像</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入镜像名"
            prefix-icon="el-icon-search"
            clearable
            v-model="queryInfo.search"
          >
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getImagesList">搜索</el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table
        v-loading="isLoading"
        :data="imagesList"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column align="center" prop="Repository" label="镜像名">
        </el-table-column>
        <el-table-column align="center" prop="Tag" label="版本号">
        </el-table-column>
        <el-table-column align="center" prop="ImageId" label="镜像编号">
        </el-table-column>
        <el-table-column align="center" prop="Created" label="创建时间">
        </el-table-column>
        <el-table-column align="center" prop="Size" label="大小">
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
  name: 'Images',
  components: {},
  props: [],
  data() {
    return {
      imagesList: [], // 奖项数据列表
      total: 0, // 总数目
      // 查询信息
      queryInfo: {
        skip: 1, // 当前页号
        limit: 5, // 每页显示条目数
        search: '' // 查询条件
      },
      isLoading: false // 缓冲条
    }
  },
  created() {
    this.getImagesList()
  },
  methods: {
    // 获取镜像数据列表
    async getImagesList() {
      this.isLoading = true
      const params = this._.cloneDeep(this.queryInfo)
      params.skip -= 1
      const { data: res } = await this.axios.get('images', {
        params
      })
      if (res.Code === 0) {
        this.imagesList = res.Data.Images
        this.total = res.Data.Len
      } else {
        this.$message.error('获取镜像信息失败！')
      }
      this.isLoading = false
    },
    // 修改每页数据条目数
    pageSizeChange(newSize) {
      this.queryInfo.skip = 1 // 重置起始页为 1
      this.queryInfo.limit = newSize
      this.getImagesList()
    },
    // 切换当前显示页
    handleCurrentChange(newPage) {
      this.queryInfo.skip = newPage
      this.getImagesList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
