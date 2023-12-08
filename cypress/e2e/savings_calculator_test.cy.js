import savings_calc_selectors from "../support/savings_calc_selectors";
import { data } from "../fixtures/provinces.json"

describe('Locations test', () => {
    before(() => {
        cy.visit('/savings-calculator/')
        cy.get('.inn-tital').find('h1').should('contain', 'Savings Calculator')
    })

    it('All Canadian provinces are presented and contain at least one city', () => {
        data.forEach((province) => {
            cy.get(savings_calc_selectors.select_state).should('contain', province.province)
            cy.get(savings_calc_selectors.select_state).select(province.province)
            cy.get(savings_calc_selectors.select_city).should('have.length.at.least', 1)

        })
    })

    data.forEach(province => {
        it(province.province + ' can be chosen and contains at least one city', () => {
            cy.get(savings_calc_selectors.select_state).should('contain', province.province)
            cy.get(savings_calc_selectors.select_state).select(province.province)
            cy.get(savings_calc_selectors.select_city).should('have.length.at.least', 1)
        })
    })
})

describe('Heat prices calculator', () => {
    before(() => {
        cy.visit('/savings-calculator/')
        cy.get(savings_calc_selectors.select_state).select('Ontario')
        cy.get(savings_calc_selectors.select_city).select('Toronto')
        cy.get(savings_calc_selectors.select_stories).select('2')
        cy.get(savings_calc_selectors.select_squarefeet).select('1250')
        cy.get(savings_calc_selectors.years).type('10{enter}')
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false
        })
    })

    it('Choosing each Current and New Heating type will change the Current/New Heating Cost and Savings', () => {
        cy.get(savings_calc_selectors.annual_heating_saving).as('annual')
        cy.get(savings_calc_selectors.extended_savings).as('extended')
        cy.get(savings_calc_selectors.total_annual_combined_saving).as('total')

        cy.get(savings_calc_selectors.current_heating_system).find('option').then(($chs) => {

            for (let chs_index = 1; chs_index < $chs.length; chs_index++) {
                cy.wrap($chs).parent().select(chs_index)
                cy.get(savings_calc_selectors.current_heating_cost).invoke('text').should('not.eq', "$0.00")

                cy.get(savings_calc_selectors.new_heating_system).find('option').then(($nhs) => {

                    for (let nhs_index = 1; nhs_index < $nhs.length; nhs_index++) {
                        cy.wrap($nhs).parent().select(nhs_index)
                        cy.get(savings_calc_selectors.new_heating_cost).invoke('text').should('not.eq', "$0.00")

                        let new_system = $nhs.eq(nhs_index).text()
                        let current_system = Cypress.$($chs[chs_index]).text()
                        if (current_system === new_system) {
                            cy.get('@total').invoke('text').should('eq', '$0.00')
                            cy.get('@extended').invoke('text').should('eq', '$0.00')
                            cy.get('@annual').invoke('text').should('eq', '$0.00')
                        } else {
                            cy.get('@total').invoke('text').should('not.eq', '$0.00')
                            cy.get('@extended').invoke('text').should('not.eq', '$0.00')
                            cy.get('@annual').invoke('text').should('not.eq', '$0.00')
                        }
                    }
                })
            }
        })
    })
})