<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统信息</el-breadcrumb-item>
      <el-breadcrumb-item>概览</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="box-body">
        <el-card class="info-card" v-if="HostInfo.CpuInformation">
          <div slot="header" class="clearfix">
            <div class="blue-box"></div>
            <span>主机信息</span>
          </div>
          <el-row>
            <el-col :span="12">
              <p>主机名称：{{ HostInfo.HostName }}</p>
            </el-col>
            <el-col :span="12">
              <p>CPU信息</p>
              <p>物理内核：{{ HostInfo.CpuInformation.PhysicalCnt }}</p>
              <p>逻辑内核：{{ HostInfo.CpuInformation.LogicalCnt }}</p>
              <p>型号：{{ HostInfo.CpuInformation.ModelName }}</p>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="info-card" v-if="CLIInfo.CliInfo">
          <div slot="header" class="clearfix">
            <div class="blue-box"></div>
            <span>CLI 信息</span>
          </div>
          <el-row>
            <el-col :span="12">
              <p>CLI 版本：{{ CLIInfo.CliInfo.CliVersion }}</p>
              <p>平台：{{ CLIInfo.CliInfo.Platform }}</p>
              <p>Docker 版本：{{ CLIInfo.CliInfo.DockerVersion }}</p>
            </el-col>
            <el-col :span="12">
              <p>镜像总数：{{ CLIInfo.CliInfo.ImagesCount }}</p>
              <p>网络总数：{{ CLIInfo.CliInfo.NetworksCount }}</p>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      HostInfo: {},
      CLIInfo: {}
    }
  },
  created() {
    this.getHostInfo()
    this.getCLIInfo()
  },
  mounted() {},
  methods: {
    // 获取主机信息
    async getHostInfo() {
      const { data: res } = await this.axios.get('info')
      if (res.Code === 0) {
        this.HostInfo = res.Data
      } else {
        this.$message.error('获取主机信息失败！')
      }
    },
    // 获取 CLI 信息
    async getCLIInfo() {
      const { data: res } = await this.axios.get('cliInfo')
      if (res.Code === 0) {
        this.CLIInfo = res.Data
      } else {
        this.$message.error('获取 CLI 信息失败！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  .box-body {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    .info-card {
      width: 500px;
      border: 1px solid #ebeef5 !important;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
      .clearfix {
        display: flex;
        .blue-box {
          height: inherit;
          width: 5px;
          margin-right: 10px;
          background-color: #409eff;
        }
      }
    }
  }
}
</style>
