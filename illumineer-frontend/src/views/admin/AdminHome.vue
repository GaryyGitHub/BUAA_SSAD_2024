<template>
  <NavBar></NavBar>
  <div class="gray-rounded-rect">
    <div class="inner-rect1"
      style="background-color: white; display: flex; justify-content: space-between; align-items: center; padding: 0 200px;">
      <div class="title">管理员XXX, 你好</div>
      <div>
        <el-button type="primary" @click="showPendingAppeals">待处理申诉</el-button>
        <el-button type="success" @click="showProcessedAppeals" style="margin-left: 10px;">已处理申诉</el-button>
      </div>
    </div>

    <div class="inner-rect2" style="background-color: white;">
      <!-- 显示待处理申诉 -->
      <div v-if="currentView === 'pendingAppeals'" class="table-container">
        <h3>待处理申诉</h3>

        <!-- 分页器和每页显示输入框（放在表格上方） -->
        <div class="pagination-wrapper"
          style="display: flex; justify-content: space-between; align-items: center; padding: 0 50px;">
          <el-pagination :current-page="currentPage" :page-size="pageSize" :total="pendingAppeals.length"
            @current-change="handlePageChange" layout="prev, pager, next, jumper" />

          <div class="page-size-selector">
            <span>每页显示：</span>
            <el-input-number v-model="pageSize" :min="1" :max="100" label="每页显示条目数" @change="updateCurrentPageData" />
          </div>
        </div>

        <!-- 表格容器 -->
        <div class="table-wrapper">
          <el-table :data="currentPageData" style="width: 100%; overflow: hidden;">
            <!-- 显示申诉ID -->
            <el-table-column prop="appealId" label="申诉ID" align="center" />
            <!-- 显示申诉者ID -->
            <el-table-column prop="appellantId" label="申诉者ID" align="center" />
            <!-- 显示被申诉者ID -->
            <el-table-column prop="ownerId" label="被申诉者ID" align="center" />
            <!-- 显示文章ID (pid) -->
            <el-table-column prop="pid" label="文章ID" align="center" />
            <!-- 显示申诉时间 -->
            <el-table-column prop="appealTime" label="申诉时间" align="center">
              <template v-slot:default="{ row }">
                {{ formatDate(row.appealTime) }}
              </template>
            </el-table-column>
            <!-- 显示申诉是否已完成 -->
            <el-table-column prop="accomplish" label="处理状态" align="center">
              <template v-slot:default="{ row }">
                {{ row.accomplish ? '已处理' : '待处理' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template v-slot:default="{ row }">
                <el-button type="primary" @click="handleAppeal(row)">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 显示已处理申诉 -->
      <div v-if="currentView === 'processedAppeals'" class="table-container">
        <h3>已处理申诉</h3>

        <!-- 分页器和每页显示输入框（放在表格上方） -->
        <div class="pagination-wrapper"
          style="display: flex; justify-content: space-between; align-items: center; padding: 0 50px;">
          <el-pagination :current-page="currentPage" :page-size="pageSize" :total="processedAppeals.length"
            @current-change="handlePageChange" layout="prev, pager, next, jumper" />

          <div class="page-size-selector">
            <span>每页显示：</span>
            <el-input-number v-model="pageSize" :min="1" :max="100" label="每页显示条目数" @change="updateCurrentPageData" />
          </div>
        </div>

        <!-- 表格容器 -->
        <div class="table-wrapper">
          <el-table :data="currentPageData" style="width: 100%; overflow: hidden;">
            <!-- 显示申诉ID -->
            <el-table-column prop="appealId" label="申诉ID" align="center" />
            <!-- 显示申诉者ID -->
            <el-table-column prop="appellantId" label="申诉者ID" align="center" />
            <!-- 显示被申诉者ID -->
            <el-table-column prop="ownerId" label="被申诉者ID" align="center" />
            <!-- 显示文章ID (pid) -->
            <el-table-column prop="pid" label="文章ID" align="center" />
            <!-- 显示处理时间 -->
            <el-table-column prop="appealTime" label="申诉时间" align="center">
              <template v-slot:default="{ row }">
                {{ formatDate(row.appealTime) }}
              </template>
            </el-table-column>
            <!-- 显示申诉是否已完成 -->
            <el-table-column prop="accomplish" label="处理状态" align="center">
              <template v-slot:default="{ row }">
                {{ row.accomplish ? '已处理' : '待处理' }}
              </template>
            </el-table-column>
            <!-- 显示处理时间 -->
            <el-table-column prop="handleTime" label="处理时间" align="center">
              <template v-slot:default="{ row }">
                {{ formatDate(row.handleTime) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

    </div>

    <!-- 申诉处理弹窗 -->
    <el-dialog v-model="dialogVisible" title="处理申诉" width="50%">
      <div>
        <p><strong>用户名:</strong> {{ currentAppeal.username }}</p>
        <p><strong>申诉内容:</strong></p>
        <div class="appeal-content">
          {{ currentAppeal.appeal }}
        </div>
        <p><strong>申诉时间:</strong> {{ formatDate(currentAppeal.appealTime) }}</p>
      </div>
      <template v-slot:footer>
        <el-button @click="handleAppealCancel">取消</el-button>
        <el-button type="primary" @click="approveAppeal">同意申诉</el-button>
        <el-button type="danger" @click="rejectAppeal">拒绝申诉</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import NavBar from '@/components/NavBar.vue';

export default {
  components: {
    NavBar
  },
  data() {
    return {
      currentView: 'pendingAppeals', // 当前视图，'pendingAppeals' 或 'processedAppeals'
      pendingAppeals: [], // 待处理申诉列表
      processedAppeals: [], // 已处理申诉列表
      currentPage: 1, // 当前页
      pageSize: 8, // 每页显示的条数
      currentPageData: [], // 当前页面的数据
      dialogVisible: false, // 弹窗控制
      currentAppeal: { appellantId: '', appeal: '', status: '', appealTime: '', appealId: '' }, // 当前处理的申诉
    };
  },
  methods: {
    // 加载申诉数据
    async loadAppeals(handled) {
      try {
        const response = await this.$api.get('/user/appeal/getpage', {
          params: {
            quantity: 1000,
            index: 1,
            handled: handled
          }
        });

        const data = response.data;

        if (data.code === 200) {
          if (handled) {
            this.processedAppeals = data.data;
          } else {
            this.pendingAppeals = data.data;
          }
          this.updateCurrentPageData();
        } else {
          ElMessage.error(data.message);
        }
      } catch (error) {
        console.error('请求错误！', error);
        ElMessage.error('请求出错，请稍后再试');
      }
    },

    // 计算当前页显示的数据
    updateCurrentPageData() {
      let data = this.currentView === 'pendingAppeals' ? this.pendingAppeals : this.processedAppeals;
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.currentPageData = data.slice(start, end);
    },

    // 处理页码变化
    handlePageChange(page) {
      this.currentPage = page;
      this.updateCurrentPageData();
    },

    // 处理显示待处理申诉
    showPendingAppeals() {
      this.currentView = 'pendingAppeals';
      this.loadAppeals(false); // 加载待处理申诉
    },

    // 处理显示已处理申诉
    showProcessedAppeals() {
      this.currentView = 'processedAppeals';
      this.loadAppeals(true); // 加载已处理申诉
    },

    // 格式化时间
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    // 处理申诉
    handleAppeal(appeal) {
      this.currentAppeal = appeal;
      this.dialogVisible = true;
    },

    // 取消申诉处理
    handleAppealCancel() {
      this.dialogVisible = false;
    },

    // 处理申诉
    async approveAppeal() {
      console.log(this.currentAppeal.appealId);
      try {
        // 使用 FormData 构造请求体
        const formData = new FormData();
        formData.append('appealEntryId', this.currentAppeal.appealId); // 确保 appealEntryId 传递正确
        formData.append('acceptAppeal', 'true'); // 用字符串来传递布尔值，后端可以转换

        const response = await this.$api.post('/user/appeal/judge', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // 使用 FormData
          },
        });

        if (response.data.code === 200) {
          ElMessage.success('申诉处理成功');
          this.loadAppeals(this.currentView === 'processedAppeals'); // 更新申诉列表
          this.dialogVisible = false;
        } else {
          ElMessage.error(response.data.message);
        }
      } catch (error) {
        console.error('请求错误！', error);
        ElMessage.error('处理失败，请稍后再试');
      }
    },


    // 拒绝申诉
    async rejectAppeal() {
      console.log(this.currentAppeal.appealId);
      try {
        const formData = new FormData();
        formData.append('appealEntryId', this.currentAppeal.appealId); // 确保这个字段传递正确
        formData.append('acceptAppeal', 'false'); // 用字符串来传递布尔值，后端可以转换

        const response = await this.$api.post('/user/appeal/judge', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // 使用 FormData
          },
        });

        if (response.data.code === 200) {
          ElMessage.success('申诉处理成功');
          this.loadAppeals(this.currentView === 'processedAppeals');
          this.dialogVisible = false;
        } else {
          ElMessage.error(response.data.message);
        }
      } catch (error) {
        console.error('请求错误！', error);
        ElMessage.error('处理失败，请稍后再试');
      }
    },
  },

  mounted() {
    // 检查当前用户是否为管理员
    if (this.$store.state.status !== 0) {
      // 如果不是管理员，可以进行重定向或者显示提示
      this.$router.push('/not-authorized');  // 假设你有一个没有权限的页面
      ElMessage.error('您没有权限访问此页面');
    } else {
      this.showPendingAppeals(); // 默认显示待处理申诉
    }
  }
};
</script>


<style scoped>
.table-wrapper {
  max-height: 400px;
  /* 限制表格的最大高度，可以根据需要调整 */
  overflow-y: auto;
  /* 启用垂直滚动条 */
  margin-bottom: 20px;
  /* 给表格与分页器之间留出空间 */
}


.appeal-content {
  max-height: 200px;
  overflow-y: auto;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.gray-rounded-rect {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -45%);
  width: 80vw;
  height: 80vh;
  background-color: rgb(232, 230, 230);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.inner-rect1 {
  flex: 0.1;
  margin: 10px 0;
}

.inner-rect2 {
  flex: 1;
  margin: 10px 0;
}

.table-container {
  margin-top: 20px;
}
</style>
