<template>
    <div>
        <head-top></head-top>
        <!--		<section class="data_section">-->
        <!--			<header class="section_title">数据统计</header>-->
        <!--			<el-row :gutter="20" style="margin-bottom: 10px;">-->
        <!--                <el-col :span="4"><div class="data_list today_head"><span class="data_num head">当日数据：</span></div></el-col>-->
        <!--				<el-col :span="4"><div class="data_list"><span class="data_num">{{userCount}}</span> 新增用户</div></el-col>-->
        <!--				<el-col :span="4"><div class="data_list"><span class="data_num">{{orderCount}}</span> 新增订单</div></el-col>-->
        <!--                <el-col :span="4"><div class="data_list"><span class="data_num">{{adminCount}}</span> 新增管理员</div></el-col>-->
        <!--			</el-row>-->
        <!--            <el-row :gutter="20">-->
        <!--                <el-col :span="4"><div class="data_list all_head"><span class="data_num head">总数据：</span></div></el-col>-->
        <!--                <el-col :span="4"><div class="data_list"><span class="data_num">{{allUserCount}}</span> 注册用户</div></el-col>-->
        <!--                <el-col :span="4"><div class="data_list"><span class="data_num">{{allOrderCount}}</span> 订单</div></el-col>-->
        <!--                <el-col :span="4"><div class="data_list"><span class="data_num">{{allAdminCount}}</span> 管理员</div></el-col>-->
        <!--            </el-row>-->
        <!--		</section>-->
        <p class="explain_text">Welcome</p>
        <renewReportCharts :renewData='renewData' :renewClass='renewClass'></renewReportCharts>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import renewReportCharts from "./myResult/renewReportCharts";
    import dtime from 'time-formater'
    import {userCount, orderCount, getUserCount, getOrderCount, adminDayCount, adminCount} from '@/api/getData'
    import {qryRenewYearList,getRenewData} from '@/api/api'

    export default {
        data() {
            return {
                userCount: null,
                orderCount: null,
                adminCount: null,
                allUserCount: null,
                allOrderCount: null,
                allAdminCount: null,
                renewClass: [],
                renewData: [],
            }
        },
        components: {
            headTop,
            renewReportCharts,
        },
        mounted() {
            this.initData();
            this.getRenewClass();
            this.getRenewData();
        },
        computed: {},
        methods: {
            async initData() {
                const today = dtime().format('YYYY-MM-DD')
            },
            async getRenewData() {
                // this.renewData = [[100,222,333], [200,400,500], [150,888,999],[250,123,333],[500,400,300]];
                const result = await getRenewData();
                if (result.code == "0000") {
                    console.log(result.data)
                    this.renewData = result.data;
                } else {
                    console.error("获取数据失败")
                }
            },
            async getRenewClass() {
                var that = this;
                const result = await qryRenewYearList();
                if (result.code == "0000") {
                    console.log(result.data)
                    result.data.forEach(function (item) {
                        that.renewClass.push(item.name)
                    })
                } else {
                    console.error("获取数据失败")
                }
            },
        }
    }
</script>

<style lang="less">
    @import '../style/mixin';

    .data_section {
        padding: 20px;
        margin-bottom: 40px;

        .section_title {
            text-align: center;
            font-size: 30px;
            margin-bottom: 10px;
        }

        .data_list {
            text-align: center;
            font-size: 14px;
            color: #666;
            border-radius: 6px;
            background: #E5E9F2;

            .data_num {
                color: #333;
                font-size: 26px;

            }

            .head {
                border-radius: 6px;
                font-size: 22px;
                padding: 4px 0;
                color: #fff;
                display: inline-block;
            }
        }

        .today_head {
            background: #FF9800;
        }

        .all_head {
            background: #20A0FF;
        }
    }

    .wan {
        .sc(16px, #333)
    }

    .explain_text {
        margin-top: 20px;
        text-align: center;
        font-size: 20px;
        color: #333;
    }
</style>
