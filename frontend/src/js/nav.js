import { el, setChildren } from "redom";
import { createLoader, loadPage } from "./utilities";
import { router } from "./app";
export let baseNav = function(){
    const nav = el("nav.flex.justify-between.w-full.bg-primary.h-24.shadow-md.py-6.px-12", )
    const logo = el("a.font-light.text-5xl.text-white", "Logo.")
    setChildren(nav, logo)
    return { nav, logo } 
}

export let nav = function(){
    const nav = baseNav().nav
    const logo = baseNav().logo
    const btnWrapper = el("div#btnWrapper.flex")
    const atmBtn = el("a#atmBtn.mr-4.py-3.px-4.bg-white.text-primary.rounded-lg.border-2.border-primary", "Банкоматы" , {href: '/map'})
    const accBtn = el("a#accBtn.mr-4.py-3.px-4.bg-white.text-primary.rounded-lg.border-2.border-primary", "Счета", {href: '/main'}) 
    const curBtn = el("a#curBtn.mr-4.py-3.px-4.bg-white.text-primary.rounded-lg.border-2.border-primary", "Валюта", {href: '/currency'}) 
    const exitBtn = el("a#exitBtn.py-3.px-4.bg-white.text-primary.rounded-lg.border-2.border-primary", "Выйти", {href: '/login'}) 
    setChildren(btnWrapper, [atmBtn, accBtn, curBtn, exitBtn])
    setChildren(nav, [logo, btnWrapper])

    atmBtn.addEventListener("click", (e)=>{
        e.preventDefault()
        loadPage()
        setTimeout(()=> {
            router.navigate(e.target.getAttribute('href'));
          }, 500)  
    })
    accBtn.addEventListener("click", (e)=>{
        e.preventDefault()
        loadPage()
        setTimeout(()=> {
            router.navigate(e.target.getAttribute('href'));
          }, 500)  
    })
    curBtn.addEventListener("click", (e)=>{
        e.preventDefault()
        loadPage()
        setTimeout(()=> {
            router.navigate(e.target.getAttribute('href'));
          }, 500)  
    })
    exitBtn.addEventListener("click", (e)=>{
        e.preventDefault()
        loadPage()
        setTimeout(()=> {
            router.navigate(e.target.getAttribute('href'));
          }, 500)  
          localStorage.removeItem("token")
    })
    


    return nav
}

