<template>
    <div class="container">
        <div
            class="section left"
            :class="{ active: activeSection === 'left', hover: hoverSection === 'left' && activeSection !== 'left' }"
            @mouseover="setHoverSection('left')"
            @mouseleave="clearHoverSection"
            @click="setActiveSection('left', 1)"
        >
            <span>{{ getContent('left') }}</span>
        </div>
        <div
            class="section middle"
            :class="{ active: activeSection === 'middle', hover: hoverSection === 'middle' && activeSection !== 'middle' }"
            @mouseover="setHoverSection('middle')"
            @mouseleave="clearHoverSection"
            @click="setActiveSection('middle', 2)"
        >
            <span>{{ getContent('middle') }}</span>
        </div>
        <div
            class="section right"
            :class="{ active: activeSection === 'right', hover: hoverSection === 'right' && activeSection !== 'right' }"
            @mouseover="setHoverSection('right')"
            @mouseleave="clearHoverSection"
            @click="setActiveSection('right', 3)"
        >
            <span>{{ getContent('right') }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "ResizableSections",
    data() {
        return {
            activeSection: "middle", // 默认中间段最长
            hoverSection: null, // 当前悬停的段
        };
    },
    methods: {
        setHoverSection(section) {
            this.hoverSection = section; // 更新悬停状态
        },
        clearHoverSection() {
            this.hoverSection = null; // 清除悬停状态
        },
        setActiveSection(section, index) {
            if (this.activeSection === section) {
                this.$emit("section-clicked", index);
            } else {
                this.activeSection = section; // 设置为激活状态
                this.$emit("update-selected", index);
            }
        },
        getContent(section) {
            if (this.activeSection === section) {
                return "Explore !"; // 选中状态显示 "Explore"
            }
            // 未选中状态显示对应内容
            switch (section) {
                case "left":
                    return "AI";
                case "middle":
                    return "Search";
                case "right":
                    return "Advanced";
            }
        },
    },
};
</script>

<style scoped>
.container {
    display: flex;
    width: 100%;
    height: 30px;
    background-color: transparent;
    border-radius: 16px;
}

.section {
    font-weight: bolder;
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: flex 0.3s ease, background-color 0.3s ease;
    //background-color: #b3c0d1;
    box-shadow: 0 0 4px ghostwhite;
}

.section.left {
    border-radius: 16px 0 0 16px;
}

.section.right {
    border-radius: 0 16px 16px 0;
}

/* 初始中间段较长 */
.middle {
    flex: 4;
}

/* 激活部分 */
.section.active {
    flex: 4;
    background-color: transparent; /* 激活颜色 */
    box-shadow: 0 0 4px #409eff;
    text-shadow: 0 0 4px #409eff;
    color: #409eff;
    font-size: 18px;
}

/* 悬停部分，且非激活 */
.section.hover {
    flex: 4; /* 悬停时变长，但不会覆盖激活状态 */
    background-color: transparent; /* 悬停颜色 */
    box-shadow: 0 0 4px #66b1ff;
    text-shadow: 0 0 4px #66b1ff;
    color: #66b1ff;
    font-size: 18px;
}

/* 非激活部分的收缩效果 */
.container .section:not(.active):not(.hover) {
    flex: 1;
}
</style>