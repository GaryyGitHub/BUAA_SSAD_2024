<template>
  <el-container>
    <NavBar></NavBar>
    <!-- 左侧导航栏，占据较小的宽度 -->
    <el-aside width="180px">
      <!-- <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :router="true"> -->
      <el-menu class="el-menu-vertical-demo" @select="showPage" :router="true">
        <el-menu-item index="authenticationInfo" v-if="!this.isVerify">学者认证</el-menu-item>
        <el-menu-item index="scholarHome" v-if="this.isVerify && this.$store.state.canSee">学者主页</el-menu-item>
        <el-menu-item v-if="this.isVerify && !this.$store.state.canSee">ta的学者主页</el-menu-item>
        <el-menu-item index="achievementClaim" v-if="isVerify && this.$store.state.canSee">成果认领</el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区域 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
  <el-dialog
    v-model="showModal"
    title="认证提醒"
    :visible="!isVerify"
    width="400px"
    :closable="false"
  >
    <p>{ this.message }</p>
    <template v-slot:footer>
      <el-button type="primary" @click="verifyUser">去认证</el-button>
    </template>
  </el-dialog>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  components: {
    NavBar
  },
  data() {
    return {
      showModal: false,   // 控制弹窗显示
      isVerify: false,
      message:"",
    };
  },
  methods: {
    showPage(page) {
      if(!this.isVerify && page != 'authenticationInfo'){
        this.showModal = true;
        this.message = "您尚未认证，请点击下方按钮进行认证。";
      }else if(this.isVerify && page == 'authenticationInfo'){
        this.showModal = true;
        this.message = "您已认证，请勿重复认证。";
      }else{
        this.currentPage = page;
      }
      
    },
    verifyUser() {
      // 关闭弹窗
      this.showModal = false;
      this.currentPage = 'authenticationInfo';
      this.$router.push('/scholarInfo/' + this.$store.state.uid + '/authenticationInfo');
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
        if (response.status === 200) {
          this.isVerify = response.data.data.isVerify;
          console.log(this.isVerify);
        } else {
          console.error('获取用户信息失败');
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    }
  },
  mounted() {
    // 初始化时检查是否已认证
    this.checkVerification();
  },
}
</script>

<style scoped>
/* 保证容器和内容布局 */
.el-container {
  display: flex; /* 使用flex布局 */
}

.el-main {
  padding: 20px;
  flex-grow: 0.99; /* 主内容区域占据剩余空间 */
}


</style>
