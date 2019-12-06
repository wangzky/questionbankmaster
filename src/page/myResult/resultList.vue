<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="qryDiv">
            <el-form ref="qryForm" :inline="true" :model="qryForm" label-width="80px">
                <el-form-item label="学生姓名">
                    <el-input v-model="qryForm.stuName"></el-input>
                </el-form-item>
                <el-form-item label="学生学号">
                    <el-input v-model="qryForm.stuNum"></el-input>
                </el-form-item>
                <el-form-item label="课程批次">
                    <el-select v-model="qryForm.year" placeholder="续班批次" @change="changeTableHeader">
                        <el-option value="">无</el-option>
                        <el-option
                            v-for="item in RenewYearList"
                            :key="item.val"
                            :label="item.name"
                            :value="item.val">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left: 15%">
                    <el-button type="primary" @click="onSubmit">搜索</el-button>
                    <el-button>取消</el-button>
                    <el-button @click="dialogFormVisible = true">导入数据</el-button>
                </el-form-item>
            </el-form>

        </div>
        <div class="table_container">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="stu_name" label="姓名" width="180"></el-table-column>
                <el-table-column prop="stu_num" label="学号" width="180"></el-table-column>
                <el-table-column label="续班情况" align="center">
                    <el-table-column prop="english" label="英语" width="200"></el-table-column>
                    <el-table-column prop="math" label="数学" width="200"></el-table-column>
                    <el-table-column prop="chinese" label="语文" width="200"></el-table-column>
                    <el-table-column prop="physics" label="物理" width="200"></el-table-column>
                    <el-table-column prop="chemistry" label="化学" width="200"></el-table-column>
                    <el-table-column prop="yearDesc" label="续班批次" width="180"></el-table-column>
                </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="currentPage" :page-size="20" layout="total, prev, pager, next"
                               :total="count"></el-pagination>
            </div>
        </div>


        <!--导入数据div-->
        <el-dialog title="导入数据" :visible.sync="dialogFormVisible">
            <el-form ref="importForm" :rules="rules" :model="importForm" label-width="80px">
                <el-form-item label="续班批次" prop="year">
                    <el-select v-model="importForm.year" placeholder="选择续班批次">
                        <el-option
                            v-for="item in RenewYearList"
                            :key="item.val"
                            :label="item.name"
                            :value="item.val">
                        </el-option>
                    </el-select>
                    <el-button type="primary" icon="el-icon-edit" size="medium" @click="addRenewYearFormVisible = true">添加批次</el-button>
                </el-form-item>
                <el-form-item label="值说明">
                    <el-tag
                        :key="tag"
                        v-for="tag in dynamicTags"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 续班代表值</el-button>
                </el-form-item>
                <el-form-item>
                    <import-excel @getResult="getMyExcelData"></import-excel>
                    <div class="fileMsg" v-html="fileMsg"></div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="importCommitCheck('importForm')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加批次" :visible.sync="addRenewYearFormVisible">
            <el-form :inline="true" :model="addRenewYearForm">
                <el-form-item required>
                    <el-select v-model="addRenewYearForm.year" placeholder="选择年份" required>
                        <el-option value="2019">2019年</el-option>
                        <el-option value="2020">2020年</el-option>
                        <el-option value="2021">2021年</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item required>
                    <el-input required v-model="addRenewYearForm.name" placeholder="输入名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <span style="font-family: 仿宋;font-size: 15px">名称预览：{{addRenewYearFullName}}</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAddRenewYear">取 消</el-button>
                <el-button type="primary" @click="addRenewYear">确 定</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import headTop from '../../components/headTop'
    import importExcel from '../import/importExcel'
    import {importCommit, qryRenewYearList, getRenewList,addRenewYear} from '@/api/api'

    export default {
        data() {
            return {
                tableData: [],
                currentRow: null,
                offset: 0,
                limit: 20,
                count: 0,
                currentPage: 1,
                outputs: [],
                year: '续班情况',
                qryForm: {
                    stuName: '',
                    stuNum: '',
                    year: '',
                },
                importForm: {
                    year: '',
                    state1: '',
                    dataInfo: '',
                },
                dialogFormVisible: false,
                fileList: [],
                fileMsg: '',
                rules: {
                    year: [
                        {required: true, message: '选择续班批次', trigger: 'change'}
                    ],
                },
                RenewYearList: [],

                /*tag*/
                dynamicTags: ['1'],
                inputVisible: false,
                inputValue: '',

                addRenewYearForm: {
                    year: '',
                    name: '',
                },
                addRenewYearFullName: '',
                addRenewYearFormVisible: false,
            }
        },
        mounted() {
        },
        components: {
            headTop, importExcel
        },
        created() {
            this.initData();
            // this.qryRenewYear;
        },
        watch: {
            qryForm(val, oldval) {
                console.log(val.year)
            },
            'addRenewYearForm.year': function (val) {
                if (this.addRenewYearForm.year != ''){
                    this.addRenewYearFullName = this.addRenewYearForm.year + '年' +this.addRenewYearForm.name;
                }else {
                    this.addRenewYearFullName = this.addRenewYearForm.name;
                }
            },
            'addRenewYearForm.name': function (val) {
                if (this.addRenewYearForm.year != ''){
                    this.addRenewYearFullName = this.addRenewYearForm.year + '年' +this.addRenewYearForm.name;
                }else {
                    this.addRenewYearFullName = this.addRenewYearForm.name;
                }
            }
        },
        methods: {
            async initData() {
                console.log("===================")
                const result = await qryRenewYearList();
                if (result.code == "0000") {
                    this.RenewYearList = result.data;
                } else {
                    console.error("获取数据失败")
                }
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.getRenewList(val, 20)
            },
            async getRenewList(page, size) {
                try {
                    this.qryForm.page = page
                    this.qryForm.size = size

                    const res = await getRenewList(this.qryForm);
                    if (res.code == "0000") {
                        this.tableData = [];
                        this.tableData = res.data.content;
                        this.count = res.data.totalSize;
                    } else {
                        this.$message(res.msg);
                    }
                } catch (err) {
                    console.log('获取数据失败', err);
                }
            },


            /*上传*/
            getMyExcelData(data) {
                if (data.length > 0) {
                    this.fileMsg = '<span style="color:green">文件校验成功</span>'
                    this.importForm.dataInfo = '';
                    this.importForm.dataInfo = JSON.stringify(data)
                } else {
                    this.fileMsg = '<span style="color:red">文件校验失败</span>'
                }
            },
            importCommitCheck(importForm) {
                console.log("提交")
                this.$refs[importForm].validate(async (valid) => {
                    if (valid) {
                        this.importForm.state1 = this.dynamicTags.join(',')
                        const result = await importCommit(this.importForm)
                        if (result.code == "0000") {
                            this.dialogFormVisible = false
                            this.restImportDiv()
                            this.$message(result.msg);
                        }
                    } else {
                        this.$message("校验失败");
                        return false;
                    }
                });
            },
            restImportDiv() {
                this.importForm = {
                    year: '',
                    state1: '',
                    state0: '',
                    dataInfo: '',
                }
                this.fileMsg = ''
            },

            /*搜索*/
            onSubmit() {
                console.log(this.qryForm.year)
                this.getRenewList(1, 20);
            },
            changeTableHeader(ele) {
                this.getRenewList(1, 20);
                if (ele != null) {

                }
                var name = this.RenewYearList.find(item => item.val === ele)['name']
                this.year = name + "续班情况"
            },

            /*tag*/
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },

            /*=============*/
            async addRenewYear() {

                if (this.addRenewYearForm.year == ''){
                    this.$message("未选择年份");
                    return false;
                }
                if (this.addRenewYearForm.name == ''){
                    this.$message("未填写值");
                    return false;
                }

                var data = {}
                data = this.addRenewYearForm;
                data.fullName = this.addRenewYearFullName
                const res = await addRenewYear(data);
                if (res.code == "0000") {
                    this.$message(res.msg);
                    this.initData();
                    this.addRenewYearFormVisible = false
                } else {
                    this.$message(res.msg);
                }
            },
            closeAddRenewYear() {
                this.addRenewYearFormVisible = false
                this.addRenewYearForm = {
                    year: '',
                    name: '',
                }
                this.addRenewYearFullName = ''
            }
        },

    }
</script>

<style lang="less">
    @import '../../style/mixin';

    .table_container {
        padding: 20px;
    }

    .file {
        width: 75px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        background-color: green;
        position: relative;
    }

    .file input {
        width: 75px;
        height: 25px;
        opacity: 0;
        filter: alpha(opacity=0);
        position: absolute;
        left: 0;
        top: 0;
    }

    .qryDiv {
        margin-top: 15px;
        margin-left: 20px;
    }

    .qryDiv input {
        width: 180px;
    }

    .input-file {
        display: none;
    }

    .fileMsg {
        float: right;
        margin-right: 600px;
    }

    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>


