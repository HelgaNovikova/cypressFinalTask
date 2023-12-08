///<reference types = "Cypress" />
import main_page_selectors from "../support/main_page_selectors"
import { data } from "../fixtures/main_menu.json"

describe('Menus open successfully', () => {
    before(() => {
        cy.visit('/')
    })

    after('Home page opens', () => {
        cy.get('a').contains('Home').click()
        cy.get(main_page_selectors.logo).should('be.visible')
        cy.location('pathname').should('eq', '/')
    })

    it('After choosing menu correct page opens', () => {
        data.forEach((item) => {
            cy.get('a').contains(item.menu).click()
            cy.get('.inn-tital').find('h1').contains(item.header, { matchCase: false })
            cy.location('pathname').should('eq', item.url)
        })
    })
})