import { el, mount, setChildren, setStyle } from "redom"
import Chart from 'chart.js/auto';

let app = document.getElementById('app')

export let buildLoader  = function (){
  let loaderWrapper = el('.loader')
  let loaderCircle1 = el('') 
  let loaderCircle2 = el('')
  let loaderCircle3 = el('')
  let loaderCircle4 = el('')
  setChildren(loaderWrapper, [loaderCircle1, loaderCircle2, loaderCircle3,loaderCircle4])

  return loaderWrapper
}
export let createLoader = function(){
    setChildren(app, buildLoader())
    app.style.display = 'flex'
    app.style.justifyContent = 'center'
    app.style.alignItems = 'center'
    setTimeout(() => {
        setChildren(app, [])
        app.style.display = 'block'
        app.style.justifyContent = ''
        app.style.alignItems = ''
    }, 500);
}


export let dateTransform = function(dateString){
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${day}.${month}.${year}`
}

export let loadPage = function(){
  app.innerHTML = ''
  createLoader()
}


export let cock = function(){
  console.log('cock')
}

const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

export function getMonthlyBalance(data, slice) {
  const balanceByMonth = {};
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;


  for (let year = 2020; year <= currentYear; year++) {
    const maxMonth = (year === currentYear) ? currentMonth : 12;
    for (let month = 1; month <= maxMonth; month++) {
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
      balanceByMonth[monthKey] = { month: monthKey, balance: 0 };
    }
  }

  data.forEach(transaction => {
    const date = new Date(transaction.date);
    const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const amount = transaction.sender === data.id ? transaction.amount : -transaction.amount;
    balanceByMonth[month].balance += amount;
  });


  const slicedArray = Object.values(balanceByMonth)
    .sort(({ month: a }, { month: b }) => b.localeCompare(a))
    .slice(0, slice);


  const transformedDataArray = slicedArray.map(({ month, balance }) => {
    const [year, monthIndex] = month.split('-');
    const monthName = monthNames[parseInt(monthIndex) - 1];
    const roundedBalance = Math.round(balance);
    return { x: monthName, y: roundedBalance };
  });

  return transformedDataArray.reverse();
}

// создание строки таблицы 

export function createTransactionRow(from, to, amount, date, account, wrapper){
  let tr = el ("tr.tbody-tr.border-b.border-gray6.text-gray2")
  let Export = el("td.tbody-export.py-5.pl-14", from)
  let Import = el("td.tbody-export", to)
  let Summ = el("td.tbody-export", amount)
  let Date = el("td.tbody-export", date)
  setChildren(tr, [Export, Import, Summ ,Date])

  if (from === account) {
    Summ.textContent = "- " + amount + ' ₽';
    setStyle(Summ, {color: 'red'})
  } else {
    Summ.textContent = "+ " + amount + ' ₽';
    setStyle(Summ, {color: 'green'})
  }

  mount(wrapper, tr, wrapper.firstChild)
}
// account.transactions.slice(-10).forEach(transaction => {
//   let from = transaction.from
//   let to = transaction.to
//   let amount = transaction.amount
//   let date = dateTransform(transaction.date)
//   createTransactionRow(from, to, amount, date)
// })

export function renderTransactions(transactions, number, account, wrapper) {
  transactions.slice(-number).forEach(transaction => {
    const from = transaction.from;
    const to = transaction.to;
    const amount = transaction.amount;
    const date = dateTransform(transaction.date);
    createTransactionRow(from, to, amount, date, account, wrapper)
  });
}

// chart graph

export async function drawGraph(data, wrapper, scale){
  const chartAreaBorder = {
  id: 'chartAreaBorder',
  beforeDraw(chart, args, options) {
    const {ctx, chartArea: {left, top, width, height}} = chart;
    ctx.save();
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    ctx.setLineDash(options.borderDash || []);
    ctx.lineDashOffset = options.borderDashOffset;
    ctx.strokeRect(left, top, width, height);
    ctx.restore();
  }
};
  new Chart(
    wrapper,
    {
      type: 'bar',
      data: {
        labels: data.map(row => row.x),
        datasets: [
          {
            label: 'обьем',
            data: data.map(row => row.y),
            backgroundColor:['rgba(17,106,204,1)'],
            borderColor:['rgb(17,106,204)'],
            borderWidth: 0
          },

        ],
        
      },
      options: {
        responsive: true,
        aspectRatio: scale,
        scales: {
          x: {
            ticks: {
              font: {
                size: 15,
                weight: "700",
              },
            },
            grid: {
              display:false,
            },
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              maxTicksLimit: 2,
              font: {
                size: 20,
                weight: "700",
                font: "Work Sans"
              },
              autoSkip: true,
            },
            position: "right",
            bounds: "max",
          },
      }, 
      plugins: {
        legend:{
          display: false,
          labels: {
            font: {
              family: "Work Sans"
            }
          }
        }
      },
      chartAreaBorder:{
        borderWidth: 4
       }
    },
     plugins: [chartAreaBorder]
     
    }
  );

}

export async function drawRatioGraph(incomeData, outcomeData, wrapper){
  const chartAreaBorder = {
  id: 'chartAreaBorder',
  beforeDraw(chart, args, options) {
    const {ctx, chartArea: {left, top, width, height}} = chart;
    ctx.save();
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    ctx.setLineDash(options.borderDash || []);
    ctx.lineDashOffset = options.borderDashOffset;
    ctx.strokeRect(left, top, width, height);
    ctx.restore();
  }
};
  new Chart(
    wrapper,
    {
      type: 'bar',
      data: {
        labels: incomeData.map(row => row.x),
        datasets: [
          {
            label: 'убыток',
            data: outcomeData.map(row => row.y),
            backgroundColor:['rgba(253,78,93,1)'],
            borderColor:['rgb(253,78,93)'],
            borderWidth: 0
          },
          {
            label: 'доход',
            data: incomeData.map(row => row.y),
            backgroundColor:['rgba(118,202,102,1)'],
            borderColor:['rgb(118,202,102)'],
            borderWidth: 0
          },

        ],
        
      },
      options: {
        responsive: true,
        aspectRatio: 4,
        scales: {
          x: {
            stacked: true,
            ticks: {
              font: {
                size: 15,
                weight: "700",
              },
            },
            grid: {
              display:false,
            },
          },
          y: {
            stacked: true,
            grid: {
              display: false,
            },
            ticks: {
              maxTicksLimit: 2,
              font: {
                size: 20,
                weight: "700",
                font: "Work Sans"
              },
              autoSkip: true,
            },
            position: "right",
            bounds: "max",
          },
      }, 
      plugins: {
        legend:{
          display: false,
          labels: {
            font: {
              family: "Work Sans"
            }
          }
        }
      },
      chartAreaBorder:{
        borderWidth: 4
       }
    },
     plugins: [chartAreaBorder]
     
    }
  );

}
// export async function drawGraph(data, wrapper){
//   const changendData = [{
//     x: data.map(row => row.x),
//     y: data.map(row => row.y), 
//     type: 'bar',
//     marker: {
//       color: 'rgb(17,106,204)'
//     }
//   }]
//   const setings = {
//     displayModeBar: false, 
//     responsive:true
//   }
//   Plotly.newPlot(wrapper, changendData, {}, setings);
  
// }

