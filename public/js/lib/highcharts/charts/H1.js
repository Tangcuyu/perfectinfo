$(function () { 
    $('#wdchart').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: '工单统计'
        },
        xAxis: {
            categories: ['一月', '二月', '三月','四月','五月']
        },
        yAxis: {
            title: {
                text: '支持次数'
            }
        },
        series: [{
            name: '罗斯洛克',
            data: [1, 0, 4, 6, 9]
        }, {
            name: '同昌盛业',
            data: [5, 7, 3, 3, 10]
        }]
    });
	$('#wdchart2').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: '工单统计'
        },
        xAxis: {
            categories: ['一月', '二月', '三月','四月','五月']
        },
        yAxis: {
            title: {
                text: '支持次数'
            }
        },
        series: [{
            name: '罗斯洛克',
            data: [1, 0, 4, 6, 9]
        }, {
            name: '同昌盛业',
            data: [5, 7, 3, 3, 10]
        }]
    });
});