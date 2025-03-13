<template>
  <NavBar></NavBar>
  <el-container>
    <el-aside>
      <el-menu :router="true" @select="showPage">
        <el-menu-item index="AccountInfo">基本信息</el-menu-item>
        <el-menu-item index="FavoritePapers">文献收藏夹</el-menu-item>
        <el-menu-item index="DownloadHistory">下载历史</el-menu-item>
          <el-menu-item index="chart" v-if="isManager">网站状态</el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  components: {
    NavBar
  },
  data() {
      return {
          isManager: false,
      }
  },
  methods: {
    showPage(page) {
      console.log(page);
      this.currentPage = page;
    },
      async checkVerification() {
          try {
              const response = await this.$api.get('/user/personal/homeInfo', {
                  headers: {
                      'Content-Type': 'application/json',
                      //'Authorization': `Bearer ${this.$store.state.token}`,  // 将 token 添加到请求头
                  },
                  params: {
                      uid: this.$store.state.uid,
                  },
              });
              console.log(response.data.data);
              if (response.status === 200) {
                  if (response.data.data.status === 0) {
                      this.isManager = true;
                  }
                  console.log(this.isManager);
              } else {
                  console.error('获取用户信息失败');
              }
          } catch (error) {
              console.error('获取用户信息失败:', error);
          }
      }
  },
    created() {
            // 初始化时检查是否已认证
            this.checkVerification();
    }
};
</script>

<style scoped>
.el-aside >>> .el-menu-item {
  background-color: white  !important;
  font-size: 16px;
  /* height: 50px; */
}

.el-aside >>> .el-aside {
  color: black;
}

.el-aside >>> .el-menu-item:hover{
  outline: 0 !important;
  color: var(--v_overall_blue) !important;
}
.el-aside >>> .el-menu-item.is-active {
  color: #fff !important;
  background: var(--v_overall_blue) !important;
}
</style>