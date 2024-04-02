
import { el, setChildren } from "redom";
import { createAccountPage } from "./pages/acc.js";
import { createHistoryPage } from "./pages/history.js";
import { createLoginPage } from "./pages/login.js";
import { createMainPage } from "./pages/mainPage.js";
import { baseNav, nav } from "./nav.js";
import { createCurrencyPage } from "./pages/currency.js";
import { cock, loadPage } from "./utilities.js";
import Navigo from "navigo";
import { createAtmPage } from "./pages/atm.js";

const token = localStorage.getItem('token');

export const router = new Navigo('/');

router.on('/', ()=>{
    if(token){
      createMainPage()
    } else {
      createLoginPage()
    }
  })
  router.on('/account/:id',({data: {id}}) => createAccountPage(id))
  router.on('/login', createLoginPage)
  router.on('/:id/history', ({data: {id}}) => createHistoryPage(id))
  router.on('/currency', createCurrencyPage)
  router.on('/map', createAtmPage)
  router.on('/main', createMainPage)
  router.on('/login', createLoginPage)

  router.resolve();

export let tokenStorage = []


