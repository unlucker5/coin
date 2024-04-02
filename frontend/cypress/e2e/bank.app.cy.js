/// <reference types="cypress" />


describe('bank app', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8000/login')
          cy.get('input').first().type('developer') 
          cy.get('input').eq(1).type('skillbox') 
          cy.contains('Войти').click() 
          cy.url().should('include', '/main')
    })

    it('создание нового счета', ()=>{
        let initialCount;
        cy.get('#grid-wrapper').children().then(($children) => {
          initialCount = $children.length;
          cy.contains('Создать новый счет').click();
          cy.get('#grid-wrapper').children().should('have.length', initialCount + 1);
        })
    })

    it('перевод со счета на счет', ()=>{
        cy.contains('Открыть').first().click() 
        cy.get('input').first().type('13831674617606478187203850') 
        cy.get('input').eq(1).type('13') 
        cy.contains('Отправить').click() 
        cy.get('table tr').eq(1).find('td').eq(1).should('have.text', '13831674617606478187203850');
    })

        it('создание нового счета и проверка его работы', ()=>{
        cy.contains('Создать новый счет').click();
        cy.get('.acc-link').last().click();
        cy.get('input').first().type('13831674617606478187203850') 
        cy.get('input').eq(1).type('13') 
        cy.contains('Отправить').click() 
        cy.get('table tr').eq(1).find('td').eq(1).should('have.text', '13831674617606478187203850');
        });

})
