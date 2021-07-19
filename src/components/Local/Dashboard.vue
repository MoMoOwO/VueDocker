<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统信息</el-breadcrumb-item>
      <el-breadcrumb-item>概览</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 列表区域 -->
      <!-- <el-table :data="HostInfoList" style="width: 100%" border stripe>
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
      </el-table> -->
      <el-card class="info-card">
        <div slot="header" class="clearfix">
          <div class="blue-box"></div>
          <span>主机信息</span>
        </div>
        <div>
          主机名称：
          {{ HostInfo.HostName }}
        </div>
        <div>
          CPU信息 物理内核：{{
            HostInfo.CpuInformation.PhysicalCnt
          }}
          逻辑内核：{{ HostInfo.CpuInformation.LogicalCnt }} 型号：{{
            HostInfo.CpuInformation.ModelName
          }}
        </div>
      </el-card>
      <el-card class="info-card">
        <div slot="header" class="clearfix">
          <div class="blue-box"></div>
          <span>CLI 信息</span>
        </div>
        <div>
          CLI 版本：{{ CLIInfo.CliInfo.CliVersion }} 平台：{{
            CLIInfo.CliInfo.Platform
          }}
          Docker 版本：{{ CLIInfo.CliInfo.DockerVersion }}
        </div>
        <div>
          镜像总数：{{ CLIInfo.CliInfo.ImagesCount }} 容器总数：{{
            CLIInfo.cliInfo.ContainersCount
          }}
          网络总数：{{ CLIInfo.cliInfo.NetworksCount }}
        </div>
      </el-card>
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
    console.log(this.HostInfo, this.CLIInfo)
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
</style>
