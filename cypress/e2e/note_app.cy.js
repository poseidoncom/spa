describe('Note ', function() {

  beforeEach(function () {
    cy.visit('http://localhost:3000')
  })


  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2022')
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
  })

  it('user can login', function () {
    cy.contains('login').click()
    cy.get('#username').type('tuukka')
    cy.get('#password').type('salasana')
    cy.get('#login-button').click()

    cy.contains('Tuukka Hartikainen logged in')
  })

  it.only('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('tuukka')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Tuukka Hartikainen logged in')
  })
})