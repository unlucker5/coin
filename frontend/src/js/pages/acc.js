import { el, mount, setChildren } from "redom"
import { nav } from "../nav"
import { createMainPage } from "./mainPage"
import { getAccount, getAccounts, transferFunds } from "../api"
import { cock, createTransactionRow, dateTransform, drawGraph, getMonthlyBalance, loadPage, renderTransactions } from "../utilities"
import { router } from "../app"


let app = document.getElementById('app')

export let createAccountPage = async function(id) {
    let accContainer = el(".p-12")
    
    let token = localStorage.getItem('token');
    let accountsData = await getAccount(id, token)
    let account = accountsData.payload
    
    let monthlyBalance = getMonthlyBalance(account.transactions, 6)
    console.log(monthlyBalance)

    // вверхняя сескция 
    let accTop = el (".top.flex.flex-col.mb-8")
    let accTopRow1 = el (".top1.flex.mb-4.items-center.justify-between")
    let accTopRow2 = el (".top2.flex.items-center.justify-between")
    let topHeader = el ("h2.font-bold.text-4xl.text-black", "Просмотр счета")
    let topBtn = el("a#mpTopButton.py-3.px-6.ml-auto.bg-primary.rounded-lg", {href:'/main'})
    let topBtnText = el("span#mpTopButtonText.text-white.pl-8.arrow", "Вернуться назад")
    let topNumber = el(".text-4xl.text-black", `№ ${account.account}`)
    let topBalanceWrap = el(".flex")
    let topBalanceName = el("span.mr-8.font-bold.text-black.text-lg", "Баланс")
    let topBalanceSumm = el ("span.text-black.text-lg",`${account.balance} ₽`)

    // центральная станция
    let accMid = el(".mid.flex.mb-8.justify-between")
    let midTransfer = el(".transfer.flex.flex-col.py-6.px-8.bg-gray7.rounded-3xl.w-45")
    let midDynamic = el(".dynamic.flex.flex-col.py-6.px-8.bg-white.rounded-3xl.drop-shadow-xl.w-45")
    let transferHeader = el("h3.transfer-header.font-bold.text-lg.color-black.mb-6", "Новый перевод")
    let transferWrapper = el(".transfer-wrapper.flex.justify-between")
    let transferCol1 = el("div.transfer-col1.flex.flex-col.w-5/12.items-end")
    let transferCol2 = el("div.transfer-col2.flex.flex-col.w-6/12.justify-items-start")
    let transferTextAcc  = el("span.transfer-text-acc.mb-10.mt-2.font-medium.text-base.text-secondary1","Номер счета получателя")
    let transferTextSumm = el("span.transfer-text-summ.text-base.text-secondary1.font-medium","Сумма перевода")
    let transferInputAcc = el("input.transfer-select.rounded-md.border-2.border-gray5.py-2.px-4.mb-6",{placeholder:"Введите счет"})
    let transferInputSumm = el("input.transfer-input.rounded-md.border-2.border-gray5.py-2.px-4.mb-6", {placeholder:"Введите сумму"})
    let transferBtn = el("button.transfer-btn.py-3.px-6.bg-primary.rounded-lg.mr-auto.text-white.pl-12.relative.mail-icon","Отправить")
    let transferError = el(".font-medium.text-base.text-error")
    let dynamicHeader = el("a.dynamic-header.font-bold.text-lg.color-black", "Динамика баланса", {href: `${account.account}/history`})
    let dynamicWrapper = el("canvas#dynamic.dynamic-wrapper")

    drawGraph(monthlyBalance, dynamicWrapper)

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

    renderTransactions(account.transactions, 10, account.account, botTBody)

    // апендикс верха
    setChildren(topBalanceWrap, [topBalanceName, topBalanceSumm])
    setChildren(topBtn, topBtnText)
    setChildren(accTopRow1,[topHeader, topBtn])
    setChildren(accTopRow2,[topNumber, topBalanceWrap])
    setChildren(accTop, [accTopRow1,accTopRow2])

    // апендкис центрального коридора 
    setChildren(transferCol1, [transferTextAcc, transferTextSumm])
    setChildren(transferCol2, [transferInputAcc, transferInputSumm, transferBtn])
    setChildren(transferWrapper, [transferCol1, transferCol2])
    setChildren(midTransfer, [transferHeader, transferWrapper, transferError])
    setChildren(midDynamic, [dynamicHeader, dynamicWrapper])
    setChildren(accMid, [midTransfer, midDynamic])

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
    dynamicHeader.addEventListener("click", function(e){
        e.preventDefault()
        loadPage()
        setTimeout(()=> {
            router.navigate(e.target.getAttribute('href'));
          }, 500)  
    })

    // перевод между счетами 

    transferBtn.addEventListener("click", async () => {
        let from = account.account;
        let to = transferInputAcc.value;
        let amount = transferInputSumm.value;
        let today = new Date();
        let date = dateTransform(today);
        transferError.innerHTML = ""; 

        if (from === "" || to === "" || amount === "") {
          transferError.innerHTML = "Заполните поля";
          return;
        }
        if (parseFloat(amount) > parseFloat(account.balance)) {
          transferError.innerHTML = "Не хватает средств";
          return;
        }
         try {
          let result = await transferFunds(from, to, amount, token);
          if (!result.error) {
            let transferAccounts = localStorage.getItem("TransferAccount");
            if (!transferAccounts) {
              localStorage.setItem("TransferAccount", to);
            } else {
              let accountsArr = transferAccounts.split(",");
              if (!accountsArr.includes(to)) {
                accountsArr.push(to);
                let updatedAccounts = accountsArr.join(",");
                localStorage.setItem("TransferAccount", updatedAccounts);
              }
            }
            transferInputAcc.value = "";
            transferInputSumm.value = "";
            createTransactionRow(from, to, amount, date, account.account, botTBody);
            let updatedData = await getAccount(id, token)
            topBalanceSumm.textContent = `${updatedData.payload.balance} ₽`
          } else {
            transferError.innerHTML = "Error: " + result.error;
          }
        } catch (error) {
          transferError.innerHTML = "Error: " + error.message;
        }
      });

    transferInputAcc.addEventListener('focus', () => {
        let transferAccounts = localStorage.getItem('TransferAccount');
        if (transferAccounts) {
            let accountsArr = transferAccounts.split(',');
            let datalist = document.createElement('datalist');
            datalist.id = 'transferAccounts';
            accountsArr.forEach(account => {
                let option = document.createElement('option');
                option.value = account;
                datalist.appendChild(option);
            });
            transferInputAcc.setAttribute('list', 'transferAccounts');
            transferInputAcc.parentNode.insertBefore(datalist, transferInputAcc.nextSibling);
        }
    });
    
}



