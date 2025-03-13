<template>
  <NavBar></NavBar>
  <div class="login-container">
    <div class="background">
      <img class="earth-image" src="../assets/ae.gif" alt="Earth" />
    </div>
    <div class="form-container">
      <div class="header-text">登录</div>
      <input type="text" v-model="username" placeholder="Username" style="font-size: 20px; margin-top: 25px;" />
      <input type="password" v-model="password" placeholder="Password" data="passworedtype" style="font-size: 20px;" />
      <el-row class="mb-4">
        <el-button @click="login" style="font-size: 20px; width: 150px; height: 45px;" plain>
          登录
        </el-button>
        <el-button @click="forget" style="font-size: 20px; width: 150px; height: 45px;" plain>
          忘记密码
        </el-button>
      </el-row>
      <div style="">
        <span style="font-size: 20px; vertical-align: middle;">还没有账号？去</span>
        <el-link :href="'/register'" style=" font-size: 20px; vertical-align: middle;">
          注册
        </el-link>
      </div>
    </div>
  </div>

</template>

<script>
import NavBar from '@/components/NavBar.vue';
import 'element-plus/dist/index.css'; // 引入 Element Plus 样式 
import { ElMessage } from 'element-plus';

export default {
  components: {
    NavBar,
  },
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async login() {
      // 检查用户名和密码是否为空
      if (!this.username || !this.password) {
        alert('请输入用户名和密码');
        return;
      }

      try {
        // 构建登录请求体
        const requestData = {
          username: this.username,
          password: this.password,
        };

        // 发送登录请求到后端
        const response = await this.$api.post('/user/account/login', requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const res = response.data;

        if (res.code === 200) {
          console.log('登录成功！', res);

          // 假设 token 和用户信息都在响应的 data 中
          const token = res.data.token;
          const user = res.data.user;

          // 存储 token 和用户信息到 Vuex
          this.$store.dispatch('login', {
            uid: user.uid,              // 存储用户的 uid
            avatar:user.avatar,         // 头像
            email:user.email,           // 邮箱
            status:user.status,         // 级别
            isVerify: user.isVerify,    // 存储是否验证
            institution:user.institution,
            stats:user.stats,           // 账号状态 0正常 1封禁 2已注销
            username: user.username,    // 存储用户名            
            token: token,               // 存储 token
          });

          console.log('存储的用户信息:', this.$store.state.status);

          // 提示用户已成功登录
          ElMessage.success('登录成功！');

          // 跳转到首页
          this.$router.push('/');
        } else {
          console.error('登录失败！', res.message);
          ElMessage.error(res.message);
        }

      } catch (error) {
        console.error('请求错误！', error);
        // alert('请求出错，请稍后再试');
        ElMessage.error('请求出错，请稍后再试');
      }
    },
    forget() {
    },
  },
};
</script>

<style scoped>
.login-container {
  font-family: 'Arial', sans-serif;
  color: white;
  background-color: #000307;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  box-shadow: 0 -10px #000307;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.background {
  position: absolute;
  top: -10%;
  right: 55%;
  width: 1280px;
  height: 1060px;
  overflow: visible;
}

.earth-image {
  width: 100%;
  height: 100%;
  transform: rotate(90deg);
  object-fit: cover;
}

.header-text {
    text-shadow: 0 0 10px #2371ef, 0 0 20px #2371ef, 0 0 30px #2371ef, 0 0 40px #2371ef;
    animation: blink 4s infinite;
  font-size: 80px;
  color: ghostwhite;
  margin-bottom: 30px;
  margin-top: 20px;
}

@keyframes blink {
    0%, 100% {
        text-shadow: 0 0 10px #2371ef, 0 0 20px #2371ef, 0 0 30px #2371ef, 0 0 40px #2371ef;
        opacity: 1;
    }
    50% {
        text-shadow: 0 0 0px #2371ef, 0 0 2px #2371ef, 0 0 4px #2371ef, 0 0 6px #2371ef;
        opacity: 1;
    }
}

.form-container {
  position: absolute;
  top: 15%;
  right: 15%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600px;
  height: 500px;
  padding: 20px;
    border-width: 2px;
    border-color: ghostwhite;
  /* background-color: rgba(249, 249, 249, 0.68); */
    background-color: transparent;
  /* 半透明背景 */
  border-radius: 80px;
}

button {
  padding: 8px;
  background-color: var(--v_overall_blue_light);
  color: white;
  border-color: var(--v_overall_blue_light);
  cursor: pointer;
  font-family: 'Harmony Font';
  border-radius: 20px;
}

input {
  margin: 10px 0;
  padding: 10px 20px;
  height: 30px;
  width: 400px;
  border: 2px solid rgb(213, 213, 213);
  border-radius: 5px;
  box-shadow: 3px 3px 2px rgba(9, 28, 56, 0.205);
  border-radius: 20px;
  font-family: 'Harmony Font';
}

input:focus {
  outline-color: var(--v_overall_blue_light);
  box-shadow: 0 0 15px var(--v_overall_blue_light);
  transition: .1s;
  transition-property: box-shadow;
}

.mb-4 {
  margin-top: 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
}

:deep(.el-button.is-plain) {
    --el-button-hover-text-color: var(--el-color-primary);
    --el-button-hover-bg-color: transparent;
    --el-button-hover-border-color: var(--el-color-primary);
}

:deep(.el-link__inner) {
    color: ghostwhite;
    font-weight: bold;
}

:deep(.el-link__inner:hover) {
        color: var(--el-link-hover-text-color);
}
</style>
