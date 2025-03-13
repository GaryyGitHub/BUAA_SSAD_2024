<template>
    <NavBar></NavBar>
    <div class="upload-page">
        <!-- 上传PDF区域 -->
        <div class="upload-area">
            <el-upload
                action="#"
                drag
                :http-request="handleUpload"
                :file-list="fileList"
                :on-remove="handleRemove"
                :limit="1"
                :before-upload="beforeUpload"
                class="upload-dragger"
            >

                <div class="el-upload__text">拖拽文件到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip">仅支持PDF文件，大小不超过5MB</div>
            </el-upload>
        </div>

        <!-- 表单区域 -->
        <el-card class="form-card">
            <el-form ref="articleForm" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="摘要" prop="essAbs">
                    <el-input
                        type="textarea"
                        v-model="form.essAbs"
                        placeholder="请输入摘要"
                        rows="5"
                    ></el-input>
                </el-form-item>
                <el-form-item label="关键词" prop="keywords">
                    <div v-for="(keyword, index) in form.keywords" :key="index" class="dynamic-input">
                        <el-input
                            v-model="form.keywords[index]"
                            placeholder="请输入关键词"
                            :maxlength="30"
                        ></el-input>
                        <el-button
                            v-if="form.keywords.length > 1"
                            type="danger"
                            @click="removeKeyword(index)"
                            plain
                        >-</el-button>
                        <el-button
                            v-if="form.keywords.length < 3 && index === form.keywords.length - 1"
                            type="primary"
                            @click="addKeyword"
                            plain
                        >
                            +
                        </el-button>
                    </div>

                </el-form-item>
                <el-form-item label="作者" prop="auths">
                    <div v-for="(author, index) in form.auths" :key="index" class="dynamic-input">
                        <el-input
                            v-model="form.auths[index]"
                            placeholder="请输入作者姓名"
                            :maxlength="30"
                        ></el-input>
                        <el-button
                            v-if="form.auths.length > 1"
                            type="danger"
                            @click="removeAuthor(index)"
                            plain
                        >-</el-button>
                        <el-button
                            v-if="form.auths.length < 3 && index === form.auths.length - 1"
                            type="primary"
                            @click="addAuthor"
                            plain
                        >
                            +
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item label="领域" prop="field">
                    <el-input v-model="form.field" placeholder="请输入领域"></el-input>
                </el-form-item>
                <el-form-item label="主题" prop="theme">
                    <el-input v-model="form.theme" placeholder="请输入主题"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-input v-model="form.type" placeholder="请输入类型"></el-input>
                </el-form-item>
                <el-form-item label="发表时间" prop="publishDate">
                    <el-date-picker v-model="form.publishDate" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="文章来源" prop="derivation">
                    <el-input v-model="form.derivation" placeholder="请输入文章来源"></el-input>
                </el-form-item>

                <!-- 提交按钮 -->
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">提交</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import {ElMessage} from "element-plus";
export default {
    components: {
      NavBar
    },
    data() {
        return {
            form: {
                title: '',
                essAbs: '',
                keywords: [''],
                auths: [''],
                field: '',
                type: '',
                theme: '',
                publishDate: '',
                derivation: '',
                refs: [1, 2]
            },
            fileList: [],
            rules: {
                title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
                essAbs: [{ required: true, message: '请输入摘要', trigger: 'blur' }],
                keywords: [
                    { required: true, type: 'array', max: 3, message: '最多可输入3个关键词', trigger: 'change' },
                ],
                auths: [
                    { required: true, type: 'array', max: 3, message: '最多可输入3个作者', trigger: 'change' },
                ],
                field: [{ required: true, message: '请输入领域', trigger: 'blur' }],
                theme: [{ required: true, message: '请输入主题', trigger: 'blur' }],
                type: [{ required: true, message: '请输入类型', trigger: 'blur' }],
                publishDate: [
                    { required: true, message: '请选择发表时间', trigger: 'change' },
                ],
                derivation: [{ required: true, message: '请输入文章来源', trigger: 'blur' }],
            },
        };
    },
    methods: {
        async handleSubmit() {
            //console.log(this.fileList);
            const valid = await new Promise((resolve) => {
                this.$refs.articleForm.validate((valid) => resolve(valid));
            });
                if (valid) {
                    const file = this.fileList[0];
                    const formData = new FormData();
                    formData.append("content", file);
                    /*const queryParams = new URLSearchParams();
                    Object.entries(formData).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            value.forEach((item) => queryParams.append(key, item));
                        } else {
                            queryParams.append(key, value);
                        }
                    });*/

                    for (const key in this.form) {
                        if (Object.prototype.hasOwnProperty.call(this.form, key)) {
                            const value = this.form[key];
                            if (Array.isArray(value)) {
                                //formData.append(key, JSON.stringify(value));
                                value.forEach(item => formData.append(key, item));
                            } else {
                                if (key === 'publishDate') {
                                    const date = new Date(value);
                                    formData.append(key, date.toISOString().slice(0, 19))
                                } else {
                                    formData.append(key, value);
                                }
                                // 如果是普通字段，直接追加

                            }
                        }
                    }

                    formData.append("uid", this.$store.state.uid);

                    for (var [a, b] of formData.entries()) {
                        console.log(a, b);
                    }

                    try {
                        const response = await this.$api.post(`/document/upload`, formData, {
                            headers: {
                                //'Authorization': `Bearer ${this.$store.state.token}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                        console.log("111111" + response);
                        const res = response.data;
                        if (res.code === 200) {
                            ElMessage.success('上传成功');
                        } else {
                            ElMessage.error('上传失败');
                        }
                    } catch (error) {
                        console.error('上传失败: ', error);
                    }

                } else {
                    console.error('验证失败');
                }
        },
        handleUpload({file}) {
            this.fileList=[file];
        },
        handleReset() {
            this.$refs.articleForm.resetFields();
            this.fileList = [];
        },
        handleRemove(file, fileList) {
            console.log('移除文件', file);
            this.fileList = fileList;
        },
        beforeUpload(file) {
            const isPDF = file.type === 'application/pdf';
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isPDF) {
                this.$message.error('仅支持PDF文件');
            }
            if (!isLt5M) {
                this.$message.error('文件大小不能超过5MB');
            }
            return isPDF && isLt5M;
        },
        addKeyword() {
            if (this.form.keywords.length < 3) {
                this.form.keywords.push('');
            }
        },
        removeKeyword(index) {
            if (this.form.keywords.length > 1) {
                this.form.keywords.splice(index, 1);
            }
        },
        addAuthor() {
            if (this.form.auths.length < 3) {
                this.form.auths.push('');
            }
        },
        removeAuthor(index) {
            if (this.form.auths.length > 1) {
                this.form.auths.splice(index, 1);
            }
        },
    },
};
</script>

<style>
.upload-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}
.upload-area {
    width: 50%;
    margin: 20px 0;
}
.upload-dragger {
    border: 2px dashed #d9d9d9;
    border-radius: 4px;
    padding: 40px;
    text-align: center;
}
.form-card {
    width: 60%;
}
.dynamic-input {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

:deep(.el-form-item__label) {
    justify-content: center;
}
</style>
