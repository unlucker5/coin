import { Account } from "./classes";

export async function login(login, password) {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login, password })
      });
      const data = await response.json();
      localStorage.setItem('token', data.payload.token);
      return data.payload.token;
    } catch (error) {
      console.error(error);
      if (error.message === 'Invalid password') {
        throw new Error('Invalid password');
      } else if (error.message === 'No such user') {
        throw new Error('No such user');
      } else {
        throw new Error('Unknown error');
      }
    }
  }

  export async function getAccounts(token) {
    try {
      const response = await fetch('http://localhost:3000/accounts', {
        headers: {
          Authorization: ` Basic ${token}`
        }
      });
      const data = await response.json();
      if (data.error) {
        return data;
      }
      const accounts = data.payload.map(accountData => new Account(accountData));
      console.log(accounts);
      return accounts;
    } catch (error) {
      console.error(error);
    }
  } 

  // конкретный счет 

 export async function getAccount(id, token) {
    try {
      // Make request to server
      const response = await fetch(`http://localhost:3000/account/${id}`, {
        headers: {
          'Authorization': `Basic ${token}`
        }
      });
      // Handle response
      if (response.ok) {
        const account = await response.json();
        console.log(account);
        return account;
      } else {
        const { message } = await response.json();
        throw new Error(message);
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get account information');
    }
  }

  // создание нового счета

  export async function createAccount(token) {
    try {
      // Make request to server
      const response = await fetch('http://localhost:3000/create-account', {
        method: 'POST',
        headers: {
          Authorization: ` Basic ${token}`
        }
      });
      // Handle response
      if (response.ok) {
        const account = await response.json();
        console.log(account)
        return account;
      } else {
        const { message } = await response.json();
        throw new Error(message);
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create account');
    }
  }

  // перевод между счетами 

 export async function transferFunds(from, to, amount, token) {
    try {
      // Make request to server
      const response = await fetch('http://localhost:3000/transfer-funds', {
        method: 'POST',
        headers: {
          Authorization: ` Basic ${token}`,
          'Content-Type': 'application/json'
        },
        
        body: JSON.stringify({ from, to, amount })
      });
       // Handle response
      if (response.ok) {
        const account = await response.json();
        console.log(account);
        return account;
      } else {
        const { message } = await response.json();
        throw new Error(message);
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to transfer funds');
    }
  }

 export async function getAllCurrencies() {
    try {
      const response = await fetch('http://localhost:3000/all-currencies');
      const currencies = await response.json();
      return currencies;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch currencies');
    }
  }

  export async function getCurrencies(token) {
    try {
      const response = await fetch('http://localhost:3000/currencies', {
        headers: {
          Authorization: ` Basic ${token}`
        }
      });
      const currencies = await response.json();
      return currencies;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch currencies');
    }
  }

export async function currencyBuy(from, to, amount, token) {
  try {
    // Make request to server
    const response = await fetch('http://localhost:3000/currency-buy', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from, to, amount })
    });
     // Handle response
    if (response.ok) {
      const accountInfo = await response.json();
      // console.log(accountInfo);
      return accountInfo;
    } else {
      const { message } = await response.json();
      throw new Error(message);
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to complete currency exchange');
  }
}

  export async function listenCurrencyFeed() {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket('ws://localhost:3000/currency-feed');
  
      socket.onopen = () => {
        console.log('WebSocket connection established');
        resolve(socket);
      };
  
      socket.onerror = error => {
        console.error('WebSocket error:', error);
        reject(error);
      };
    });
  }
  
 export async function getCordsArray() {
    try {
      const response = await fetch('http://localhost:3000/banks');
      const data = await response.json();
      const cords = data.payload || [];
      return cords;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch cords array');
    }
  }
  





 