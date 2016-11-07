var chart = c3.generate({
	data: {
        columns: [
            ['噪音', 50, 90, 60, 86, 70, 110, 80, 70, 90]
        ],
        selection: {
            enabled: true
        }
    }
});

var defaultMessage = $('#message').html(), currentIndex = 0, timer, duration = 2000, demos = [
    function () {
        chart.load({
            columns: [['温度', 24, 30, 28, 30, 33, 29, 30, 25, 33]]
        })
        setMessage('加载温度数据');
    },
    function () {
        chart.load({
            columns: [['湿度', 70, 90, 170, 120, 100, 110, 130, 40, 50]]
        })
        setMessage('加载湿度数据');
    },
    function () {
        chart.select(['噪音'], [2]);
        setMessage('突出显示第二个关键点的噪音数据');
    },
    function () {
        chart.select(['噪音'], [4,6]);
        setMessage('突出显示第四个和第六个关键点的噪音数据');
    },
    function () {
        chart.unselect();
        setMessage('取消选择关键点');
    },
    function () {
        chart.focus('温度');
        setMessage('突出显示温度数据');
    },
    function () {
        chart.focus('湿度');
        setMessage('突出显示湿度数据');
    },
    function () {
        chart.revert();
        setMessage('取消突出显示');
    },
    function () {
        chart.load({
            columns: [['噪音', 300, 230, 400, 520, 230, 250, 330, 280, 250]]
        })
        setMessage('更新噪音数据');
    },
    function () {
        chart.load({
            columns: [['温度', 30, 50, 90, 120, 40, 50, 80, 70, 50]]
        })
        setMessage('更新温度数据');
    },
    function () {
        chart.regions([{start:1,end:3}]);
        setMessage('突出显示关键点1到关键点3的区域');
        },
    function () {
        chart.regions.add([{start:6}]);
        setMessage('从关键点6到结尾的区域突出显示');
    },
    function () {
        chart.regions([]);
        setMessage('取消区域的突出显示');
    },
    function () {
        chart.xgrids([{value: 1, text:'关键点1'}, {value: 4, text: '关键点4'}]);
        setMessage('为关键点1和关键点4增加X轴基线');
    },
    function () {
        chart.ygrids.add([{value: 450, text:'Y=450基线'}]);
        setMessage('为Y值450增加Y轴基线');
    },
    function () {
        chart.xgrids.remove({value: 1});
        chart.xgrids.remove({value: 4});
        setMessage('取消关键点1和关键点4的X轴基线');
    },
    function () {
        chart.ygrids.remove({value: 450});
        setMessage('取消Y值450的基线');
    },
    function () {
        chart.transform('bar');
        setMessage('显示为柱状图');
    },
    function () {
        chart.groups([['温度','湿度']]);
        setMessage('温度和湿度组合显示');
    },
    function () {
        chart.groups([['噪音', '温度', '湿度']]);
        setMessage('噪音，温度，湿度组合显示');
    },
    function () {
        chart.groups([['温度', '湿度']]);
        chart.transform('line', '噪音');
        setMessage('噪音数据显示为曲线');
    },
    function () {
        chart.unload({
            ids: '湿度'
        });
        setMessage('去除湿度数据');
    },
    function () {
        chart.unload({
            ids: '温度'
        });
        setMessage('去除温度数据');
    },
    function () {
        chart.flow({
            columns: [
                ['噪音', 120, 80, 90, 100]
            ],
            duration: 1000,
        });
        setMessage('4个关键点的流数据');
    },
    function () {
        // wait for end of transition for flow
    },
    function () {
        chart.flow({
            columns: [
                ['噪音', 86, 103]
            ],
        });
        setMessage('两个关键点的流数据');
    },
    function () {
        // wait for end of transition for flow
    },
    function () {
        chart.transform('line', ['噪音', '温度', '湿度']);
        chart.groups([['噪音'], ['温度'], ['湿度']]);
        chart.load({
            columns: [['噪音', 30, 200, 100, 400, 150, 250, 50, 100, 250]]
        })
        setMessage('点击停止演示');
    }
];

function setMessage(message) {
    document.getElementById('message').innerHTML = '<a id="demoMessage" class="button secondary" onclick="stopDemo();" title="Stop Demo" onclick="stopDemo();">'+message+'</button>';
//        $('#demoMessage').tooltip('toggle');
}

function startDemo() {
    setMessage('开始演示......初始显示噪音数据');
    timer = setInterval(function(){
        if (currentIndex == demos.length) currentIndex = 0;
        demos[currentIndex++]();
    }, duration);
}

function stopDemo() {
    clearInterval(timer);
    document.getElementById('message').innerHTML = defaultMessage;
}
;
