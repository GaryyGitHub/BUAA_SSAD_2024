<template>
    <div>
        <!-- 加载状态 -->
        <el-card v-if="loading">
        <el-spin />
        </el-card>

        <!-- 历史记录表格 -->
        <el-table
        v-else
        :data="historyList"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
        >
        <el-table-column
            type="selection"
            width="55"
            v-model="selectedRecords"
        ></el-table-column>

        <el-table-column
            label="标题"
            prop="title"
        ></el-table-column>

        <el-table-column
            label="作者"
            prop="auths"
            :formatter="formatAuthors"
        ></el-table-column>

        <el-table-column
            label="发布日期"
            prop="publishDate"
            :formatter="formatDate"
        ></el-table-column>

        </el-table>
        <!-- 删除按钮 -->
        <el-button
        type="danger"
        @click="deleteSelected"
        >
        删除选中记录
        </el-button>
    </div>
</template>

<script>

export default {
data() {
    return {
    historyList: [],
    loading: false,
    total: 0,
    currentPage: 1,
    quantity: 10,
    selectedRecords: [],
    selectedIds: []
    };
},
methods: {
    formatAuthors(row, column, authors) {
      // 使用Object.keys()获取作者名称的数组
      const authorNames = Object.keys(authors);
      // 将作者名称数组通过逗号连接成字符串
      return authorNames.join(', ');
    },
    formatDate(row, column, dateString) {
      // 将ISO 8601日期字符串转换为Date对象
      console.log(dateString)
      const date = new Date(dateString);
      console.log(date)
      // 格式化为YYYY-MM-DD形式
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要加1
      const day = String(date.getDate()).padStart(2, '0'); // 补齐日期为两位数
      return `${year}-${month}-${day}`;
    },
    // 获取历史记录
    async fetchHistory() {
        this.loading = true;
        try {
            const response = await this.$api.get('/user/history/getAPage', {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.$store.state.token}`,  // 将 token 添加到请求头
                },
            });
            this.historyList = response.data.data;
            console.log(response.data.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            this.loading = false;
        }
    },
    handleSelectionChange(selectedRows) {
        this.selectedRecords = selectedRows;
        // 通过映射获取每个选中行的id，假设id是行数据的属性
        console.log(this.selectedRecords);
        this.selectedIds = this.selectedRecords.map(row => row.pid);
        console.log(this.selectedIds);  // 确认id被正确获取
    },

    // 删除选中的记录
    async deleteSelected() {
        if (this.selectedIds.length === 0) {
            this.$message.warning("请先选择要删除的行！");
            return;
        }
        try {
            const formData = new FormData();
            formData.append('pids', this.selectedIds);
            await this.$api.post('/user/history/delete', formData, {
                headers: {
                    'Authorization': `Bearer ${this.$store.state.token}`,  // 将 token 添加到请求头
                },
            });
            this.fetchHistory(); // 删除后重新加载数据
            this.selectedRecords = []; // 清空选择
        } catch (error) {
            console.error('Error deleting history:', error);
        }
    },
},
// 组件挂载时加载历史记录
mounted() {
    this.fetchHistory();
}
};
</script>

<style>
/* 样式可根据需要自定义 */
</style>
  