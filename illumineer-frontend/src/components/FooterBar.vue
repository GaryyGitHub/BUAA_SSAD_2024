<template>
    <el-footer class="footer">
        <div class="footer-container">
            <!-- Top Section -->
            <div class="footer-top">
                <div class="footer-section">
                    <h3>读者服务</h3>
                    <ul>
                        <li><a href="#">订阅</a></li>
                        <li><a href="#">增值服务</a></li>
                        <li><a href="#">帮助中心</a></li>
                        <li><a href="#">我的Illumineer</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>学术软件下载</h3>
                    <ul>
                        <li><a href="#">CAJViewer浏览器</a></li>
                        <li><a href="#">知网研学（E-Study）</a></li>
                        <li><a href="#">下载中心</a></li>
                        <li><a href="#">标准阅读器</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>特色服务</h3>
                    <ul>
                        <li><a href="#">掌上平台</a></li>
                        <li><a href="#">平台人才</a></li>
                        <li><a href="#">文库信息</a></li>
                        <li><a href="#">文献阅读</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>客户服务</h3>
                    <ul>
                        <li>订卡热线: 400-000-0000</li>
                        <li>服务热线: 400-000-0000</li>
                        <li>在线咨询: <a href="#">judge.buaa.edu.cn</a></li>
                        <li>邮件咨询: <a href="#">help@buaa.edu.cn</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>监督举报</h3>
                    <ul>
                        <li>举报电话: 400-111-1111</li>
                        <li>举报邮箱: <a href="https://www.270towin.com/">jubao@buaa.edu.cn</a></li>
                        <li>合规举报邮箱: <a href="https://www.270towin.com/">jubao@buaa.edu.cn</a></li>
                        <li>服务监督: 400-222-2222</li>
                    </ul>
                </div>
            </div>

            <!-- Social Media Links -->
            <div class="footer-social">
                <a href="/">
                    <img src="../assets/logo.png" alt="" class="logo"/>
                </a>
            </div>

            <!-- Bottom Section -->
            <div class="footer-bottom">
                <div class="footer-info">
                    <a href="#">关于我们</a> | <a href="#">CNKI 荣誉</a> | <a href="#">客服中心</a> | <a href="#">用户建议</a>
                </div>
                <div class="footer-copyright">
                    <p>© 启研汇（Illumineer）</p>
                </div>
            </div>
        </div>
    </el-footer>
</template>

<script>
import { ElFooter } from 'element-plus';

export default {
    components: {
        ElFooter,
    },
};
</script>

<style scoped>
.footer {
    background-color: #f3f3f3;
    /* padding: 20px 40px; */
    height: 180px;
    color: #333;
    font-size: 14px;
}

.footer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.footer-top {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    padding-top: 15px;
}

.footer-section {
    flex: 1;
    margin: 0 10px;
    justify-content: flex-start;
}

.footer-section h3 {
    font-size: 16px;
    font-weight: bold;
}

.footer-section ul {
    list-style: none;
    padding: 0;
}

.footer-section ul li {
    margin: 5px 0;
}

.footer-social {
    margin-top: 20px;
    font-size: 24px;
    color: #666;
}

.footer-bottom {
    margin-top: 20px;
    text-align: center;
    color: #999;
    font-size: 12px;
}

.footer-info a {
    color: #666;
    margin: 0 5px;
}

.footer-info a:hover {
    color: #333;
    text-decoration: underline;
}

.logo {
    height: 120px; /* 你可以根据需要调整最大高度 */
    object-fit: contain;
}
</style>