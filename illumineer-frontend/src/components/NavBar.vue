<template>
  <div class="nav-bar">
    <el-row justify="space-around">
      <el-col :span="8" style="display: flex; align-items: center;">
        <a href="/">
          <img src="../assets/logo.png" alt="" class="logo"/>
        </a>
        <a class="navbar-item" href="/">
          <span class="navbar-item-text">首页</span>
        </a>
        <!-- 暂时写死 -->
        <span class="navbar-item" @click="openNewPage('/searchResult', false)">
          <span class="navbar-item-text">文献检索</span>
        </span>
        <span class="navbar-item" @click="openNewPage('/advancedSearch', false)">
          <span class="navbar-item-text">高级检索</span>
        </span>
        <span class="navbar-item" @click="openNewPage('/userInfo/' + userId + '/accountInfo', false)" v-if="isLogin">
          <span class="navbar-item-text">个人中心</span>
        </span>
        <span class="navbar-item" @click="warngingLogin()" v-else>
          <span class="navbar-item-text">个人中心</span>
        </span>
        <!-- 尚未登录 -->
        <span class="navbar-item" @click="warngingLogin()" v-if="!isLogin">
          <span class="navbar-item-text">学者主页</span>
        </span>
        <!-- 登录了并且已认证 -->
        <span class="navbar-item" @click="openNewPage('/scholarInfo/'+ userId + '/scholarHome', false)" v-else-if="userInfo.isVerify">
          <span class="navbar-item-text">学者主页</span>
        </span>
        <!-- 登录了，但没认证 -->
        <span class="navbar-item" @click="openNewPage('/scholarInfo/'+ userId + '/authenticationInfo', false)" v-else>
          <span class="navbar-item-text">学者主页</span>
        </span>
        
        <span class="navbar-item" @click="openNewPage('/help', true)">
          <span class="navbar-item-text">帮助</span>
        </span>
      </el-col>
      <el-col :span="12"></el-col>
      <el-col :span="2" style="display: flex; align-items: center;">
        <!-- 未登录 -->
        <div class="avatar" v-if="!isLogin">
          <div class="login-botton" @click="handleLogin()">登录</div>
        </div>
        <!-- 已登录 -->
        <div v-else>
          <el-popover
            placement="bottom"
            width="200"
            trigger="hover"
          >
            <div class="popover">
              <div class="popover-title">
                欢迎回来！{{ userInfo.username }}
              </div>
              <!-- <div class="poopover-user-name">{{ user.nickname }}</div> -->
              <div class="popover-choices" @click="openNewPage('/userInfo/' + userId + '/accountInfo', true)" v-if="userInfo.status !== 0">
                <!-- <el-icon :size="20"><User /></el-icon> -->
                <span class="popover-content">个人主页</span>
              </div>
              <div class="popover-choices" @click="openNewPage('userInfo/' + userId + '/DownloadHistory', true)" v-if="userInfo.status !== 0">
                <!-- <el-icon :size="20"><Document /></el-icon> -->
                <span class="popover-content">下载历史</span>
              </div>
              <div class="popover-choices" @click="openNewPage('/userInfo/' + userId + '/FavoritePapers', true)" v-if="userInfo.status !== 0">
                <!-- <el-icon :size="20"><Edit /></el-icon> -->
                <span class="popover-content">文献收藏夹</span>
              </div>
              <div class="popover-choices" @click="openNewPage('/adminInfo', true)" v-if="userInfo.status === 0">
                <!-- <el-icon :size="20"><Edit /></el-icon> -->
                <span class="popover-content">查看申诉</span>
              </div>
              <div class="popover-choices" @click="logout">
                <!-- <el-icon :size="20"><SwitchButton /></el-icon> -->
                <span class="popover-content">退出登录</span>
              </div>
            </div>
            <template #reference>
              <div class="avatar-2">
                <!-- 后期要和user结合 -->
                <a href="/" target="_blank" class="avatar-container">
                  <img src="../assets/avatar.png" alt="" class="avatar-img" />
                  <!-- <img src="../assets/logo.png" alt="" class="avatar-img"/> -->
                </a>
              </div>
            </template>
          </el-popover>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, onMounted, watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';  
