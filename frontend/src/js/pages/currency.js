import { el, mount, setChildren, unmount } from "redom"
import { nav } from "../nav"
import { currencyBuy, getAccounts, getAllCurrencies, getCurrencies, listenCurrencyFeed } from "../api"
import { tokenStorage } from "../app"
import { buildLoader } from "../utilities"


let app = document.getElementById('app')

export let createCurrencyPage = async function() {
    let token = localStorage.getItem('token');
    let accountsData = await getAccounts(token)
    let account = accountsData[0]

    let curContainer = el(".p-12.w-full")
    let curHeader = el("h2.font-bold.text-4xl.text-black.mb-14","Валютный обмен")

    let curWrap = el(".flex.justify-between")
    let curWrappCol1 = el(".flex.flex-col.w-43")
    let allCurrencies = await getAllCurrencies()
    let currenciens = await getCurrencies(token)
    let currenciensFeed = await listenCurrencyFeed()

    // первый нах

    let curYours = el(".flex.flex-col.border-5xl.shadow-0520.p-12.mb-11")
    let yoursHeader = el("h3.font-bold.text-lg.color-black.mb-6", "Ваши валюты")
    let yoursWrapper = el(".flex.flex-col.w-full")

    let createAllCurrenciensList = function(array) {
      yoursWrapper.innerHTML = ''
       for (let currency in array) {
        let currencyData = array[currency];
        let yoursRow = el(".flex.w-full.items-baseline");
        let yoursRowCur = el("span.font-semibold.text-black.text-xl.pr-2", currencyData.code);
        let yoursRowLine = el("span.border-b.border-black.border-dotted.w-full.block");
        let yoursRowNumber = el("span.font-regular.text-black.text-xl.pl-2", currencyData.amount.toFixed(2));
        setChildren(yoursRow, [yoursRowCur, yoursRowLine, yoursRowNumber]);
        mount(yoursWrapper, yoursRow);
      }
    }
    createAllCurrenciensList(currenciens.payload)

    // второй 
    let curTrade = el(".flex.flex-col.border-5xl.shadow-0520.p-12")
    let tradeHeader = el("h3.font-bold.text-lg.color-black.mb-6", "Обмен валюты")
    let tradeWrapp = el(".flex")
    let tradeCol1 = el(".flex.flex-col.mr-6")
    let tradeCol1Row1 = el(".flex.mb-6")
    let tradeRow1Label1 = el ("label.font-medium.text-lg.color-black.mr-5", "Из")
    let tradeRow1Select1 = el ("select.mr-5")
    let tradeRow1Label2 = el ("label.font-medium.text-lg.color-black.mr-5", "в")
    let tradeRow1Select2 = el ("select")
    let tradeCol1Row2 = el(".flex.items-center")
    let tradeRow2Input = el("input.px-4.py-2.border.border-gray5.rounded-md", {placeholder:"Введите сумму", type: "number"})
    let tradeRow2Label = el("label.font-medium.text-lg.color-black.mr-2", "Сумма")
    let tradeCol2 = el(".flex.w-full")
    let tradeCol2Button = el("button.bg-primary.rounded-lg.text-white.w-full","Обменять")

    // добавление валют в селекты
    let currenciesArray = allCurrencies.payload
    currenciesArray.forEach(currencyCode => {
    const option = el("option", currencyCode);
    mount(tradeRow1Select1, option);
    });
    let element = currenciesArray.splice(1, 1)[0];
    currenciesArray.unshift(element);
    currenciesArray.forEach(currencyCode => {
    const option = el("option", currencyCode);
    mount(tradeRow1Select2, option);
    });

    // обработчик на кнопку, для перевода 
    tradeCol2Button.addEventListener("click", async function(){
      let from = tradeRow1Select1.value;
      let to = tradeRow1Select2.value;
      let amount = tradeRow2Input.value;
      if (amount === "") {
        alert("Введите сумму");
        return;
      }
       let updatedArray = await currencyBuy(from, to, amount, token);
       let currencyData = currenciens.payload[from];
      console.log(currencyData)
      if (amount > currencyData.amount) {
        alert(`У вас недостаточно ${currencyData.code}`);
        return;
      }
      yoursWrapper.innerHTML = '';
      setChildren(yoursWrapper, buildLoader());
      yoursWrapper.style.display = 'flex'
      yoursWrapper.style.justifyContent = 'center'
      yoursWrapper.style.alignItems = 'center'
      setTimeout(() => {
        console.log(updatedArray.payload);
        yoursWrapper.style.display = 'block'
        yoursWrapper.style.justifyContent = ''
        yoursWrapper.style.alignItems = ''
        createAllCurrenciensList(updatedArray.payload);

      }, 1500); 
    });
    // третий
    let curChanges = el(".flex.flex-col.w-1/2.border-5xl.p-12.bg-gray8")
    let changesHeader = el("h3.font-bold.text-lg.color-black.mb-6", "Изменение курсов в реальном времени")
    let changesWrapper = el(".flex.flex-col.w-full")
    let changesRow1 = el(".flex.w-full.items-baseline")
    let changesRow1Pair = el("span.font-semibold.text-black.text-xl.pr-2", "BTC/ETH")
    let changesRow1Dots = el("span.border-b.border-black.border-dotted.w-full")
    let changesRow1Number = el("span.font-regular.text-black.text-xl.pl-2.pr-2", "6312.3123545131")
    let changesSVG = el("svg.w-8.h-4")
    let changesSVGGreen = el("polygon", {points:"0,0 6,6 12,0"})

function addCurrencyChange(data) {
  // Создаем новую строку с изменением курса
  let changesRow = el(".flex.w-full.items-baseline.animation-fade.h-6.mb-6");
  let changesRowPair = el("span.font-semibold.text-black.text-xl.pr-2", `${data.from}/${data.to}`);
  let changesRowDots = el("span.border-b.border-black.border-dotted.w-full");
  let changesRowNumber = el("span.font-regular.text-black.text-xl.pl-2.pr-2", `${data.rate}`);
  let changesSVG = el(".w-0.h-0");
  changesRow.style.opacity = "0"
  
  if (data.change > 0){
    changesSVG.classList.add("arrow-up")
  } else {
    changesSVG.classList.add("arrow-down")
  }

  // Добавляем новую строку в контейнер
  setChildren(changesRow, [changesRowPair, changesRowDots, changesRowNumber, changesSVG]);
  mount(changesWrapper, changesRow);
  setTimeout(()=>{
    changesRow.style.opacity = "100"
  }, 100)


  setTimeout(()=>{
    changesRow.style.opacity = "0"
  }, 13500)

  setTimeout(() => {
      changesRow.remove();
    }, 14000);
  }

currenciensFeed.onmessage = event => {
  // Получаем данные из сообщения
  let data = JSON.parse(event.data);

  addCurrencyChange(data);
};



    // аппендикс первого

    setChildren(curYours, [yoursHeader, yoursWrapper])

    // аппендикс второго 
    setChildren(tradeCol1Row1, [tradeRow1Label1, tradeRow1Select1, tradeRow1Label2, tradeRow1Select2])
    setChildren(tradeCol1Row2, [tradeRow2Label, tradeRow2Input])
    setChildren(tradeCol1, [tradeCol1Row1, tradeCol1Row2])
    setChildren(tradeCol2, tradeCol2Button)
    setChildren(tradeWrapp, [tradeCol1, tradeCol2])
    setChildren(curTrade, [tradeHeader, tradeWrapp])

    // аппендикс третье
    setChildren(changesSVG, changesSVGGreen)
    setChildren(changesRow1, [changesRow1Pair, changesRow1Dots, changesRow1Number, changesSVG])
    // setChildren(changesWrapper, changesRow1)
    setChildren(curChanges, [changesHeader, changesWrapper])


    // сумарный аппендикс
    setChildren(curWrappCol1, [curYours, curTrade])
    setChildren(curWrap, [curWrappCol1, curChanges])
    setChildren(curContainer, [curHeader, curWrap])
    setChildren(app, curContainer)
    setChildren(document.body, [nav(), app])
    
}