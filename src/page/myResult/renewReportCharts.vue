<template>
    <div class="line1">
        <div id="line1" class="" style="width: 90%;height:450px;"></div>
    </div>
</template>

<script>
    import echarts from 'echarts/lib/echarts';
    // 引入柱状图
    import 'echarts/lib/chart/bar';
    import 'echarts/lib/chart/line';
    import 'echarts/lib/component/title';
    import 'echarts/lib/component/legend';
    import 'echarts/lib/component/toolbox';
    import 'echarts/lib/component/markPoint';
    import 'echarts/lib/component/tooltip';
    export default {
        mounted(){
            this.myChart = echarts.init(document.getElementById('line1'));
            this.initData();
        },
        props: ['renewData', 'renewClass'],
        methods: {
            initData(){
                const colors = ['#5793f3', '#675bba', '#d14a61', '#6cba42', '#d14a42'];
                const option = {
                    color: colors,
                    title: {
                        text: '续班数据',
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['英语', '数学', '语文' , '物理' , '化学']
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            dataView: {
                                // readOnly: false,
                                show: true
                            },
                            magicType: {type: ['bar', 'line']},
                            restore: {},
                            saveAsImage: {//保存图片
                                show: true
                            },
                        }
                    },
                    xAxis:  {
                        type: 'category',
                        boundaryGap: false,
                        data: this.renewClass
                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: '续班人数',
                            min: 0,
                            max: 2000,
                            position: 'left',
                            axisLine: {
                                lineStyle: {
                                    color: '#999'
                                }
                            },
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                        {
                            type: 'value',
                            name: '续班人数',
                            min: 0,
                            max: 2000,
                            position: 'right',
                            axisLine: {
                                lineStyle: {
                                    color: '#999'
                                }
                            },
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                    ],
                    series: [
                        {
                            name:'英语',
                            type:'line',
                            data:this.renewData[0],
                            yAxisIndex: 0,
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                        },
                        {
                            name:'数学',
                            type:'line',
                            data:this.renewData[1],
                            yAxisIndex: 1,
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                        },
                        {
                            name:'语文',
                            type:'line',
                            data:this.renewData[2],
                            yAxisIndex: 1,
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                        },
                        {
                            name:'物理',
                            type:'line',
                            data:this.renewData[3],
                            yAxisIndex: 1,
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                        },
                        {
                            name:'化学',
                            type:'line',
                            data:this.renewData[4],
                            yAxisIndex: 1,
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                        }
                    ]
                };
                this.myChart.setOption(option);
            }
        },
        watch: {
            renewData: function (){
                this.initData()
            },
            renewClass: function (){
                this.initData()
            }
        }
    }
</script>

<style lang="less">
    @import '../../style/mixin';
    .line1{
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
</style>
