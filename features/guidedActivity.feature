Feature: Guided Activity
  In order to complete a guided activity section
  Within any module
  As a TestDrive user
  I need to click though all of the blue dots
  And complete any additional requirements
  Before being allowed to navigate to the next section

  Scenario Outline: Progressing through a standard guided activity page with no additional requirements
    Given I have started the module <module>
    And I am on the page <page> of <module>
    When I click through any tutorial boxes
    Then there are <n> visible blue dots
    When I click and close all of the dots
    Then The button <idType> <button> should turn green
    When I click <idType> <button>
    Then I should be taken to <nextPage>

    Examples:
      | module        | page | n | idType | button           | nextPage |
      | accounts      | sim2 | 2 | id     | cyberTransButton | trans    |
      | advancedlit   | sim2 | 4 | css    | .searchTab       | sim3     |
      | advancedlit   | sim3 | 2 | css    | .articleTab      | sim4     |
      | advancedlit   | sim4 | 3 | css    | .continueButton  | trans    |
      | cyberbullying | sim  | 4 | id     | cyberTransButton | trans    |
      | digfoot       | sim  | 5 | id     | cyberTransButton | trans    |
      | "digital-literacy" | sim | 4 | id | cyberTransButton | trans    |
      | esteem        | sim  | 4 | id     | cyberTransButton | trans    |
      | phishing      | sim  | 4 | id     | cyberTransButton | trans    |
      | presentation  | sim  | 1 | id     | cyberTransButton | sim1     |
      | presentation  | sim1 | 3 | id     | cyberTransButton | sim2     |
      | presentation  | sim2 | 3 | id     | cyberTransButton | trans    |
      | targeted      | sim  | 5 | id     | cyberTransButton | trans    |
      | privacy | "free-play"  | 3 | id | cyberTransButton | "free-settings" |
      | privacy | "free-play2" | 2 | id | cyberTransButton | "free-settings3" |
      | privacy | "free-play4" | 2 | id | cyberTransButton | "free-settings2" |
      | privacy | "free-play3" | 3 | id | cyberTransButton | results |


  Scenario Outline: Completing a standard guided activity section which doesn't have a green continue button
    Given I have started the module <module>
    And I am on the page <page> of <module>
    When I click through any tutorial boxes
    Then there are <n> visible blue dots
    When I click and close all of the dots
    When I click <idType> <button>
    Then I should be taken to <nextPage>

    Examples:
      | module        | page | n | idType | button              | nextPage |
      | advancedlit   | sim  | 1 | css    | .articleClickable   | sim2     |
      | habits        | sim  | 2 | id     | cyberTransButton    | sim2     |
      | habits        | sim2 | 2 | css    | .settingsButton     | sim3     |
      | habits        | sim3 | 2 | css    | .activityButton     | sim4     |
      | habits        | sim4 | 4 | id     | cyberTransButton    | trans    |
      | privacy       | sim  | 5 | id     | cyberTransButton    | trans    |
      | "safe-posting" | sim | 2 | css    | ".introjs-donebutton" | trans    |

  # ****************************************************************************
  # Scenarios involving "additional requirements" besides clicking all blue dots
  # ****************************************************************************

  Scenario: Completing part one the accounts module guided activity
    Given I have started the module "accounts"
    And I am on the page "sim" of "accounts"
    When I click through any tutorial boxes
    Then there are "3" visible blue dots
    When I click and close all of the dots
    And I fill in the "input1" field with the text "testUsername"
    And I fill in the "password" field with the text "testPassword"
    Then The button "id" "cyberTransButton" should turn green
    When I click "id" "cyberTransButton"
    Then I should be taken to "sim2"

  Scenario: Completing the first interactive settings page of the privacy module
    Given I have started the module "privacy"
    And I am on the page "free-settings" of "privacy"
    When I click through any tutorial boxes
    Then there are "3" visible blue dots
    When I click and close all of the dots
    And I click "id" "locationCue1"
    And I select "2" from dropdown "id" "locationCue2"
    Then The button "id" "cyberTransButton" should turn green
    When I click "id" "cyberTransButton"
    Then I should be taken to "free-play2"

  Scenario: Completing the second interactive settings page of the privacy module
    Given I have started the module "privacy"
    And I am on the page "free-settings3" of "privacy"
    When I click through any tutorial boxes
    Then there are "3" visible blue dots
    When I click and close all of the dots
    And I click "id" "tagCue1"
    And I click "id" "tagCue2"
    Then The button "id" "cyberTransButton" should turn green
    When I click "id" "cyberTransButton"
    Then I should be taken to "free-play4"

  Scenario: Completing the third interactive settings page of the privacy module
    Given I have started the module "privacy"
    And I am on the page "free-settings2" of "privacy"
    When I click through any tutorial boxes
    Then there are "3" visible blue dots
    When I click and close all of the dots
    And I click "id" "privateAccountCue"
    Then The button "id" "cyberTransButton" should turn green
    When I click "id" "cyberTransButton"
    Then I should be taken to "free-play3"
