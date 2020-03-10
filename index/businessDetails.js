import * as echarts from '../ec-canvas/echarts';
import {data} from '../data.js'
let Chart = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShoweyes: true,
    turnoverEc: {
      lazyLoad: true,
    },
    customerEc: {
      lazyLoad: true,
    },
    priceEc: {
      lazyLoad: true,
    },
    echartsData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.echartsComponnet1 = this.selectComponent('#mychart-dom-turnover');
    this.echartsComponnet2 = this.selectComponent('#mychart-dom-customer');
    this.echartsComponnet3 = this.selectComponent('#mychart-dom-price');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 重置图表存储容器 不然会报错
    Chart = [];
    this.getData(); //获取数据
  },
  // 初始化数据
  getData: function () {
    // 金额格式化
    for (const key in data.orderPriceCountRespVo) {
      data.orderPriceCountRespVo[key] = this.filterMoney(data.orderPriceCountRespVo[key]);
    }
    for (const key in data.shopPersonInfoRespVo) {
      data.shopPersonInfoRespVo[key] = this.filterMoney(data.shopPersonInfoRespVo[key]);
    }
    this.setData({
      echartsData: data
    }, () => {
      for (let i = 1; i < 4; i++) {
        if (!Chart[i]) {
          this.initEcharts(i); //初始化图表
        } else {
          this.setOption(i); //更新数据
        }
      }
    })
  },
  //初始化图表
  initEcharts: function (i) {
    this['echartsComponnet' + i].init((canvas, width, height) => {
      // 初始化图表
      Chart[i - 1] = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption(i);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart[i - 1];
    });
  },
  setOption: function (i) {
    Chart[i - 1].clear(); // 清除
    Chart[i - 1].setOption(this['getOption' + i]()); //获取新数据
  },
  handeltosee() {
    this.setData({
      isShoweyes: !this.data.isShoweyes
    });
  },
  // 格式化Tooltip
  formatterTooltip(param) {
    return "日期：" + param[0].name + "\n" + param[0].seriesName + ": " + param[0].data
  },
  // 更改Tooltip的位置，处理边界超出的情况
  setTooltipPositionfunction(point, params, dom, rect, size) {
    console.log(params, dom)
    //其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
    // 更改提示框的显示位置
    let x = point[0];//
    let y = point[1];
    // size: 包括 dom 的尺寸和 echarts 容器的当前尺寸，例如：{contentSize: [width, height], viewSize: [width, height]}
    let boxWidth = size.contentSize[0];
    // let boxHeight = size.contentSize[1]; // size里面此处获取不到dom的高度，值为NAN，所以下面指定了一个固定值
    let boxHeight = 50;
    let posX = 0;//x坐标位置
    let posY = 0;//y坐标位置
    if (x < boxWidth) {//左边放不开
      posX = 5;
    } else {//左边放的下
      posX = x - boxWidth;
    }

    if (y < boxHeight) {//上边放不开
      posY = 5;
    } else {//上边放得下
      posY = y - boxHeight;
    }
    return [posX, posY];
  },
  getOption1() {
    let {
      echartsData
    } = this.data;
    return {
      color: ['#0179FF'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          shadowStyle: {
            opacity: 0.8
          }
        },
        formatter: this.formatterTooltip,
        position: this.setTooltipPositionfunction
      },
      grid: {
        left: 20,
        right: 20,
        bottom: 15,
        top: 40,
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#999',
          }
        },
        axisLabel: {
          color: '#666',
        },
        data: echartsData.totalRecentRansactions.dates,
      }
      ],
      yAxis: [{
        type: 'value',
        axisTick: {
          show: false
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#999',
          }
        },
        axisLabel: {
          color: '#666',
          fontSize: 13
        }
      }],
      series: [{
        name: '订单总额',
        type: 'line',
        label: {
          normal: {
            show: true,// 是否在折线点上显示数值
            position: 'inside'
          }
        },
        data: echartsData.totalRecentRansactions.allTotalMoney
      }]
    };
  },
  getOption2() {
    let {
      echartsData
    } = this.data;
    return {
      color: ['#6EB3FF'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          shadowStyle: {
            opacity: 0.8
          }
        },
        position: ['60%', '20%'],
        formatter: this.formatterTooltip,
        position: this.setTooltipPositionfunction
      },
      xAxis: {
        data: echartsData.shopNewCustomerRespVo.dates
      },
      yAxis: {
        axisTick: {
          show: false
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#999',
          }
        },
        axisLabel: {
          color: '#666',
          fontSize: 13
        }
      },
      series: [{
        name: '新增客户数',
        type: 'bar',
        data: echartsData.shopNewCustomerRespVo.allNewCustomer
      }]
    }
  },
  getOption3() {
    let {
      echartsData
    } = this.data;
    return {
      color: ['#0179FF'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          shadowStyle: {
            opacity: 0.8
          }
        },
        position: ['60%', '20%'],
        formatter: this.formatterTooltip,
        position: this.setTooltipPositionfunction
      },
      grid: {
        left: 20,
        right: 20,
        bottom: 15,
        top: 40,
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        },
        data: echartsData.customerOrderAverageRespVo.dates
      }],
      yAxis: [{
        type: 'value',
        axisTick: {
          show: false
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666',
          fontSize: 13
        }
      }],
      series: [{
        name: '日均客单价',
        type: 'line',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        data: echartsData.customerOrderAverageRespVo.customerAverage
      },]
    };
  },
  filterMoney(money) {
    return Number(money).toLocaleString()
  },
  toOrderPage() {
    wx.navigateTo({
      url: '../confirmOrder/confirmOrder',
    })
  }
})