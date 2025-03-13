<template>
  <NavBar></NavBar>
  <div class="register-container">
    <div class="background">
      <img class="earth-image" src="../assets/ae.gif" alt="Earth" />
    </div>
    <div class="form-container">
      <div class="header-text">注册</div>
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="Username" prop="username" class="my-input">
          <el-input 
            v-model="ruleForm.username"
            placeholder="Username"
            style="font-size: 20px;" 
          />
        </el-form-item>
        <el-form-item label="Email" prop="email" class="my-input">
          <el-input 
            v-model="ruleForm.email"
            placeholder="Email"
            type="email"
            style="font-size: 20px;" 
          />
        </el-form-item>
        <el-form-item label="Password" prop="pass" style="font-size: 20px;" class="my-input">
          <el-input 
            v-model="ruleForm.pass" 
            placeholder="Password" 
            type="password"
            style="font-size: 20px;" 
          />
        </el-form-item>
        <el-form-item label="Confirm" prop="checkPass" style="font-size: 20px;" class="my-input">
          <el-input
            v-model="ruleForm.checkPass" 
            placeholder="Confirm" 
            type="password"
            style="font-size: 20px;" 
          />
        </el-form-item>
      </el-form>
      <el-row class="mb-4">
        <el-button 
          @click="submitForm()" 
          type="primary" 
          style="font-size: 20px; width: 150px; height: 45px;">
          提交
        </el-button>
        <el-button 
          @click="resetForm()" 
          type="primary" 
          style="font-size: 20px; width: 150px; height: 45px;">
          重置
        </el-button>
      </el-row>
      <div>
        <span style="font-size: 20px; vertical-align: middle;">已有账号？去</span>
        <el-link :href="'/login'" style="color: white; font-size: 20px; font-weight: bold; vertical-align: middle;">
          登录
        </el-link>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import { ElMessage } from 'element-plus';  

export default {
  components: {
    NavBar
  },
  data() {
    return {
      ruleForm: {
        username: '',
        email: '',
        pass: '',
        checkPass: '',
      },
      rules: {
        username: [{ validator: this.checkUsername, trigger: 'blur' }],
        email: [{ validator: this.checkEmail, trigger: 'blur' }],
        pass: [{ validator: this.validatePass, trigger: 'blur' }],
        checkPass: [{ validator: this.validatePass2, trigger: 'blur' }],
      },
    };
  },
  methods: {
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleFormRef.validateField('checkPass', () => null);
        }
        callback();
      }
    },

    validatePass2(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入的密码不一致！"));
      } else {
        callback();
      }
    },

    checkUsername(rule, value, callback) {
      if (!value) {
        return callback(new Error('请输入用户名'));
      } else {
        callback();
      }
    },

    checkEmail(rule, value, callback) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailPattern.test(value)) {
        return callback(new Error('请输入有效的邮箱地址'));
      } else {
        callback();
      }
    },

    async submitForm() {      
      try {
        // 构建请求体
        const requestData = {
          username: this.ruleForm.username,  // 用户名
          password: this.ruleForm.pass,          // 密码
          confirmedPassWord: this.ruleForm.checkPass,  // 确认密码
        };

        // 如果 email 存在，则将其加入请求体
        if (this.ruleForm.email) {
          requestData.email = this.ruleForm.email;
        }

        // 发送 POST 请求到后端进行注册
        const response = await this.$api.post('/user/account/register', requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response);
        
        const res = response.data;

        if (res.code === 200) {
          console.log('注册成功！', res);
          // alert('注册成功！');
          ElMessage.success('注册成功！');

          // 注册成功后，进行登录
          this.loginAfterRegistration(this.ruleForm.username, this.ruleForm.pass);
        } else {
          console.error('注册失败！', res.message);
          // alert(res.message);  // 弹出错误提示
          ElMessage.error(res.message);
        }
      } catch (error) {
        console.error('请求错误！', error);
        // alert('请求出错，请稍后再试');
        ElMessage.error('请求出错，请稍后再试');
      }
    },

    // 登录函数：注册成功后使用用户名和密码发起登录请求
    async loginAfterRegistration(username, password) {
      const loginData = {
        username: username,
        password: password
      };

      try {
        const response = await this.$api.post('/user/account/login', loginData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const res = response.data;
        if (res.code === 200) {
          console.log('登录成功！', res);

          const token = res.data.token;
          const user = res.data.user;

          // 存储 token 和用户信息到 Vuex
          this.$store.dispatch('login', {
            uid: user.uid,
            avatar:user.avatar,         // 头像
            email:user.email,           // 邮箱
            status:user.status,         // 级别
            isVerify: user.isVerify,    // 存储是否验证
            institution:user.institution,
            stats:user.stats,           // 账号状态 0正常 1封禁 2已注销
            username: user.username,    // 存储用户名            
            token: token,               // 存储 token
          });

          console.log('存储的 token:', this.$store.state.token);
          console.log('存储的 uid:', this.$store.state.uid);
          console.log('存储的用户信息:', this.$store.state.username);

          // 登录成功后跳转到首页
          this.$router.push('/'); 
        } else {
          console.error('登录失败！', res.message);
          alert(res.message);  // 弹出错误提示
        }
      } catch (error) {
        console.error('请求错误！', error);
        alert('请求出错，请稍后再试');
      }
    },

    resetForm() {
      this.ruleForm.checkPass = '';
      this.ruleForm.email = '';
      this.ruleForm.pass = '';
      this.ruleForm.username = '';
    }
  },
};
</script>


<style scoped>
.register-container {
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

.form-container {
  position: absolute;
  top: 10%;
  right: 13%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 660px;
  height: 620px;
  padding: 20px;
  background-color: transparent;
  /* 半透明背景 */
  border-radius: 80px;
}

.header-text {
  text-shadow: 2px 2px 4px rgb(0, 0, 0); 
  font-size: 80px; 
  color: rgb(255, 255, 255);
  margin-bottom: 10px;
  margin-top: 20px;
}

.my-input {
  height: 35px;
  margin-top: 45px;
  font-family: 'Harmony Font';
}

.my-input /deep/ .el-input__wrapper {
  padding: 5px 15px;
  height: 35px;
  line-height: 35px;
  width: 400px;
  border: 2px solid rgb(213, 213, 213);
  box-shadow: 3px 3px 2px rgba(9, 28, 56, 0.205);
  border-radius: 20px;
}

.my-input /deep/ .el-input__inner {
  font-family: 'Harmony Font';
}

button {
  padding: 8px;
  background-color: var(--v_overall_blue_light);
  color: white;
  border: none;
  cursor: pointer;
  font-family: 'Harmony Font';
  border-radius: 20px;
}

.mb-4 {
  margin-top: 40px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
}

/* 新增样式，设置 el-form-item 的 label 字体大小 */
:deep(.el-form-item__label) {
  font-size: 22px;
}

:deep(.el-form-item__error) {
  margin-top: 18px;
  margin-left: 5px;
  font-size: 15px;
  /* 根据需要调整字体大小 */
  color: red;
  /* 根据需要调整颜色 */
}
</style>
