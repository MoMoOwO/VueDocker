<template>
  <!-- 整体布局 -->
  <el-container class="layout-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>Docker-UI</span>
      </div>
      <el-button type="info" @click="logout">Logout</el-button>
    </el-header>
    <!-- 内容区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapsed ? '64px' : '200px'">
        <div class="toggle-button">
          <i
            :class="
              isCollapsed ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'
            "
            @click="toggleCollapse"
          ></i>
        </div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#2d4469"
          text-color="#fff"
          active-text-color="#0089D2"
          :default-openeds="opentedMenus"
          :collapse="isCollapsed"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            v-for="item in menutList"
            :key="item.id"
            :index="item.id + ''"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图表 -->
              <i :class="item.icon"></i>
              <!-- 文本 -->
              <span>{{ item.itemName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="'/' + subItem.path"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i :class="subItem.icon"></i>
                <span>{{ subItem.itemName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题内容区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      // 默认展开菜单项 index 数组
      opentedMenus: ['0', '1', '2'],
      // 菜单栏数据
      menutList: [
        {
          id: 0,
          itemName: '主机信息',
          path: 'local',
          icon: 'el-icon-link',
          children: [
            {
              id: 1,
              itemName: '总览',
              path: 'dashboard',
              icon: 'el-icon-data-board'
            }
          ]
        },
        {
          id: 1,
          itemName: 'Docker',
          path: 'docker',
          icon: 'el-icon-receiving',
          children: [
            {
              id: 1,
              itemName: '容器',
              path: 'containers',
              icon: 'el-icon-box'
            },
            {
              id: 2,
              itemName: '镜像',
              path: 'gho',
              icon: 'el-icon-document-copy'
            },
            {
              id: 3,
              itemName: '逻辑卷',
              path: 'volumes',
              icon: 'el-icon-help'
            },
            {
              id: 4,
              itemName: '网络',
              path: 'networks',
              icon: 'el-icon-cpu'
            }
          ]
        },
        {
          id: 2,
          itemName: '设置',
          path: 'settings',
          icon: 'el-icon-setting',
          children: [
            {
              id: 1,
              itemName: '用户管理',
              path: 'users',
              icon: 'el-icon-user'
            },
            {
              id: 2,
              itemName: '配置项',
              path: 'settings',
              icon: 'el-icon-setting'
            }
          ]
        }
      ],
      // 是否折叠菜单栏
      isCollapsed: false,
      // 默认活动标签
      activePath: ''
    }
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  mounted() {},
  methods: {
    // 退出登录
    logout() {
      this.$router.push('/login')
    },
    // 菜单栏折叠与展开
    toggleCollapse() {
      // 折叠展开切换
      this.isCollapsed = !this.isCollapsed
      // 展开时保持展开所有子菜单
      // [!this.isCollapsed && (this.opentedMenus = ['1', '2'])]
    },
    // 保存当前导航路由 path
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.layout-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin: 0px 15px;
    }
    img {
      height: 75px;
      width: 75px;
      border-right: 1px solid white;
    }
  }
}
.el-aside {
  background-color: #2d4469;
  .toggle-button {
    background-color: #4a5064;
    text-align: center;
    color: #fff;
    i {
      cursor: pointer;
      transition: all 0.3s ease;
    }
    i:hover {
      /*旋转180度*/
      transform: rotate(180deg);
    }
  }
  .el-menu {
    border-right: 0px;
  }
}
.el-main {
  background-color: #eaedf1;
}
// 旋转
.icon-arrow-rotate1 {
  transition: all 0.3s ease;
  /*旋转180度*/
  transform: rotate(180deg);
}
.icon-arrow-rotate2 {
  transition: all 0.3s ease;
  /*旋转180度*/
  transform: rotate(180deg);
}
</style>
