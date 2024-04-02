import { el, mount, setChildren } from "redom"
import { nav } from "../nav"
import { createAccountPage } from "./acc"
import { getAccount } from "../api"
import { dateTransform, drawGraph, drawRatioGraph, getMonthlyBalance, loadPage, renderTransactions } from "../utilities"
import { router } from "../app"

let app = document.getElementById('app')

export let createHistoryPage = async function(id) {
    let token = localStorage.getItem('token')
    let accountsData = await getAccount(id, token)
    let account = accountsData.payload

    let accContainer = el(".p-12")

    // вверхняя сескция 
    let accTop = el (".top.flex.flex-col.mb-8")
    let accTopRow1 = el (".top1.flex.mb-4.items-center.justify-between")
    let accTopRow2 = el (".top2.flex.items-center.justify-between")
    let topHeader = el ("h2.font-bold.text-4xl.text-black", "Просмотр счета")
    let topBtn = el("button#mpTopButton.py-3.px-6.ml-auto.bg-primary.rounded-lg")
    let topBtnText = el ("a#mpTopButtonText.text-white.pl-8.arrow", "Вернуться назад", {href: `/account/${account.account}`})
    let topNumber = el(".text-4xl.text-black", `№ ${account.account}`)
    let topBalanceWrap = el(".flex")
    let topBalanceName = el("span.mr-8.font-bold.text-black.text-lg", "Баланс")
    let topBalanceSumm = el ("span.text-black.text-lg",`${account.balance} ₽`)

    // центральная станция
    let accMid = el(".mid.flex.mb-8.flex-col")
    let midDynamic = el(".transfer.flex.flex-col.py-6.px-8.rounded-3xl.shadow-0520.drop-shadow-xl.w-full.mb-12")
    let midRatio = el(".dynamic.flex.flex-col.py-6.px-8.bg-white.rounded-3xl.shadow-0520.drop-shadow-xl.w-full")
    let dynamicHeader = el("h3.transfer-header.font-bold.text-lg.color-black.mb-6", "Динамика баланса")
    let ratioHeader = el("h3.transfer-header.font-bold.text-lg.color-black.mb-6", "Соотношение входящих исходящих транзакций")
    let dynamicWrapper = el("canvas#dinamic")
    let ratioWrapper = el("canvas#ratio")

    // нижний интернет
    let accBot = el(".bot.bg-gray7.rounded-3xl.py-6.px-12")
    let botHeader = el("h3.bot-header.font-bold.text-lg.color-black.mb-6", "Итория переводов")
    let botTable = el("table.bot-table.w-full")
    let botTHead = el("thead.bot-th.bg-primary.text-white")
    let theadTr = el ("tr.thead-tr.w-full")
    let theadThExport = el("th.thead-th1.rounded-l-2xl.rounded-r-none.py-5.pl-10.font-medium.text-lg", "Счет отравителя")
    let theadThImport = el("th.thead-th2.font-medium.text-lg", "Счет получателя")
    let theadThSumm = el("th.thead-th3.font-medium.text-lg", "Сумма")
    let theadThDate = el("th.thead-th4.rounded-r-2xl.rounded-l-none.pr-60.font-medium.text-lg", "Дата")
    let botTBody = el ("tbody.bot-tb")
    console.log(botTBody)
    console.log(account.transactions)
    renderTransactions(account.transactions, 25, account.account ,botTBody)

    // апендикс верха
    setChildren(topBalanceWrap, [topBalanceName, topBalanceSumm])
    setChildren(topBtn, topBtnText)
    setChildren(accTopRow1,[topHeader, topBtn])
    setChildren(accTopRow2,[topNumber, topBalanceWrap])
    setChildren(accTop, [accTopRow1,accTopRow2])

    // апендкис центрального коридора 
    setChildren(midDynamic, [dynamicHeader, dynamicWrapper])
    setChildren(midRatio, [ratioHeader, ratioWrapper])
    setChildren(accMid, [midDynamic, midRatio])

    // апендикс низа
    setChildren(theadTr, [theadThExport, theadThImport, theadThSumm, theadThDate])
    setChildren(botTHead, theadTr)
    setChildren(botTable, [botTHead, botTBody])
    setChildren(accBot, [botHeader, botTable])

    // сумарный апендикс
    setChildren(accContainer, [accTop, accMid, accBot])
    setChildren(app, accContainer)
    setChildren(document.body, [nav(), app])

    // обработчики событий 
    topBtn.addEventListener("click", function(e){
        e.preventDefault()
        loadPage()
        setTimeout(()=> {
            router.navigate(e.target.getAttribute('href'));
          }, 500)  
    })

    // функции 

    let standartMonthlyBalance = getMonthlyBalance(account.transactions, 12)

    drawGraph(standartMonthlyBalance, dynamicWrapper, 4)

    let incomeArray = []
    let outcomeArray = []

    const targetFrom = account.account;

    const filteredData = account.transactions.map(item => {
        if (item.from === targetFrom) {
            item.amount = item.amount
          outcomeArray.push(item)
        } else {
        incomeArray.push(item)
        }
      });
    console.log(filteredData)
    const incomeMonthlyBalance = getMonthlyBalance(incomeArray, 12)
    const outcomeMonthlyBalance = getMonthlyBalance(outcomeArray, 12)
    
    console.log(incomeMonthlyBalance, outcomeMonthlyBalance)
    drawRatioGraph(incomeMonthlyBalance, outcomeMonthlyBalance, ratioWrapper)
}