<template>
  <div>
    <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>Docker</el-breadcrumb-item>
      <el-breadcrumb-item>检索</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入镜像名"
            prefix-icon="el-icon-search"
            clearable
            v-model="imageName"
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
        <el-table-column align="center" prop="Name" label="镜像名">
        </el-table-column>
        <el-table-column align="center" prop="Description" label="描述">
        </el-table-column>
        <el-table-column align="center" prop="StarsCount" label="星标数">
        </el-table-column>
        <el-table-column align="center" prop="IsOfficial" label="官方镜像">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.IsOfficial == 'no'"
              effect="dark"
              type="danger"
              >否</el-tag
            >
            <el-tag v-else effect="dark" type="success">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="pullImage(scope.row.Name)"
              >拉取</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Search',
  components: {},
  props: [],
  data() {
    return {
      imagesList: [], // 奖项数据列表
      imageName: '', // 搜索镜像名称
      isLoading: false // 缓冲条
    }
  },
  created() {},
  methods: {
    // 获取镜像数据列表
    async getImagesList() {
      this.isLoading = true
      const { data: res } = await this.axios.get(
        'images/search?imageName=' + this.imageName
      )
      if (res.Code === 0) {
        this.imagesList = res.Data.Images
      } else {
        this.$message.error('获取镜像信息失败！')
      }
      this.isLoading = false
    },
    // 拉取镜像
    pullImage(imageName) {
      alert('拉取' + imageName)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
