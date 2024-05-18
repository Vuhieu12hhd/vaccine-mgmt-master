import React, { useEffect, useRef, useState } from 'react'
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getChartData } from 'services/user';
import './style.scss'
import { formatNumber } from 'utils';
import Loader from 'components/Loader';

const getChartConfig = (data?: ChartResultData): Highcharts.Options => {
  const statisticIncome: number[] = [];
  const statisticVaccine: number[] = [];
  const categories: string[] = [];
  data?.statisticIncome.forEach((item, idx) => {
    statisticIncome.push(item.value);
    categories.push(item.key);
    statisticVaccine.push(data?.statisticVaccine[idx]?.value ?? 0);
  })
  return {
    chart: {
      type: 'column'
    },
    credits: {
      enabled: false
    },
    title: {
      text: 'Thống kê Doanh Thu',
      align: 'left'
    },
    subtitle: {
      text: '',
    },
    xAxis: {
      categories,
      crosshair: true,
    },
    yAxis: [
      {
        min: 0,
        title: {
          text: 'Tổng tiền'
        },
        lineWidth: 1,
        lineColor: '#2e2e2e'
      },
      {
        min: 0,
        title: {
          text: 'Số vaccine'
        },
        opposite: true,
        lineWidth: 1,
        lineColor: '#2e2e2e'
      }
    ],
    tooltip: {
      shared: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [
      {
        name: 'Doanh thu',
        data: statisticIncome,
        type: 'column',
        maxPointWidth: 15
      },
      {
        name: 'Số vaccine',
        data: statisticVaccine,
        type: 'column',
        yAxis: 1,
        maxPointWidth: 15

      }
    ]
  }
}



function getSubtitle(total: number) {
  return `<span style="font-size: 1.8rem; color: #7F91B1">Tổng doanh thu</span>
      <br>
      <span style="font-size: 1.8rem; text-align: center">
          <b> ${Highcharts.numberFormat(total, 0, ".", ',')}</b> VNĐ
      </span>`;
}

const getPieChartConfig = (data?: ChartResultData): Highcharts.Options => {
  const charData: { name: string, y: number }[] = [];

  let total = 0;
  console.log("data?.statisticIncome", data?.statisticIncome);
  
  if (data?.statisticIncome) {
    for (let i = 0; i < (data.statisticIncome.length ?? 0); i++) {
      const item = data.statisticIncome[i];
      charData.push({
        name: item.key.split('|')[1] as string,
        y: item.value
      })
      total += item.value;
    }
  }
  return {
    title: {
      text: '',
      align: 'center'
    },
    subtitle: {
      useHTML: true,
      text: getSubtitle(total),
      floating: true,
      verticalAlign: 'middle',
      y: 30
    },


    legend: {
      enabled: true,
      align: 'right',
      alignColumns: true,
      verticalAlign: 'middle',
      layout: 'vertical',
      floating: true,
      useHTML: true,
      x: 0,
      labelFormatter: function () {
        const point = this as Highcharts.Point
        return `<span style="margin-right: 1rem;">${this.index}</span><span style="margin-right: 1rem">${point.y} VNĐ</span><span  style="margin-right: 1rem;">${formatNumber((point.y ?? 0) / (point.total ?? 1), 2, 1 / 100)}% </span>`
      }
    },
    tooltip: {
      valueDecimals: 2,
      valueSuffix: ' VNĐ'
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      pie: {
        borderWidth: 0,
        innerSize: '75%',
        dataLabels: {
          enabled: false,

        },
        showInLegend: true,
      }
    },
    colors: ['#46ECEC', '#1CC1F5', '#FFAED0', '#B8E8FC', '#BCE29E'],
    series: [
      {
        type: 'pie',
        name: 'Tổng',
        data: charData,
      }
    ]
  }
}

interface ChartResultData {
  statisticIncome: { key: string; value: number }[];
  statisticIncomeByVaccine: { key: string; value: number }[];
  statisticVaccine: { key: string; value: number }[];
}
const TypeConfig = [
  {
    label: 'Thống Kê Theo Ngày',
    value: 'DAY'
  },
  {
    label: 'Thống Kê Theo Tháng',
    value: 'MONTH'
  },
  {
    label: 'Thống Kê Theo Năm',
    value: 'YEAR'
  },
]
const ColumnChart = () => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const pieChartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [activeType, setActiveType] = useState('DAY')
  const [isShow, setIsShow] = useState(true)
  useEffect(() => {
    queryData(activeType)
  }, [activeType]);

  const queryData = (type: string) => {
    getChartData({
      statisticType: type
    }).then(data => {
      console.log("data", data);
      
      if (data.status) {
        const option = getChartConfig(data.result as ChartResultData)
        const pieOptions = getPieChartConfig(data.result as ChartResultData)
        chartComponentRef.current?.chart.update(option);
        pieChartComponentRef.current?.chart.update(pieOptions);
      } else {
        setIsShow(false)
      }
    })
  }

  const options = getChartConfig();
  const pieOptions = getPieChartConfig();


  return (
    <>
    {isShow && <div className='max-w-screen-lg m-auto mb-10 flex flex-col'>
      <div className='flex mb-10 gap-4'>
        {
          TypeConfig.map(item =>
            <button
              key={item.value}
              type="button"
              onClick={() => setActiveType(item.value)}
              className={
                activeType === item.value ? "inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#007EA6] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  : "inline-block rounded bg-primary-100  text-primary-700 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
              }
            >
              {item.label}
            </button>
          )
        }

      </div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}

        ref={chartComponentRef}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={pieOptions}
        ref={pieChartComponentRef}
      />
    </div>}
    </>
    
  )
}

export default ColumnChart