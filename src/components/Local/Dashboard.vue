<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>主机信息</el-breadcrumb-item>
      <el-breadcrumb-item>概览</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 列表区域 -->
      <el-table :data="HostInfoList" style="width: 100%" border stripe>
        <el-table-column align="center" prop="HostName" label="主机名称">
        </el-table-column>
        <el-table-column align="center" label="CPU 信息">
          <el-table-column
            align="center"
            prop="CpuInformation.PhysicalCnt"
            label="物理内核"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="CpuInformation.LogicalCnt"
            label="逻辑内核"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="CpuInformation.ModelName"
            label="型号"
          >
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      HostInfoList: []
    }
  },
  created() {
    this.getInfo()
  },
  mounted() {},
  methods: {
    async getInfo() {
      const { data: res } = await this.axios.get('info')
      if (res.Code === 0) {
        this.HostInfoList.push(res.Data)
      } else {
        this.$message.error('获取主机信息失败！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
