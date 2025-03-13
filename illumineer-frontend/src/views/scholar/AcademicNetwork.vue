<template>
  <div ref="network" style="height: 500px;"></div>
</template>

<script>
import { Network } from 'vis-network/standalone';

export default {
  data() {
    return {
      users: [
        { userId: this.$store.state.uid, name: this.$store.state.username, relatedUserIds: [] },
        // { userId: 2, name: 'Bob', relatedUserIds: [1, 4] },
        // { userId: 3, name: 'Charlie', relatedUserIds: [1] },
        // { userId: 4, name: 'David', relatedUserIds: [2] }
      ]
    };
  },
  mounted() {
    this.createNetwork();
  },
  methods: {
    createNetwork() {
      // 创建节点
      const nodes = this.users.map(user => ({
        id: user.userId,
        label: user.name
      }));

      // 创建边
      const edges = this.users.flatMap(user =>
        user.relatedUserIds.map(relatedId => ({
          from: user.userId,
          to: relatedId
        }))
      );

      // 配置网络图
      const container = this.$refs.network;
      const data = { nodes, edges };
      const options = {
        nodes: {
          shape: 'dot',
          size: 15
        },
        edges: {
          arrows: 'to'
        }
      };

      // 渲染关系网
      new Network(container, data, options);
    }
  }
};
</script>

<style scoped>
/* 添加样式，例如调整网络图容器的高度 */
</style>