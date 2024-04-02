import { el, mount, setChildren } from "redom"
import { nav } from "../nav"
import { createAccountPage } from "./acc"
import { loadPage} from "../utilities"
import { createAccount, getAccounts } from "../api"
import Navigo from "navigo"
import { router } from "../app"

let app = document.getElementById('app')

export let createMainPage = async function(){
    let token = localStorage.getItem('token');
    let accountsData = await getAccounts(token)
    const mpContainer = el(".p-12.w-full")
    // верхняя секция
    const mpTopWrapper = el(".flex.w-full.mb-12.items-center")
    const mpTopHeader = el("h2.font-bold.text-4xl.text-black.mr-8","Ваши счета")
    const mpTopSelect = el("select#mpTopSelect.w-72.h-10.border-2.border-primary.rounded-lg.py-2.px-4")
    const mpTopOptionNumber = el("option", "По номеру", {value:"number"})
    const mpTopOptionBalance = el("option", "По балансу", {value:"balance"})
    const mpTopOptionTrans = el("option", "По последней транзакции", {value:"trans"})
    const mpTopButton = el("button#mpTopButton.py-3.px-6.ml-auto.bg-primary.rounded-lg")
    const mpTopButtonText = el("span#mpTopButtonText.text-white.pl-8.relative.plus-icon", "Создать новый счет")
    // сетка со счетами 
    const mpGridWrapper = el("div#grid-wrapper.grid.grid-cols-3.gap-x-16.gap-y-12")
    let createAccountCard = function(account){

      let transactions = account.transactions[0]
      
      const mpGridCard = el("div.flex.flex-col.p-4.h-40.rounded-lg.bg-white.shadow-card")
      const mpCardHeader = el ("h3.account-number.font-medium.text-lg.text-secondary1.mb-2", `${account.account}`)
      const mpCardSumm = el("span.account-balance.font-normal.text-sm.text-secondary1.mb-2", `${account.balance} ₽`)
      const mpCardFooter =el("div.flex.justify-between.items-end")
      const mpCardFooterWrapper = el("div.flex.flex-col")
      const mpCardFootterTransaction = el("span.font-bold.text-sm.text-black", "Последняя транзакция:")
      const mpCardFooterDate = el("span.account-last-transaction.font-normal.text-sm.text-black")
      const mpCardFooterBtn = el("a.w-28.py-4.px-6.bg-primary.rounded-lg.text-white.acc-link", "Открыть", {href: `/account/${account.account}`})
      
      if (transactions){
        mpCardFooterDate.innerHTML = account.formatDate(transactions.date)
      } else {
        mpCardFooterDate.innerHTML = 'нет'
      }
      setChildren(mpCardFooterWrapper, [mpCardFootterTransaction,mpCardFooterDate])
      setChildren(mpCardFooter, [mpCardFooterWrapper,mpCardFooterBtn])
      setChildren(mpGridCard, [mpCardHeader, mpCardSumm, mpCardFooter])
      
      
      // обработчики событий 
      mpCardFooterBtn.addEventListener("click", function(e){
          e.preventDefault();
          loadPage()
          setTimeout(()=> {
              router.navigate(e.target.getAttribute('href'));
            }, 500)    
      })
      mount(mpGridWrapper, mpGridCard)
      }

    let renderAccountsList = async function(){ 
        accountsData.forEach(account => {
          createAccountCard(account)
      });
    }
    renderAccountsList()
    mpTopButton.addEventListener('click', async ()=>{
      let newAccount = await createAccount(token)
      let newAccountData = newAccount.payload
      createAccountCard(newAccountData)
    })

    // апендикс
    setChildren(mpTopButton, mpTopButtonText)
    setChildren(mpTopSelect, [mpTopOptionNumber, mpTopOptionBalance, mpTopOptionTrans])
    setChildren(mpTopWrapper, [mpTopHeader,mpTopSelect,mpTopButton])
    setChildren(mpContainer, [mpTopWrapper, mpGridWrapper])
    setChildren(app, mpContainer)
    // console.log(mpContainer)
    setChildren(document.body, [nav(), app])

    mpTopSelect.addEventListener("change", function(){
      const option = mpTopSelect.options[mpTopSelect.selectedIndex].value;
      const cards = Array.from(mpGridWrapper.children);

       switch (option) {
        case "number":
          cards.sort((b, a) => {
            const aNumber = a.querySelector(".account-number").textContent;
            const bNumber = b.querySelector(".account-number").textContent;
            return aNumber.localeCompare(bNumber);
          });
          break;
        case "balance":
          cards.sort((b, a) => {
            const aBalance = parseFloat(a.querySelector(".account-balance").textContent);
            const bBalance = parseFloat(b.querySelector(".account-balance").textContent);
            return aBalance - bBalance;
          });
          break;
        case "trans":
          cards.sort((b, a) => {
            const aDate = a.querySelector(".account-last-transaction").textContent;;
            const bDate = b.querySelector(".account-last-transaction").textContent;
            if (aDate === 'нет') {
              return -1; 
            } else if (bDate === 'нет') {
              console.log('invalid b');
              return 1; 
            } else {
              console.log('good');
              return aDate - bDate;
            }
          });
          break;
        default:
          break;
      }
       cards.forEach(card => mpGridWrapper.appendChild(card));
    })
}