<template>
  <div class="gray-rounded-rect1" style="margin-top: 80px;">
    <div>已认领文献</div>
    <el-table v-loading="loading1" element-loading-text="正在加载数据..." ref="multipleTableRef" size='large' height="450"
      :data="noChooseTableData" class="noChooseTable" scrollbar-always-on>
      <el-table-column property="pid" label="文献编号" width="180" />
      <el-table-column label="篇名">
        <template #default="scope">
          <a :href="'/article/' + scope.row.pid" target="_blank" class="literature-link">
            {{ scope.row.title }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="作者">
        <template #default="scope">
          <span>
            <!-- 假设author字段是一个对象或数组，遍历并显示多个作者 -->
            {{ formatAuthors(scope.row.auths) }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column property="source" label="来源" /> -->
      <el-table-column property="publishDate" label="时间" />
    </el-table>
  </div>
  <div class="gray-rounded-rect2" style="margin-top: 200px;">
    <div>可能和您相关的文献</div>
    <el-table v-loading="loading2" element-loading-text="正在加载数据..." ref="multipleTableRef" size='large' height="380"
      :data="chooseTableData" class="chooseTable">
      <el-table-column property="pid" label="文献编号" width="180" />
      <el-table-column label="篇名">
        <template #default="scope">
          <a :href="'/article/' + scope.row.pid" target="_blank" class="literature-link">
            {{ scope.row.title }}
          </a>
        </template>
      </el-table-column>
      <!-- <el-table-column property="author" label="作者" /> -->
      <el-table-column label="作者">
        <template #default="scope">
          <span>
            <!-- 假设author字段是一个对象或数组，遍历并显示多个作者 -->
            {{ formatAuthors(scope.row.auths) }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column property="source" label="来源" /> -->
      <el-table-column property="publishDate" label="时间" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button v-if="!scope.row.hasBeenAdoptedByTheAuth" size="small" type="primary"
            @click="handleClaim(scope.row, scope.$index)">
            是我的
          </el-button>
          <el-button v-if="scope.row.hasBeenAdoptedByTheAuth" size="small" type="primary" disabled>
            已被认领
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index)">
            不是我的
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>


</template>


<script>
export default ({
  data() {
    return {
      // noChooseTableData: [
      //   {
      //     id: 10,
      //     name: '《太空探索》与人类未来的生存和发展',
      //     author: '赵二十九;  钱三十;  孙三十一',
      //     source: '2025/8',
      //     date: '2025-08-25',
      //   },
      // ],
      // chooseTableData: [
      //   {
      //     id: 10,
      //     name: '《太空探索》与人类未来的生存和发展',
      //     author: '赵二十九;  钱三十;  孙三十一',
      //     source: '2025/8',
      //     date: '2025-08-25',
      //   },
      // ]
      loading1: false,
      loading2: false,
      noChooseTableData: [],
      chooseTableData: []
    }
  },
  mounted() {
    this.loading1 = true;
    this.loading2 = true;
    // this.getUserPaper(); // 页面加载时调用
    this.getPossiblePaper(); // 页面加载时调用
  },
  methods: {
    async getUserPaper() {
      this.loading1 = true;
      console.log("name is: ", this.$store.state.name);
      this.noChooseTableData = this.chooseTableData = [];
      this.$api.get('/user/auth/getClaimedList', {
        // this.$api.get('/document/belong/name', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.$store.state.token}`,  // 将 token 添加到请求头
        },
        params: {
          name: this.$store.state.name,
          uid: this.$store.state.uid
        }
      })
        .then(response => {
          const res = response.data;
          if (res.code === 200) {
            this.noChooseTableData = this.chooseTableData = [];
            console.log('获取用户已认领文献成功！', res);
            for (let index = 0; index < res.data.length; index++) {
              const element = res.data[index];
              console.log(element);

              if (!element.hasBeenAdoptedByTheAuth) {
                this.noChooseTableData.push(element);
              }

            }
            // this.noChooseTableData = res.data;
          } else {
            // 处理失败的响应
            console.error('获取用户已认领文献失败！', res.message);
            alert(res.message);  // 弹出错误提示
          }
        })
        .catch(error => {
          console.error('请求错误！', error);
          alert('请求出错，请稍后再试');
        });

      this.loading1 = false;
    },
    async getPossiblePaper() {
      this.loading1 = true;
      this.loading2 = true;
      this.$api.get('/user/auth/getListToClaim', {
      //this.$api.get('/document/ado/name', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.$store.state.token}`,  // 将 token 添加到请求头
        },
        params: {
          name: this.$store.state.name,
          uid: this.$store.state.uid
        }
      })
        .then(response => {
          const res = response.data;

          if (res.code === 200) {

            // console.log('获取用户待认领文献成功！', res);
            // for (let index = 0; index < res.data.result.length; index++) {
            //   let element = res.data.result[index];
            //   element.hasBeenAdoptedByTheAuth = true;
            //   console.log(this.checkPaperAuthorship(element));

            //   if (this.checkPaperAuthorship(element) == 2) {
            //     this.noChooseTableData.push(element);
            //   }
            //   else if (this.checkPaperAuthorship(element) == 1) {
            //     this.chooseTableData.push(element);
            //   }
            //   else {
            //     element.hasBeenAdoptedByTheAuth = false;
            //     this.chooseTableData.push(element);
            //   }
            // }
            // this.chooseTableData = res.data;
            // 创建临时变量避免重复添加
            const newNoChooseData = [];
            const newChooseData = [];

            for (let index = 0; index < res.data.length; index++) {
              const element = res.data[index];
              element.hasBeenAdoptedByTheAuth = true;

              const authorshipStatus = this.checkPaperAuthorship(element);

              if (authorshipStatus === 2) {
                // 只添加不重复的文献
                if (!this.noChooseTableData.some(item => item.pid === element.pid)) {
                  newNoChooseData.push(element);
                }
              } 
              else if (authorshipStatus === 1) {
                if (!this.chooseTableData.some(item => item.pid === element.pid)) {
                  newChooseData.push(element);
                }
              }
              else {
                element.hasBeenAdoptedByTheAuth = false;
                // 添加到 chooseTableData 中（避免重复）
                if (!this.chooseTableData.some(item => item.pid === element.pid)) {
                  newChooseData.push(element);
                }
              }
            }

            // 更新数据
            this.noChooseTableData = [...this.noChooseTableData, ...newNoChooseData];
            this.chooseTableData = [...this.chooseTableData, ...newChooseData];
          } else {
            // 处理失败的响应
            console.error('获取用户待认领文献失败！', res.message);
            alert(res.message);  // 弹出错误提示
          }
        })
        .catch(error => {
          console.error('请求错误！', error);
          alert('请求出错，请稍后再试');
        });
      this.loading1 = this.loading2 = false;
    },
    async handleClaim(row, index) {
      console.log(row);
      const formData = new FormData();
      formData.append('uid', this.$store.state.uid);
      formData.append('pid', row.pid);
      // this.$api.post('/user/user/set/authPaper', formData, {
      await this.$api.post('/user/claim', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${this.$store.state.token}`,  // 将 token 添加到请求头
        },
      })
        .then(async response => {
          const res = response.data;
          if (res.code === 200) {
            console.log('认领成功！', res);
            // this.noChooseTableData = this.chooseTableData = [];
            // this.getUserPaper();
            this.handleDelete(index);
            await this.getPossiblePaper();

          } else {
            // 处理失败的响应
            console.error('认领失败！', res.message);
            alert(res.message);  // 弹出错误提示
          }
        })
        .catch(error => {
          console.error('请求错误！', error);
          alert('请求出错，请稍后再试');
        });
    },
    handleDelete(index) {
      this.chooseTableData.splice(index, 1);
    },
    formatAuthors(auths) {
      if (auths && typeof auths === 'object') {
        // 如果是对象，返回所有作者名称
        return Object.keys(auths).join(', ');
      }
      return ''; // 如果没有作者信息，返回空字符串
    },
    checkPaperAuthorship(paper) {
      if (!paper.auths || typeof paper.auths !== 'object') {
        return 0; // 文献中没有作者信息，返回 0
      }

      for (const [authorName, authorId] of Object.entries(paper.auths)) {
        if (authorName === this.$store.state.name) {
          if (authorId === this.$store.state.uid) {
            return 2; // 作者名和 ID 都匹配
          }
          else if (authorId != this.$store.state.uid && authorId != 0) {
            return 1; // 作者名匹配，但 ID 不匹配
          }
          else return 0;
        }
      }

      return 0; // 没有找到匹配的作者
    }

  }
})

</script>

<style>
.gray-rounded-rect1 {
  position: absolute;
  top: 2%;
  /* 从页面顶部开始，向下偏移 50% */
  left: 15%;
  /* 从页面左侧开始，向右偏移 50% */
  transform: translate(0%, 0%);
  /* 将元素自身中心移动到页面中心 */
  width: 83vw;
  /* 宽度为视口宽度的 50%，即占据中间到右侧的全部空间 */
  height: 30vw;
  /* 高度可以自动调整，也可以指定一个具体值 */
  background-color: rgb(233, 241, 254);
  /* 灰色背景 */
  border-radius: 15px;
  /* 圆角半径 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* 可选的阴影效果 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* 或者使用其他布局方式，如 space-between, center 等 */
  align-items: center;
  padding: 10px;
  /* 内边距，根据需要调整 */
  box-sizing: border-box;
  /* 确保内边距不会增加元素的总宽度 */
}

.noChooseTable {
  position: absolute;
  top: 10%;
  /* 从页面顶部开始，向下偏移 50% */
  left: 2%;
  /* 从页面左侧开始，向右偏移 50% */
  width: 95%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* 或者使用其他布局方式，如 space-between, center 等 */
  align-items: center;
  padding: 10px;
  /* 内边距，根据需要调整 */
  box-sizing: border-box;
  /* 确保内边距不会增加元素的总宽度 */
}

.gray-rounded-rect2 {
  position: absolute;
  top: 50%;
  /* 从页面顶部开始，向下偏移 50% */
  left: 15%;
  /* 从页面左侧开始，向右偏移 50% */
  transform: translate(0%, 0%);
  /* 将元素自身中心移动到页面中心 */
  width: 83vw;
  /* 宽度为视口宽度的 50%，即占据中间到右侧的全部空间 */
  height: 25vw;
  /* 高度可以自动调整，也可以指定一个具体值 */
  background-color: rgb(232, 230, 230);
  /* 灰色背景 */
  border-radius: 15px;
  /* 圆角半径 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* 可选的阴影效果 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* 或者使用其他布局方式，如 space-between, center 等 */
  align-items: center;
  padding: 10px;
  /* 内边距，根据需要调整 */
  box-sizing: border-box;
  /* 确保内边距不会增加元素的总宽度 */
}

.noChooseTable {
  position: absolute;
  top: 10%;
  /* 从页面顶部开始，向下偏移 50% */
  left: 2%;
  /* 从页面左侧开始，向右偏移 50% */
  width: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 添加这个样式来垂直居中 */
}

.chooseTable {
  position: absolute;
  top: 10%;
  /* 从页面顶部开始，向下偏移 50% */
  left: 2%;
  /* 从页面左侧开始，向右偏移 50% */
  width: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 添加这个样式来垂直居中 */
}
</style>