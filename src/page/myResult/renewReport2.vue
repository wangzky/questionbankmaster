<template>
    <div>
        <head-top></head-top>
        <div class="aDiv">
            <el-divider content-position="left">查询结果</el-divider>
            <div class="resultDiv">
                <div>
                    <span>查询条件：{{condition}}</span><br>
                    <span>查询结果：{{total}}</span><br>
                </div>
            </div>
            <el-divider content-position="left">查询条件</el-divider>
            <div class="paramDiv">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item
                    v-for="(domain, index) in form.domains"
                    :label="'条件 ' + (index+1)"
                    :key="domain.key"
                    :prop="'domains.' + index + '.value'"
                >
                    <el-col :span="8">
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
                    <el-col :span="8">
                        <el-form-item>
                            <el-select v-model="domain.subject" placeholder="选择科目">
                                <el-option
                                    v-for="item in subjects"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-select v-model="domain.state" placeholder="科目是否续班">
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
            <el-divider content-position="left">历史查询</el-divider>
            <el-table
                :data="histroyQryResultData"
                border
                style="width: 100%"
                max-height="250">
                <el-table-column
                    v-for="(item, index) in tableColumns"
                    :prop="item.prop"
                    :label="item.label"
                    :key="item.id"
                    :width="item.width"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="100">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">执行</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="currentPage" :page-size="10" layout="total, prev, pager, next"
                               :total="historyTotal"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {repeatRun, qryRenewYearList, qryHistoryQry ,renewReport2} from '@/api/api'
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
                    domains: [{
                        state: '',
                        year: '',
                        subject: '',
                    }],
                },
                RenewYearList: [],
                rules: {
                    type: [
                        {type: 'array', required: true, message: '请至少选择一个科目', trigger: 'change'}
                    ],
                },
                renewReportParam: {
                    terms: []
                },
                tableColumns: [
                    {id: "id", prop: "id", label: "ID",width:"100px"},
                    {id: "qryCondition", prop: "qryCondition", label: "查询条件",width:"600px"},
                    {id: "updateTime", prop: "updateTime", label: "查询时间",width:"200px"},
                    // {id: "id1", prop: "chinese", label: "语文"},
                    // {id: "id2", prop: "math", label: "数学"},
                    // {id: "id3", prop: "english", label: "英语"},
                    // {id: "id4", prop: "physics", label: "物理"},
                    // {id: "id5", prop: "chemistry", label: "化学"},
                ],
                resultData: [
                    {
                        "total":0,
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
                isIndeterminate: true,
                total: 0,
                condition: "",

                histroyQryResultData: [],
                historyTotal: 0,
                currentPage: 1,

            }
        },
        components: {
            headTop,
        },
        created() {
            this.initData();
            this.qryHistory(1 ,10);
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
            async qryHistory(page ,size) {
                var data = {}
                data.page = page;
                data.size = size;
                const result = await qryHistoryQry(data);
                if (result.code == "0000") {
                    this.histroyQryResultData = result.data.pageData;
                    this.historyTotal = result.data.count;
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
                        this.renewReportParam.terms = this.form.domains

                        this.total = 0;
                        this.condition = "";
                        console.log(this.renewReportParam)
                        this.commitQry()
                    } else {
                        return false;
                    }
                });
            },

            async commitQry() {
                const result = await renewReport2(this.renewReportParam);
                if (result.code == "0000") {
                    var data = result.data;
                    this.total = data.total;
                    this.condition = data.condition;
                    console.log(data)

                    this.qryHistory(1,10);
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
            handleCurrentChange(val) {
                this.qryHistory(val, 10)
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            async handleClick(row){
              console.log(row.id)
                var data = {}
                data.id = row.id;

                const result = await repeatRun(data);
                if (result.code == "0000") {
                    var data = result.data;
                    this.total = data.total;
                    this.condition = data.condition;

                    // this.qryHistory(1,10);
                } else {
                    this.$message(result.msg);
                    console.error("获取数据失败" + result.msg)
                }
            },
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
        margin-bottom: 30px;
    }

    .resultDiv span {
        font-family: 仿宋;
        font-size: 20px;
    }

    .paramDiv {
        min-height: 400px;
    }
</style>
