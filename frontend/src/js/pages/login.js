import { el, setChildren } from "redom"
import { baseNav } from "../nav"
import { getAccounts, login } from "../api"
import { createMainPage } from "./mainPage.js";
import { loadPage, navigateTo } from "../utilities";
import { router, tokenStorage } from "../app";

let app = document.getElementById('app')

export let createLoginPage = function(){
    const loginContainer = el("div#loginContainer.flex.justify-center.items-center.w-full.min-h-screen")
    const loginWrapper = el("div#loginWrapper#loginWrapper.flex.flex-col.items-center.w-500.bg-gray7.rounded-3xl.p-12")
    const loginHeader = el("h2.text-4xl.text-black.font-bold.mb-8", "Вход в аккаунт")
    const loginForm = el("form#loginForm.flex.flex-col")
    const loginWrapp = el("div#loginWrapp.flex.items-center.mb-6")
    const loginLabel = el("label#loginLabel.mr-4.text-base.text-black.font-medium", {for: "loginInput"}, "Логин")
    const loginInput = el("input#loginInput.w-80.p-3.pl-4.border-2.border-gray5.rounded-lg", {placeholder: "Введите логин"} )
    const passwordWrapp = el("div#passwordWrapp1.flex.items-center.mb-8.-ml-2")
    const passwordLabel = el("label#passwordLabel.mr-4.text-base.text-black.font-medium", {for: "passwordInput"}, "Пароль")
    const passwordInput = el("input#passwordInput.w-80.p-3.pl-4.border-2.border-gray5.rounded-lg", {placeholder: "Введите пароль", type: "password"} )
    const formBtn = el("a#formBtn.w-20.ml-16.py-3.px-5.bg-primary.text-white.rounded-lg.mb-6", "Войти", {href: '/main'})
    const formErrors = el("div.text-sm.font-bold.text-center")

    setChildren(passwordWrapp, [passwordLabel, passwordInput])
    setChildren(loginWrapp, [loginLabel, loginInput])
    setChildren(loginForm, [loginWrapp, passwordWrapp, formBtn, formErrors])
    setChildren(loginWrapper, [loginHeader,loginForm])
    setChildren(loginContainer, loginWrapper)
    setChildren(app, loginContainer)
    setChildren(document.body, [baseNav().nav, app])
  
    formBtn.addEventListener('click', async (e)=>{
        e.preventDefault()
       
        formErrors.innerHTML = '';

        const loginValue = loginInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        let errors = [];

        if (loginValue.length < 6 || loginValue.includes(' ')) {
          errors.push('Не поддерживаются логины длиной менее 6 символов и с пробелами');
        }
      
        if (passwordValue.length < 6 || passwordValue.includes(' ')) {
        errors.push('Не поддерживаются пароли длиной менее 6 символов и с пробелами');

        }
        if (errors.length > 0) {
            formErrors.innerHTML = errors.join('<br>');
            formErrors.style.color = 'red';
          } else {
            const token = await login(loginValue, passwordValue)
            if (token){
                loadPage()
                setTimeout(()=> {
                    router.navigate(e.target.getAttribute('href'))
                  }, 500)            
            } 
          }
    })
}
