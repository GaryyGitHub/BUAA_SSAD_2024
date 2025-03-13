<template>
  <div class="container">
    <el-card class="card">
      <!-- 抬头 -->
      <template #header>
        <div class="card-header">
          <span>账户信息</span>
        </div>
      </template>
      <!-- 修改信息按钮 -->
      <div class="opertation">
        <el-button 
          color="var(--v_overall_blue)" 
          plain 
          :icon="Setting" 
          size="large" 
          style="font-size: 16px; margin-right: 100px;" 
          @click="modifyFlag = !modifyFlag">
          <span v-if="!modifyFlag">修改信息</span>
          <span v-else>取消修改</span>
        </el-button>
      </div>
      <!-- 表单 -->
      <el-form class="form" :model="userInfo" label-width="150px" style="max-width: 600px" size="large">
        <el-form-item>
          <template #label>
            <span class="form-item-text">ID</span>
          </template>
          <span class="form-item-text">{{ userInfo.uid }}</span>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="form-item-text">用户名</span>
          </template>
          <el-input v-if="modifyFlag" v-model="userInfo.username" />
          <span v-else class="form-item-text">{{ userInfo.username }}</span>
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="form-item-text">邮箱</span>
          </template>
          <el-input v-if="modifyFlag" v-model="userInfo.email" />
          <span v-else class="form-item-text">{{ userInfo.email }}</span>
        </el-form-item>
        <!-- <el-form-item>
          <template #label>
            <span class="form-item-text">所属机构</span>
          </template>
          <el-input v-if="modifyFlag" v-model="userInfo.institution" />
          <span v-else class="form-item-text">{{ userInfo.institution }}</span>
        </el-form-item> -->
        <el-form-item>
          <template #label>
            <span class="form-item-text">学者认证状态</span>
          </template>
          <span class="form-item-text" v-if="userInfo.isVerify">
            <el-icon color="green" size="20"><SuccessFilled /></el-icon>&nbsp;已认证
          </span>
          <span class="form-item-text" v-else>
            <el-icon color="red" size="20"><CircleCloseFilled /></el-icon>&nbsp;未认证
          </span>
        </el-form-item>
      </el-form>
      <div class="confirm">
        <el-button 
          v-if="modifyFlag"
          color="var(--v_overall_blue)"
          plain
          :icon="Check"
          size="large"
          style="font-size: 16px; margin-right: 100px;"
          @click="onSubmit">
          提交修改
        </el-button>
      </div>
    </el-card>
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <span>密码修改</span>
        </div>
      </template>
      <el-form class="form" :model="pwdForm" label-width="100px" style="max-width: 600px" size="large">
        <el-form-item>
          <template #label>
            <span class="form-item-text">原密码</span>
          </template>
          <el-input 
            v-model="pwdForm.oldPassword"
            type="password"
            placeholder="请输入原密码"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="form-item-text">新密码</span>
          </template>
          <el-input 
            v-model="pwdForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="form-item-text">确认密码</span>
          </template>
          <el-input 
            v-model="pwdForm.confirmPassword"
            type="password"
            placeholder="请再输入一遍新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <div class="confirm">
        <el-button
          color="var(--v_overall_blue)"
          plain
          :icon="Check"
          size="large"
          style="font-size: 16px; margin-right: 100px;"
          @click="confirmPwdForm">
          提交修改
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { Setting, Check, SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import api from '@/api/axios';

const route = useRoute();
const store = useStore();

const modifyFlag = ref(false)

const userId = computed(() => {
  return route.params.id;
});

const userInfo = ref({})

const getUserInfo = async() => {
  // TODO: 获取用户信息，调用：/user/personal/homeInfo
  console.log('获取用户信息', userId.value)
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

const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const onSubmit = () => {
  const newNickname = userInfo.value.username;
  const newEmail = userInfo.value.email;
  const institution = userInfo.value.institution;
  confirmUserForm(newNickname, newEmail, institution);
  modifyFlag.value = false
}

const confirmUserForm = async (username, email, institution) => {
  try {
    // 调用接口更新用户信息
    console.log('233', store.getters.getToken)
    const response = await api.put('/user/personal/updateInfo', {
      username: username, // 用户输入的新昵称
      email: email,       // 用户输入的新邮箱
      institution: institution, // 用户输入的新机构
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.getters.getToken}`,  // 将 token 添加到请求头
      },
    });
    console.log('response', response)
    getUserInfo()
    // 如果成功，弹出提示并关闭修改模式
    ElMessage.success('个人信息修改成功');
    modifyFlag.value = false;
  } catch (error) {
    // 如果请求失败，弹出错误信息
    ElMessage.error(`修改失败: ${error.message}`);
  }
}

const confirmPwdForm = async() => {
  if (pwdForm.newPassword !== pwdForm.confirmPassword) {
    pwdForm.oldPassword = ''
    pwdForm.newPassword = ''
    pwdForm.confirmPassword = ''
    ElMessage.error('两次输入的密码不一致，请重新输入')
    return
  }
  if (pwdForm.newPassword.length < 6) {
    pwdForm.oldPassword = ''
    pwdForm.newPassword = ''
    pwdForm.confirmPassword = ''
    ElMessage.error('密码长度必须不小于6位')
    return
  }
  if (pwdForm.newPassword === pwdForm.oldPassword) {
    pwdForm.oldPassword = ''
    pwdForm.newPassword = ''
    pwdForm.confirmPassword = ''
    ElMessage.error('新密码不能与原密码相同')
    return
  }
  // const res = await api.post('/user/password/update', {
  //   pw: pwdForm.oldPassword,       // 用户输入的新邮箱
  //   npw: pwdForm.newPassword, // 用户输入的新昵称
  // });
  // console.log('res', res)
  // TODO: 密码修改逻辑
  ElMessage.success('密码修改成功')
  pwdForm.oldPassword = ''
  pwdForm.newPassword = ''
  pwdForm.confirmPassword = ''
}

onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.container {
  line-height: 1.5;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.card {
  box-shadow: var(--el-box-shadow);
  width: 1300px;
  margin-bottom: 20px;
}

.card-header {
  width: 1300px;
  font-size: 26px;
  font-weight: bold;
  margin-top: 5px;
  text-align: center;
}

.opertation {
  width: 1300px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
}

.form-item-text {
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
}

.confirm {
  width: 1300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
</style>