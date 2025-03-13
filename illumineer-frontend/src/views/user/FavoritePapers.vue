<template>
  <div class="file-manager">
    <div class="file-manager-actions">
      <el-button type="primary" @click="openSelectedItem" :disabled="!selectedFolder">打开</el-button>
      <el-button type="warning" @click="renameSelectedFolder" :disabled="!selectedFolder">重命名</el-button>
      <el-button type="danger" @click="deleteSelectedFolder" :disabled="!selectedFolder">删除</el-button>
      <el-button @click="navigateBack" :disabled="folderHistory.length === 0">返回</el-button>
    </div>
    <h4>总数：{{ currentFolder.children.length }}，单击选中，双击即可打开</h4>
    <div class="folder-list">
      <!-- 遍历当前文件夹的子项，显示文件夹和文献 -->
      <el-card
        v-for="item in currentFolder.children"
        :key="item.fid"
        :class="{
          'selected': isItemSelected(item),
          'active': isItemActive(item),
          'folder-selected': item.isFolder && isItemSelected(item),
          'document-selected': !item.isFolder && isItemSelected(item)
        }"
        @click="selectItem(item)"
        @dblclick="openItem(item)"
        shadow="hover"
        style="width: 160px; height: 120px; margin: 10px; cursor: pointer;">
        <div class="folder-card-content" style="display: flex; justify-content: flex-start; align-items: center;">
          <el-icon :class="item.isFolder ? 'folder-icon' : 'document-icon'" :size="40" style="flex-shrink: 0; margin-right: 10px;">
            <template v-if="item.isFolder">
              <Folder />
            </template>
            <template v-else>
              <Document />
            </template>
          </el-icon>

          <!-- 判断文本长度，短文本不显示弹窗 -->
          <el-tooltip
            v-if="getTextAlign(item) === 'left'"
            class="item-tooltip"
            effect="dark"
            :content="item.isFolder ? item.favName : item.title"
            placement="bottom">
            <div class="folder-name" :style="{ textAlign: getTextAlign(item) }">
              {{ item.isFolder ? item.favName : item.title }}
            </div>
          </el-tooltip>

          <div v-else class="folder-name" :style="{ textAlign: getTextAlign(item) }">
            {{ item.isFolder ? item.favName : item.title }}
          </div>
        </div>
      </el-card>



      <!-- 新建文件夹按钮 -->
      <el-card v-if="isRootFolder" class="add-folder-card" @click="showCreateFolderDialog" shadow="hover"
        style="width: 140px; height: 120px; margin: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
        <el-icon class="add-folder-icon" :size="40">
          <Plus />
        </el-icon>
      </el-card>
    </div>

    <!-- 创建文件夹的对话框 -->
    <el-dialog title="新建文件夹" v-model="createFolderDialogVisible" width="30%">
      <el-input v-model="newFolderName" placeholder="请输入文件夹名称" @focus="clearInput"></el-input>
      <template #footer>
        <el-button @click="createFolderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createFolder">确认</el-button>
      </template>
    </el-dialog>

    <!-- 重命名文件夹的对话框 -->
    <el-dialog title="重命名" v-model="renameDialogVisible" width="30%">
      <el-input v-model="newItemName" placeholder="请输入新的名称"></el-input>
      <template #footer>
        <el-button @click="renameDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRename">确认</el-button>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog title="删除" v-model="deleteDialogVisible" width="30%">
      <span>确定要删除这个{{ selectedFolder?.pidList.length > 0 ? '文献' : '文件夹' }}吗？</span>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmDelete">删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>



<script>
import { ElIcon, ElMessage } from 'element-plus';
import { Folder, Plus, Document } from '@element-plus/icons-vue'; // 使用 Folder, Document 和 Plus 图标
import { mapGetters } from 'vuex'; // 从 Vuex 获取 token

