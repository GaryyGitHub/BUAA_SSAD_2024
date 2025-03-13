<template>
    <div>
        <div id="chart" ref="chart" style="width: 100%; height: 400px;"></div>
    </div>
</template>

<script>
import * as echarts from "echarts";

export default {
    name: "ProportionChart",
    data() {
        return {
            chartInstance: null,
        };
    },
    methods: {
        initChart() {
            // Initialize the chart
            this.chartInstance = echarts.init(this.$refs.chart);

            // Chart options
            const option = {
                title: {
                    text: "Proportion Trend",
                    left: "center",
                },
                tooltip: {
                    trigger: "axis",
                    formatter: "{b}: {c}%",
                },
                xAxis: {
                    type: "category",
                    data: [1, 2, 3, 4, 5, 6, 7],
                    name: "X Axis",
                    nameLocation: "middle",
                    nameGap: 30,
                },
                yAxis: {
                    type: "value",
                    min: 0,
                    max: 100,
                    axisLabel: {
                        formatter: "{value} %",
                    },
                    name: "Proportion",
                    nameLocation: "middle",
                    nameGap: 50,
                },
                series: [
                    {
                        name: "Proportion",
                        type: "line",
                        data: [50, 60, 70, 65, 55, 40, 30],
                        smooth: true,
                        lineStyle: {
                            color: "#5470C6",
                            width: 3,
                        },
                        itemStyle: {
                            color: "#EE6666",
                        },
                    },
                ],
            };

            // Render the chart
            this.chartInstance.setOption(option);

            // Resize the chart on window resize
            window.addEventListener("resize", () => {
                this.chartInstance.resize();
            });
        },
    },
    mounted() {
        this.initChart();
    },
    beforeUnmount() {
        // Dispose of the chart instance when the component is destroyed
        if (this.chartInstance) {
            this.chartInstance.dispose();
        }
    },
};
</script>

<style scoped>
#chart {
    width: 100%;
    height: 400px;
}
</style>