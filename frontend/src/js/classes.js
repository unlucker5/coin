export class Account {
    constructor(accountData) {
        this.account = accountData.account;
        this.balance = accountData.balance;
        this.mine = accountData.mine;
        this.transactions = accountData.transactions;
      }


      // методы
      formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.toLocaleString('en-US', { month: 'long' }).toLowerCase();
        const day = date.getDate();
        return `${day} ${month} ${year}`;
      }
}
