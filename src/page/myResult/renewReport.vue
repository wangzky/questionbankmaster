<template>
    <div>
        <head-top></head-top>
        <div class="aDiv">
            <div class="resultDiv">
                <el-table
                    :data="resultData"
                    border
                    style="width: 100%">
                    <el-table-column
                        v-for="(item, index) in tableColumns"
                        :prop="item.prop"
                        :label="item.label"
                        :key="item.id"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                </el-table>
            </div>

            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="科目" prop="type">

                    <el-checkbox-group v-model="form.type">
                        <el-checkbox v-for="subject in subjects" checked :label="subject.value" :key="subject.value">
                            {{subject.label}}
                        </el-checkbox>
                    </el-checkbox-group>

                </el-form-item>
                <!---->
                <el-form-item
                    v-for="(domain, index) in form.domains"
                    :label="'条件 ' + (index+1)"
                    :key="domain.key"
                    :prop="'domains.' + index + '.value'"
                >
                    <el-col :span="11">
                        <el-form-item>
                            <el-select v-model="domain.year" placeholder="选择续班批次">
                                <el-option
                                    v-for="item in RenewYearList"
                                    :key="item.val"
                                    :label="item.name"
                                    :value="item.val">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item>
                            <el-select v-model="domain.state" placeholder="是否续班">
                                <el-option label="不限制" value="9999"></el-option>
                                <el-option label="续班" value="1"></el-option>
                                <el-option label="未续班" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <a class="remove-item" v-show="form.domains.length>1" @click.prevent="removeDomain(domain)"><i
                            class="el-icon-close"></i></a>
                    </el-col>
                </el-form-item>
                <el-form-item class="submit-btn">
                    <el-button @click="addDomain">新增条件</el-button>
                    <el-button type="primary" @click="submitForm('form')">查询</el-button>
                    <!--                <el-button @click="resetForm('form')">重置</el-button>-->
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {importCommit, qryRenewYearList, renewReport} from '@/api/api'
    import headTop from '../../components/headTop'

    const subjectOptions = [
        {"label": "语文", "value": "chinese"},
        {"label": "数学", "value": "math"},
        {"label": "英语", "value": "english"},
        {"label": "物理", "value": "physics"},
        {"label": "化学", "value": "chemistry"},
    ];
    export default {
        name: "renewReport",
        data() {
            return {
                form: {
                    type: [],
                    domains: [{
                        state: '',
                        year: '',
                    }],
                },
                RenewYearList: [],
                rules: {
                    type: [
                        {type: 'array', required: true, message: '请至少选择一个科目', trigger: 'change'}
                    ],
                },
                renewReportParam: {
                    type: '',
                    terms: []
                },
                tableColumns: [
                    {id: "id1", prop: "chinese", label: "语文"},
                    {id: "id2", prop: "math", label: "数学"},
                    {id: "id3", prop: "english", label: "英语"},
                    {id: "id4", prop: "physics", label: "物理"},
                    {id: "id5", prop: "chemistry", label: "化学"},
                ],
                resultData: [
                    {
                        "chinese": 0,
                        "math": 0,
                        "english": 0,
                        "physics": 0,
                        "chemistry": 0
                    }
                ],

                checkAll: false,
                checkedsubjects: [],
                subjects: subjectOptions,
                isIndeterminate: true
            }
        },
        components: {
            headTop,
        },
        created() {
            this.initData();
        },
        methods: {
            async initData() {
                const result = await qryRenewYearList();
                if (result.code == "0000") {
                    this.RenewYearList = result.data;
                } else {
                    console.error("获取数据失败")
                }
            },
            onSubmit() {
                console.log('submit!');
            },

            /*------------------------------------------------------------------*/
            /*增加表单项*/
            addDomain() {
                this.form.domains.push({
                    state: '',
                    year: '',
                });
            },
            /*删除表单项*/
            removeDomain(item) {
                var index = this.form.domains.indexOf(item)
                if (index !== -1) {
                    this.form.domains.splice(index, 1)
                }
            },
            /*格式化表单数据*/
            formatData(data) {   //动态表单生成的是一个对象数组，需要把对象数组转成一个对象
                let arr = new Array()
                let obj = {};
                data.forEach((item, index) => {
                    // obj['value' + (index + 1)] = item.value
                    arr.push(item)
                });
                return arr
            },
            /*提交表单*/
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.formatData(this.form.domains)[0])

                        // 提交查询
                        this.renewReportParam.type = this.form.type.join(",")
                        this.renewReportParam.terms = this.form.domains
                        console.log(this.renewReportParam)
                        this.commitQry()
                    } else {
                        return false;
                    }
                });
            },

            async commitQry() {
                const result = await renewReport(this.renewReportParam);
                if (result.code == "0000") {
                    var data = result.data;
                    this.resultData = data
                    console.log(data)
                } else {
                    this.$message(result.msg);
                    console.error("获取数据失败" + result.msg)
                }
            },
            /*重置表单*/
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            /*------------------------------------------------------------------*/
        }
    }
</script>

<style lang="less">
    @import '../../style/mixin';

    .aDiv {
        margin: 20px;
        width: 60%;
    }

    .a input {
        width: 180px;
    }

    .resultDiv {
        margin-top: 30px;
    }
</style>
