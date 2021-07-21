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
              <span class="main-info">主机名称：</span>
              <span class="minor-info">{{ HostInfo.HostName }}</span>
            </el-col>
            <el-col :span="12">
              <span class="main-info">CPU信息</span>
              <br />
              <span class="main-info"> 物理内核： </span>
              <span class="minor-info">
                {{ HostInfo.CpuInformation.PhysicalCnt }}
              </span>
              <br />
              <span class="main-info">逻辑内核：</span>
              <span class="minor-info">
                {{ HostInfo.CpuInformation.LogicalCnt }}
              </span>
              <br />
              <span class="main-info">型号：</span>
              <span class="minor-info">
                {{ HostInfo.CpuInformation.ModelName }}
              </span>
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
              <span class="main-info">CLI 版本：</span>
              <span class="minor-info">{{ CLIInfo.CliInfo.CliVersion }}</span>
              <br />
              <span class="main-info">平台：</span>
              <span class="minor-info">{{ CLIInfo.CliInfo.Platform }}</span>
              <br />
              <span class="main-info">Docker 版本：</span>
              <span class="minor-info">
                {{ CLIInfo.CliInfo.DockerVersion }}
              </span>
            </el-col>
            <el-col :span="12">
              <span class="main-info">镜像总数：</span>
              <span class="minor-info">
                {{ CLIInfo.CliInfo.ImagesCount }}
              </span>
              <br />
              <span class="main-info">网络总数：</span>
              <span class="minor-info">
                {{ CLIInfo.CliInfo.NetworksCount }}
              </span>
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
    align-content: space-around;
    padding: 0;
    .info-card {
      background-color: #ebeef5;
      width: 500px;
      border: 1px solid #ebeef5 !important;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
      margin: 20px;
      /deep/ .el-card__header {
        border-bottom: 1px solid #c0c4cc;
        .clearfix {
          font-weight: bold;
          display: flex;
          .blue-box {
            height: inherit;
            width: 5px;
            margin-right: 10px;
            background-color: #409eff;
          }
        }
      }
      .main-info {
        color: #303133;
      }
      .minor-info {
        color: #909399;
      }
    }
  }
}
</style>
