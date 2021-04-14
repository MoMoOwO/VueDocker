<template>
  <div>
    登陆成功！Home 组件
    <el-button type="info" plain @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  components: {},
  props: [],
  data() {
    return {}
  },
  mounted() {},
  methods: {
    // 退出登录
    logout() {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
