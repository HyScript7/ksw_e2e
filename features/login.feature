Feature: The Internet Guinea Pig Website
  Scenario Outline: Successful login with valid credentials
    Given I am on the login page
    When I login with <username> and <password>
    Then the inventory page should be loaded

    Examples:
      | username      | password     |
      | standard_user | secret_sauce |

  Scenario Outline: Login fails when user is locked out
    Given I am on the login page
    When I login with <username> and <password>
    Then I should see a flash message saying "Epic sadface: Sorry, this user has been locked out."

    Examples:
      | username        | password     |
      | locked_out_user | secret_sauce |

  Scenario Outline: Login fails when username is missing
    Given I am on the login page
    When I login with <username> and <password>
    Then I should see a flash message saying "Epic sadface: Username is required"

    Examples:
      | username | password     |
      |          | secret_sauce |

  Scenario Outline: Login fails when password is missing
    Given I am on the login page
    When I login with <username> and <password>
    Then I should see a flash message saying "Epic sadface: Password is required"

    Examples:
      | username      | password |
      | standard_user |          |

  Scenario Outline: Login fails with invalid credentials
    Given I am on the login page
    When I login with <username> and <password>
    Then I should see a flash message saying "Epic sadface: Username and password do not match any user in this service"

    Examples:
      | username         | password |
      | nonexistent_user | foobar   |

  Scenario Outline: User can add items to cart and checkout
    Given I am on the login page
    When I login with standard_user and secret_sauce
    Then the inventory page should be loaded
    When I add "Sauce Labs Backpack" to the cart
    And I go to the shopping cart
    Then I should be on the cart page
    And the cart should contain a product named "Sauce Labs Backpack"
    When I click Checkout
    And I fill in the checkout form with "Jane", "Doe" and "12345"
    And I click Continue on the checkout information page
    Then I should be on the checkout overview page
    And the order summary should contain 1 item
    And the numeric order total should equal the subtotal plus tax
    When I click Finish on the checkout overview page
    Then I should be on the checkout complete page
    And the order confirmation header should say "Thank you for your order!"
    And the cart should be empty after checkout

    Examples:
      | a |
      | a |

  Scenario Outline: Login and logout
    Given I am on the login page
    When I login with standard_user and secret_sauce
    Then the inventory page should be loaded
    When I logout via the menu
    Then I should be on the login page

    Examples:
      | a |
      | a |