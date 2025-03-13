<template>
    <el-container style="padding: 20px;">
        <div class="title"></div>
        <el-main>
            <div style="margin-bottom: 20px;">
                <div id="activeThreadsChart" style="width: 100%; height: 400px;"></div>
            </div>
            <div style="margin-bottom: 20px;">
                <div id="usedMemoryChart" style="width: 100%; height: 400px;"></div>
            </div>
            <div>
                <div id="loadIndexChart" style="width: 100%; height: 400px;"></div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import * as echarts from 'echarts';

export default {
    data() {
        return {
            activeThreadsChart: null,
            usedMemoryChart: null,
            loadIndexChart: null,
            timeStamps: [],
            activeThreadsData: [],
            usedMemoryData: [],
            loadIndexData: [],
        };
    },
    methods: {
        async fetchData() {
            try {
                const response = await this.$api.get(`/user/system/load`);
                const { activeThreads, usedMemory, loadIndex } = response.data;
                const time = new Date().toLocaleTimeString(); // 获取当前时间

                // 更新数据
                this.timeStamps.push(time);
                this.activeThreadsData.push(activeThreads);
                this.usedMemoryData.push(usedMemory);
                this.loadIndexData.push(loadIndex);

                // 保持最多30个点
                if (this.timeStamps.length > 30) {
                    this.timeStamps.shift();
                    this.activeThreadsData.shift();
                    this.usedMemoryData.shift();
                    this.loadIndexData.shift();
                }

                // 更新图表
                this.updateCharts();
            } catch (error) {
                console.error('请求失败:', error);
            }
        },
        initCharts() {
            // 初始化三个图表
            this.activeThreadsChart = echarts.init(document.getElementById('activeThreadsChart'));
            this.usedMemoryChart = echarts.init(document.getElementById('usedMemoryChart'));
            this.loadIndexChart = echarts.init(document.getElementById('loadIndexChart'));

            // 初始化所有三个图表的配置
            this.activeThreadsChart.setOption({
                title: { text: 'Active Threads' },
                tooltip: { trigger: 'axis' },
                xAxis: { type: 'category', boundaryGap: false, data: [], name: '时间' },
                yAxis: { type: 'value', name: 'Threads' },
                series: [{ name: 'Active Threads', type: 'line', data: [] }],
            });

            this.usedMemoryChart.setOption({
                title: { text: 'Used Memory (Bytes)' },
                tooltip: { trigger: 'axis' },
                xAxis: { type: 'category', boundaryGap: false, data: [], name: '时间' },
                yAxis: { type: 'value', name: 'Memory (Bytes)' },
                series: [{ name: 'Used Memory', type: 'line', data: [] }],
            });

            this.loadIndexChart.setOption({
                title: { text: 'Load Index' },
                tooltip: { trigger: 'axis' },
                xAxis: { type: 'category', boundaryGap: false, data: [], name: '时间' },
                yAxis: { type: 'value', name: 'Load Index' },
                series: [{ name: 'Load Index', type: 'line', data: [] }],
            });
        },
        updateCharts() {
            this.activeThreadsChart.setOption({
                xAxis: { data: this.timeStamps },
                series: [{ data: this.activeThreadsData }],
            });

            this.usedMemoryChart.setOption({
                xAxis: { data: this.timeStamps },
                series: [{ data: this.usedMemoryData }],
            });

            this.loadIndexChart.setOption({
                xAxis: { data: this.timeStamps },
                series: [{ data: this.loadIndexData }],
            });
        },
    },
    mounted() {
        this.initCharts();
        this.fetchData(); // 初次加载数据
        setInterval(this.fetchData, 2000); // 每2秒请求一次数据
    },
};
</script>

<style>
:deep(.title) {
    font-weight: bold;
    font-size: 24px;
    position: absolute;
    left: 55%;
    padding-bottom: 1px;
}
</style>
