<template>
  <div class="form-container">
    <el-form :model="formData" ref="vForm" :rules="rules" label-width="100px" class="form" size="large" @submit.prevent>
      <p v-if="!isVerify && op == 0">请选择验证方式</p>
      <el-button type="primary" @click="op = 1" v-if="!isVerify && op == 0">邮箱认证</el-button>
      <el-button type="primary" @click="verifyUserByORCID" v-if="!isVerify && op == 0">ORCID认证</el-button>
      <el-form-item label="真实姓名" prop="name" v-if="op == 1" >
        <el-input v-model="formData.name" type="text" clearable style="width: 600px;" placeholder="请输入真实姓名">
        </el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender" v-if="op == 1 || op == 2">
        <el-radio-group v-model="formData.gender">
          <el-radio v-for="(item, index) in genderOptions" :key="index" :label="item.value" :disabled="item.disabled"
            style="display: inline">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" v-if="op == 1">
        <el-input
          v-model="formData.email"
          type="text"
          clearable
          style="width: 400px;"
          placeholder="请输入平台中机构下的邮箱"
          :disabled="isEmailDisabled" 
        ></el-input>
        <el-button @click="getToken" type="primary" :loading="loading" :disabled="loading || !formData.email || isEmailDisabled">
          验证
        </el-button>
      </el-form-item>
      <el-form-item label="工作单位" prop="institution" v-if="op == 1 || op == 2">
        <el-input v-model="formData.institution" type="text" clearable style="width: 600px;" placeholder="请输入工作单位">

        </el-input>
      </el-form-item>

      <el-button type="primary" @click="submitForm" v-if="op == 1 || op == 2">提交</el-button>

    </el-form>
    <el-dialog
      v-model="dialogVisible"
      title="提示"
      width="30%">
      <span>跳转成功，请填写其他信息</span>
      <template #footer>
        <el-button @click="dialogVisible = false">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { ElMessage} from 'element-plus'; // 导入 ElMessage
import api from '@/api/axios'; // 根据你的文件结构调整路径

export default defineComponent({
  data() {
    return {
      isVerify: false, // 新增字段，用于判断是否已认证
      op: 0,
      token: "",
      formData: {
        userName: "",
        name: "",
        gender: 1,
        email: "",
        institution: "",
        description: "",
        token: "", // 增加 token 字段用于存储验证码
      },
      rules: {
        name: [{
          required: true,
          message: '字段值不可为空',
        }],
        gender: [{
          required: true,
          message: '字段值不可为空',
        }],
        email: [{
          required: true,
          message: '字段值不可为空',
        }, {
          pattern: /^([-_A-Za-z0-9.]+)@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/,
          trigger: ['blur', 'change'],
          message: '请输入正确的邮箱地址'
        }],
        institution: [{
          required: true,
          message: '字段值不可为空',
        }],
        token: [{
          required: true,
          message: '请输入验证码',
        }]
      },
      genderOptions: [{
        "label": "男",
        "value": 1
      }, {
        "label": "女",
        "value": 2
      }],
      loading: false, // 用于控制按钮的加载状态
      userId: this.$store.state.uid, // 从 store 获取用户 ID
      isEmailDisabled: false,  // 控制是否禁用输入框
      dialogVisible: false,    // 弹窗显示状态
    };
  },
  methods: {
    // 获取验证码
    async getToken() {
      this.loading = true; // 启动加载状态
      try {
        const responst = await api.post('/user/auth/register', null, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$store.getters.getToken}`,  // 将 token 添加到请求头
          },
          params: {
            email: this.formData.email,
          }
        });
        if(responst.status === 200){
          ElMessage.success('验证码已发送至邮箱,请注意查收');
        }else{
          ElMessage.error('验证码发送失败');
        }
      } catch (error) {
        console.error('获取验证码失败:', error);
      } finally {
        this.loading = false; // 结束加载状态
      }
    },
    // 提交表单
    async submitForm() {
      if(this.op == 1){
        this.$refs['vForm'].validate(async (valid) => {
          if (!valid) return;

          try {
            // 验证验证码
            const verifyResponse = await api.get('/user/auth/verify', { 
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.$store.state.token}`,  // 将 token 添加到请求头
              },
              params:{
                token: this.token
              }
            });
            if (verifyResponse.status === 200) {
              // 验证成功，更新用户信息
              const updateResponse = await api.put('/user/personal/updateInfo', this.formData);
              if (updateResponse.status === 200) {
                ElMessage.success('信息更新成功');
                this.isVerify = true;
                this.$router.push('/scholarInfo/' + this.$store.state.uid);
                window.location.reload();
              } else {
                ElMessage.error('信息更新失败');
              }
            } else {
              ElMessage.error('验证错误');
            }
          } catch (error) {
            ElMessage.error('提交失败');
          }
        });
      }else if(this.op == 2){
        try {
          const verifyResponse = await api.get('/auth/orcid/callback', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$store.state.token}`,  // 将 token 添加到请求头
            },
            params:{
              code: this.token,
              gender: this.formData.gender,
              institution: this.formData.institution,
            }
          });
          if (verifyResponse.status === 200) {
            // 验证成功，更新用户信息
            ElMessage.success('信息更新成功');
            this.isVerify = true;
            this.$router.push('/scholarInfo/' + this.$store.state.uid + '/scholarHome');
          } else {
            ElMessage.error('验证错误');
          }
        } catch (error) {
          ElMessage.error('提交失败');
        }
      }
    },
    async fetchUserInfo() {
      try {
        const response = await api.get('/user/personal/homeInfo', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$store.state.token}`,  // 将 token 添加到请求头
          },
          params: {
            uid: this.$store.state.uid, // 使用 Vuex store 中的 uid
          },
        });
        if (response.status === 200) {
          this.isVerify = response.data.data.isVerify;
          console.log(this.isVerify);
          console.log(this.op);
        } else {
          console.error('获取用户信息失败');
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },
    async verifyUserByORCID() {
        console.log("1111" + this.$store.state.uid);
        const formData = new FormData();
        formData.append('uid', this.$store.state.uid);
      try {
          const response = await this.$api.post('/user/auth/orcid/sendRedis' , formData, {
              headers:{
                  'Content-Type': 'multipart/form-data',
              }
          });
          //window.location.href = 'http://127.0.0.1:9090/user/auth/orcid';
          window.open('http://127.0.0.1:9090/user/auth/orcid', '_blank');
          console.log(response);
        this.op = 2;
      } catch (error) {
        ElMessage.error('跳转失败');
      }
    }
  },
  mounted() {
    // 获取用户信息
    this.fetchUserInfo();
    const { token, email, code } = this.$route.query;

    // 如果 token 和 email 存在
    if (token && email) {
      // 设置 email 的值并禁用输入框
      this.op = 1;
      this.formData.email = email;
      this.isEmailDisabled = true;
      this.token = token;
      // 弹出提示框
      this.dialogVisible = true;
    }
    if(code){
      this.op = 2;
      this.token = code;
      // 弹出提示框
      this.dialogVisible = true;
    }
  },
});
</script>


<style>
.form-container {
  padding-top: 30px;
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  /* 添加这个样式来垂直居中 */
}

.form {
  width: 700px;
  background-color: white;
  /* 背景色 */
  border-radius: 10px;
  /* 圆角 */
  padding: 50px 50px 50px 20px;
  /* 内边距 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  /* 可选：阴影效果 */
}
</style>