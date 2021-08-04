Feature: Tutorial
  In order to complete a tutorial section
  As a TestDrive user
  I need to be able to click through the tutorial boxes
  Then be able to go to the next page of the module

  Scenario Outline: Completing a standard tutorial section
    Given I have started the module <module>
    And I am on the page <page> of <module>
    When I click through any tutorial boxes
    Then I should be taken to <nextPage>

    Examples:
      | module             | page      | nextPage  |
      | accounts           | tutorial2 | sim       |
      | cyberbullying      | tutorial  | tut_guide |
      | digfoot            | tutorial  | sim       |
      | "digital-literacy" | tutorial  | tut_guide |
      | esteem             | tutorial  | sim       |
      | habits             | tutorial  | sim       |
      | phishing           | tutorial  | tut_guide |
      | presentation       | tutorial  | sim       |
      | privacy            | tutorial  | sim       |
      | "safe-posting"     | tutorial  | tut_guide |
      | targeted           | tutorial  | tut_guide |

  Scenario: Completing the accounts module tutorial section
    Given I have started the module "accounts"
    And I am on the page "tutorial" of "accounts"
    When I click through any tutorial boxes
    Then The button "id" "continueTutorial" should turn green
    When I click "id" "continueTutorial"
    Then I should be taken to "tutorial2"

  Scenario: Progressing through the advancedlit module tutorial section
    Given I have started the module "advancedlit"
    And I am on the page "tutorial" of "advancedlit"
    When I click through any tutorial boxes
    When I click "css" ".ui.tab.active .ui.card.articleCard .articleImage"
    When I click through any tutorial boxes
    When I click "css" ".ui.tab.active .ui.big.button.searchTab"
    When I click through any tutorial boxes
    When I click "css" ".ui.tab.active .ui.big.button.homeTab"
    When I click through any tutorial boxes
    Then I should be taken to "sim"
