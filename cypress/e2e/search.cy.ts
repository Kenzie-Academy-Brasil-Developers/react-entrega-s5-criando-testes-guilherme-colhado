context("Register", () => {
  it("Enters the home page", () => {
    cy.visit('http://localhost:3000')
    cy.viewport(1400,900)
    cy.contains("Busca de endereço");
  })

  it("Tries to search a cep", () => {
    cy.viewport(1400,900)
        
    cy.intercept("GET", "/08452280", {
      statusCode: 200}).as("search cep");

    cy.get("input").type("08452280");
    cy.get("button").click();

    cy.get('input[value="Rua Homero de Sousa Campos"]')
  })
})