import api from '@/api/axios';  // 根据你的文件结构调整路径

const router = useRouter();
const store = useStore();

const userInfo = ref({})

const getUserInfo = async() => {
  // TODO: 获取用户信息，调用：/user/personal/homeInfo
  console.log('获取用户信息', userId.value)
  console.log('token', store.getters.getToken)
  const res = await api.get(`/user/personal/homeInfo`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.getters.getToken}`
    },
    params: { uid: userId.value }
  })
  if (res.data.data) {
    userInfo.value = res.data.data
  } else {
    ElMessage.error('获取用户信息失败');
    userInfo.value = {};
  }
  console.log('userInfo.value', userInfo.value)
}

const handleLogin = () => {
  console.log('应当弹出登录页面', isLogin.value);
  openNewPage('/login', false);
}
const isLogin = computed(() => store.getters.isLoggedIn);
const userId = computed(() => store.getters.getUserId);

// const isLogin = ref(false);

const logout = async() => {
  // const res = await api.get(`/user/account/logout`)
  // console.log('logout res', res);
  // store同步登录状态
  store.dispatch('logout')
  ElMessage.success('您已成功退出登录！');
  router.push('/');
}

// 打开新页面
const openNewPage = (route, isBlank) => {
  if (isBlank) {
    window.open(router.resolve(route).href, '_blank');
  } else {
    router.push(route);
  }
};

const warngingLogin = () => {
  ElMessage.warning('请先登录！');
}

// 实时监测用户id变化
watch(
  () => store.getters.getUserId,
  (newVal) => {
    console.log(`用户id`, newVal);
  }
);

// 实时监测登录状态
watch(
  () => store.getters.isLoggedIn,
  (newVal, oldVal) => {
    console.log(`登录状态从 ${oldVal} 更新为 ${newVal}`);
    if (!newVal) {
      console.log('用户已注销，跳转到登录页面');
    }
  }
);

onMounted(() => {
  getUserInfo();
});
</script>

<style scoped>
.nav-bar {
  box-shadow: var(--el-box-shadow);
  z-index: 2002;
  position: fixed ;
  width: 100%;
  top: 0;  /* 固定在页面的顶部 */
  left: 0;
  background-color: white;
}
.logo {
  height: 100%;
  height: 50px; /* 你可以根据需要调整最大高度 */
  object-fit: contain;
  margin-right: 50px;
}

.navbar-item {
  margin-right: 25px;
  color: black;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.navbar-item:hover {
  animation: colorChange 0.4s;
  text-decoration: underline;
  text-decoration-color: var(--v_overall_blue);
  text-shadow: 2px 2px 8px var(--v_overall_blue_light);
}

.navbar-item-text {
  font-size: 15px;
  color: black;
}

.popover-title {
  font-size: 20px;
  margin: 10px;
  color: black;
  font-weight: bold;
  text-align: center;
}

.popover {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.poopover-user-name {
  font-size: 20px;
  margin: 10px;
  color: black;
  font-weight: bold;
}

.popover-choices {
  color: black;
  width: 120px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-evenly;
  cursor: pointer;
  border-radius: 10px;
}

.popover-choices:hover {
  background-color: #e8e8e8;
}

.popover-content {
  font-size: 15px;
}

.avatar {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #bcbcbc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-2 {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #dfdfdf;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar:hover {
  animation: jump 0.35s;
}

.login-botton {
  z-index: 2;
  color: white;
  font-size: 15px;
}

.avatar-container {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.avatar-img {
  position: relative;
  display: inline-block;
  line-height: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  vertical-align: middle;
  border-radius: 50%;
  background-color: transparent;
}
</style>