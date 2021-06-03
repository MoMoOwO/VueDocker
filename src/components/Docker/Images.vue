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
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            clearable
            v-model="queryInfo.search"
          >
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="pageSizeChange">搜索</el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="imagesList" style="width: 100%" border stripe>
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
        :current-page="queryInfo.skip+1"
        :page-sizes="[1, 2, 3, 4]"
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
      imagesList: [], // 奖项数据列表
      total: 0, // 总数目
      // 查询信息
      queryInfo: {
        skip: 0, // 当前页号 - 1
        limit: 10, // 每页显示条目数
        search: '' // 查询条件
      }
    }
  },
  created() {
    this.getImagesList()
  },
  mounted() {},
  methods: {
    // 获取镜像数据列表
    async getImagesList() {
      const { data: res } = await this.axios.get('images/', {
        params: this.queryInfo
      })
      if (res.Code === 0) {
        this.imagesList = res.Data.Images
        this.total = res.Data.Len
      } else {
        this.$message.error('获取镜像信息失败！')
      }
    },
    // 修改每页数据条目数
    pageSizeChange() {
      console.log(this.queryInfo)
    },
    // 切换当前显示页
    handleCurrentChange() {
      console.log(this.queryInfo)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