export default {
  components: {
    ElIcon,
    Folder,
    Plus,
    Document
  },
  data() {
    return {
      // 根文件夹
      rootFolder: {
        fid: 0,
        favName: '根文件夹',
        pidList: [],
        num: 0,
        children: []  // 当前文件夹中的子文件夹
      },
      // 当前浏览的文件夹
      currentFolder: {},
      // 当前选择的项
      selectedFolder: null,
      // 当前激活的项
      activeFolder: null,
      // 当前激活的文章
      selectedPaper: null,
      // 文件夹历史路径，用于记录访问过的文件夹
      folderHistory: [],
      // 对话框状态
      createFolderDialogVisible: false,
      renameDialogVisible: false,
      deleteDialogVisible: false,
      // 新项名称
      newFolderName: '新建文件夹',
      newItemName: '',
    };
  },
  created() {
    this.currentFolder = this.rootFolder; // 设置初始当前文件夹为根文件夹
    this.fetchUserFolders(); // 获取用户的收藏夹
  },
  computed: {
    ...mapGetters(['getToken']), // 从 Vuex 获取 token
    // 判断当前文件夹是否为根文件夹
    isRootFolder() {
      return this.currentFolder.fid === this.rootFolder.fid;
    }
  },
  methods: {
    // 判断文本长度并返回对应的对齐方式
    getTextAlign(item) {
      const maxLength = 20;  // 设定短文本的最大字符长度，超出则视为长文本
      // 安全访问 item.title 或 item.favName，防止 undefined 或 null
      const text = (item.isFolder ? item.favName : item.title) || '';

      return text.length <= maxLength ? 'center' : 'left';
    },

    // 获取用户的所有收藏夹
    async fetchUserFolders() {
      const token = this.$store.state.token;

      if (!token) {
        ElMessage.error('用户未登录，无法获取收藏夹');
        return;
      }

      try {
        // 获取所有收藏夹
        const response = await this.$api.get('/user/fav/searchAll', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log(response);
        // 检查接口返回的数据结构
        if (response && response.data && response.data.code === 200) {
          // 清空当前文件夹的子文件夹（文献）
          this.currentFolder.children = [];

          // 遍历每个收藏夹
          for (const fav of response.data.data) {
            // 创建文件夹对象
            const folder = {
              fid: fav.fid,
              favName: fav.favName,
              pidList: fav.pidList,
              num: fav.num,
              isFolder: true,  // 标记为文件夹
              children: []  // 子文件夹文献的占位
            };
            // 如果文件夹中有文献，加载这些文献
            if (fav.pidList.length > 0) {
                for (const pid of fav.pidList) {
                  const res = await this.$api.get('/document/get/id', {
                    params: {pid: pid}
                  });
                  const paper = res.data.data;
                  if(paper) {
                    folder.children.push({
                      pid: paper.pid,
                      title: paper.title,
                    })
                  }
                }
                console.log('folder.children', folder.children);
                  // 遍历返回的文献列表，并将其添加到文件夹的 children 中
                  // const papers = papersResponse.data.data;
                  // console.log(papers);

                  // folder.children = papers.map(paper => ({
                  //   pid: paper.pid,
                  //   title: paper.title,
                  //   authors: JSON.parse(paper.auths),  // 转换作者字段为对象
                  //   keywords: JSON.parse(paper.keywords),  // 转换关键词字段为数组
                  //   refTimes: paper.ref_times,
                  //   favTimes: paper.fav_times,
                  //   contentUrl: paper.content_url,
                  //   category: JSON.parse(paper.category),  // 转换分类字段为对象
                  //   type: paper.type,
                  //   publishDate: paper.publish_date,
                  //   isFolder: false,  // 标记为文献
                  // }));
            }
            // 将文件夹及其文献添加到当前文件夹
            this.currentFolder.children.push(folder);
          }
        }
      } catch (error) {
        ElMessage.error('获取收藏夹失败，请稍后重试');
        console.error(error);
      }
    },

    // 显示新建文件夹对话框
    showCreateFolderDialog() {
      this.createFolderDialogVisible = true;
      this.newFolderName = '新建文件夹'; // 设置默认名称
    },
    clearInput() {
      this.newFolderName = ''; // 点击输入框时清空默认内容
    },

    // 新建文件夹
    // 文件夹创建成功后，重新获取当前文件夹信息
    async createFolder() {
      const token = this.getToken;  // 获取 Vuex 中的 token

      if (!token) {
        ElMessage.error('用户未登录，无法创建文件夹');
        return;
      }

      const formData = new FormData();
      formData.append('favName', this.newFolderName);  // 将文件夹名称作为 favName 参数

      try {
        const response = await this.$api.post('/user/fav/createFav', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data) {
          const newFolder = {
            fid: response.data,  // 使用返回的 fid 来构建新文件夹
            favName: this.newFolderName,  // 使用用户输入的文件夹名称
            pidList: [],  // 新建的文件夹默认没有文献
            num: 0,  // 新建文件夹时没有文献，num 设为 0
          };

          // 将新建的文件夹添加到当前文件夹的子项中
          this.currentFolder.children.push(newFolder);
          this.createFolderDialogVisible = false;  // 关闭对话框
          ElMessage.success('文件夹创建成功');  // 成功提示

          // 重新加载当前文件夹，以确保与后端数据一致
          await this.fetchUserFolders();
        } else {
          throw new Error('返回数据格式错误');
        }
      } catch (error) {
        console.error('新建文件夹失败:', error.response || error);
        const errorMessage = error.response?.data?.message || '创建文件夹失败，请稍后重试';
        ElMessage.error(errorMessage);  // 使用 Element UI 错误提示
      }
    },


    // 单击项选中
    selectItem(item) {
      if (item.isFolder) {
        this.selectedFolder = item;  // 选择文件夹
        this.selectedPaper = null;   // 如果选择了文件夹，清空选中的文献
      } else {
        this.selectedFolder = null;  // 如果选择了文献，清空选中的文件夹
        this.selectedPaper = item;   // 选择文献
      }
      this.activeFolder = item;  // 设置激活的项
    },

    // 判断项是否被选中
    isItemSelected(item) {
      if (item.isFolder) {
        return this.selectedFolder && this.selectedFolder.fid === item.fid;
      } else {
        return this.selectedPaper && this.selectedPaper.pid === item.pid;
      }
    },

    // 判断项是否是当前激活的
    isItemActive(item) {
      return this.activeFolder && (this.activeFolder.fid === item.fid || this.activeFolder.pid === item.pid);
    },

    // 双击打开项
    openItem(item) {
      if (item.isFolder) {
        // 如果是文件夹，进入文件夹
        const folder = this.currentFolder.children.find(f => f.fid === item.fid);
        if (folder) {
          this.folderHistory.push(this.currentFolder);  // 保存当前文件夹路径
          this.currentFolder = folder;  // 更新为选中的子文件夹
          this.selectedFolder = null;  // 重置选中的项
        }
      } else {
        // 如果是文献，执行其他操作（如跳转到文献详情页面）
        // 这里你可以跳转到新的页面或者执行其他操作
        this.$router.push(`/article/${item.pid}`);
      }
    },

    // 打开选中的项
    openSelectedItem() {
      if (this.selectedFolder) {
        this.openItem(this.selectedFolder);
      }
    },

    // 显示重命名对话框
    renameSelectedFolder() {
      if (this.selectedFolder) {
        this.newItemName = this.selectedFolder.favName;
        this.renameDialogVisible = true;
      }
    },

    // 确认重命名
    async confirmRename() {
      const token = this.getToken;

      if (!token) {
        ElMessage.error('用户未登录，无法重命名文件夹');
        return;
      }

      const formData = new FormData();
      formData.append('fid', this.selectedFolder.fid);  // 收藏夹 ID
      console.log(this.selectedFolder.fid);
      formData.append('name', this.newItemName);  // 新名称

      try {
        const response = await this.$api.post('/user/fav/changeName', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data && response.data.code === 200) {
          // 更新当前选择的文件夹名称
          this.selectedFolder.favName = this.newItemName;
          this.renameDialogVisible = false;
          ElMessage.success('文件夹重命名成功');
        } else {
          throw new Error('重命名失败');
        }
      } catch (error) {
        console.error('重命名文件夹失败:', error);
        ElMessage.error('重命名文件夹失败，请稍后重试');
      }
    },

    // 显示删除确认对话框
    deleteSelectedFolder() {
      if (this.selectedFolder) {
        this.deleteDialogVisible = true;
      }
    },

    // 确认删除文件夹或文献
    async confirmDelete() {
      const token = this.getToken;

      if (!token) {
        ElMessage.error('用户未登录，无法删除文件夹');
        return;
      }

      const formData = new FormData();
      formData.append('fid', this.selectedFolder.fid);

      try {
        const response = await this.$api.post('/user/fav/deleteFav', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data && response.data.code === 200) {
          const index = this.currentFolder.children.indexOf(this.selectedFolder);
          if (index !== -1) {
            this.currentFolder.children.splice(index, 1);  // 删除文件夹
            this.selectedFolder = null;
            this.deleteDialogVisible = false;
            ElMessage.success('文件夹删除成功');
          }
        } else {
          throw new Error('删除文件夹失败');
        }
      } catch (error) {
        console.error('删除文件夹失败:', error);
        ElMessage.error('删除文件夹失败，请稍后重试');
      }
    },

    // 返回到上一级文件夹
    navigateBack() {
      if (this.folderHistory.length > 0) {
        this.currentFolder = this.folderHistory.pop();
        this.selectedFolder = null;
      }
    },
  },
};
</script>


<style scoped>
.file-manager {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.file-manager-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.folder-name {
  margin-top: 10px;
  text-align: center; /* 使文本居中 */
  overflow: hidden; /* 防止溢出 */
  white-space: nowrap; /* 禁止换行 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  width: 100%; /* 使文本宽度占满容器 */
  display: inline-block; /* 使文本内联显示 */
  padding-right: 10px; /* 右侧留空间，避免溢出 */
}

.folder-card-content {
  display: flex;
  justify-content: center; /* 居中 */
  align-items: center;
  width: 100%; /* 确保内容自适应 */
  flex-wrap: wrap; /* 防止内容溢出 */
}

.folder-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; /* 左对齐布局 */
  gap: 10px; /* 添加间距 */
}

.folder-card-content {
  display: flex;
  justify-content: center; /* 确保内容水平居中 */
  align-items: center;     /* 确保内容垂直居中 */
  width: 100%;             /* 确保内容宽度自适应 */
  text-align: center;      /* 确保名称也居中显示 */
  flex-direction: column;  /* 垂直排列图标和名称 */
}

.folder-name {
  margin-top: 10px;
  text-align: left; /* 确保文本从左侧开始显示 */
  overflow: hidden; /* 防止溢出 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /* 防止换行 */
  width: 100%; /* 使文本宽度占满容器 */
  display: inline-block; /* 使文本内联显示 */
  padding-right: 10px; /* 右侧留空间，避免溢出 */
}


.folder-name:empty {
  justify-content: center; /* 当没有内容时，确保空内容也居中 */
}

/* 新增的选中项的边框效果 */
.folder-selected {
  border: 2px solid #409eff;  /* 给选中的文件夹加一个蓝色边框 */
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.5);  /* 可以加一个模糊的阴影效果 */
}

/* 为选中文献添加选中样式 */
.document-selected {
  border: 2px solid #409eff;  /* 给选中的文献加一个蓝色边框 */
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.5);  /* 可以加一个模糊的阴影效果 */
}

.selected {
  /* 你之前已有的选中样式 */
  background-color: #f0f9ff;  /* 可以加一个背景色来增强效果 */
}
</style>

