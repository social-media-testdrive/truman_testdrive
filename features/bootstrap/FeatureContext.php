<?php

use Behat\Behat\Tester\Exception\PendingException;
use Behat\Behat\Context\Context;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;

/**
 * Defines application features from the specific context.
 */
class FeatureContext implements Context
{
    private $driver;
    private $session;
    private $page;
    private static $homeUrl = "http://localhost:3000/";

    public function __construct()
    {
        $this->driver = new \Behat\Mink\Driver\Selenium2Driver('chrome');
        $this->session = new \Behat\Mink\Session($this->driver);
        // start the session
        $this->session->start();
        $this->session->visit(FeatureContext::$homeUrl);
    }

    // Reference for these scroll functions:
    // https://pauledenburg.com/behat-element-not-clickable-point-xxxx/
    public function scrollDotIntoView($number)
    {
        $function = <<<JS
    (
        function(){
          let elem = $('.introjs-hint[data-step=$number]');
          $('html, body').animate({scrollTop:elem.offset().top - 500});
        }
    )()
    JS;
        try {
            $this->session->executeScript($function);
        } catch (Exception $e) {
            throw new \Exception("ScrollIntoView failed");
        }
    }

    public function scrollElementIntoView($id)
    {
        $function = <<<JS
    (
        function(){
          let elem = $('$id');
          $('html, body').animate({scrollTop:elem.offset().top - 500});
        }
    )()
    JS;
        try {
            $this->session->executeScript($function);
        } catch (Exception $e) {
            throw new \Exception("ScrollIntoView failed");
        }
    }

    /** @AfterScenario */
    public function after($event)
    {
        // Go to the end page and click "finish module" to delete the temporary account.
        $myURL = parse_url($this->session->getCurrentUrl());
        $paths = explode("/", $myURL["path"]);
        $currentMod = $paths[2];
        $destination = FeatureContext::$homeUrl . "end/${currentMod}";
        $this->session->visit($destination);
        $this->page->find('css', '.finish')->click();
        sleep(2);
        $this->session->stop();
    }

    /**
    * @Given I have started the module :modName
    */
    public function iHaveStartedTheModule($modName)
    {
        $this->page = $this->session->getPage();
        $searchResult = $this->page->find("xpath", "//a[contains(@href,'/guest/${modName}')]");
        $searchResult->click();
        $myURL = parse_url($this->session->getCurrentUrl());
        if (strcmp(($myURL["path"]), "/intro/${modName}") !== 0) {
            throw new Exception("Wrong module.");
        }
    }

    /**
    * @Given I am on the page :page of :module
    */
    public function iAmOnThePage($page, $module)
    {
        $destination = FeatureContext::$homeUrl . "${page}/${module}";
        $this->session->visit($destination);
        $myURL = parse_url($this->session->getCurrentUrl());
        $paths = explode("/", $myURL["path"]);
        if (strcmp(($paths[1]), $page) !== 0) {
            throw new Exception("Wrong page.");
        }
        if (strcmp(($paths[2]), $module) !== 0) {
            throw new Exception("Wrong module.");
        }
    }

    /**
     * @When I click through any tutorial boxes
     */
    public function iClickThroughTutorial()
    {
        if ($this->page->find('css', '.introjs-tooltip') !== null) {
            while ($this->page->find('css', '.introjs-nextbutton:not(.introjs-hidden)')) {
                $this->page->find('css', '.introjs-nextbutton')->click();
                sleep(1);
            }
            # waiting a bit for last box to animate and open
            # TODO: find a better way to do this?
            sleep(1);
            $this->page->find('css', '.introjs-donebutton')->click();
        }
    }

    /**
     * @Then there are :dotCount visible blue dots
     */
    public function thereAreVisibleDots($dotCount)
    {
        # wait a bit for the dots to load
        # TODO: find a better way to do this? Also, need to actually check for visibility (->isVisible())
        sleep(3);
        $visibleDotCount = $this->page->findAll('css', '.introjs-hint');
        if (count($visibleDotCount) != $dotCount) {
            throw new Error("Mismatched number of dots.");
        }
    }

    /**
     * @When I click and close all of the dots
     */
    public function iClickAndCloseAllBlueDots()
    {
        $blueDotArray = $this->page->findAll('css', '.introjs-hint');
        foreach ($blueDotArray as $blueDot) {
            $dataNumberAttr = $blueDot->getAttribute('data-step');
            $this->scrollDotIntoView($dataNumberAttr);
            sleep(1);
            $blueDot->click();
            $this->page->find('css', '.introjs-button')->click();
            sleep(1);
        }
    }

    /**
     * @When I fill in the :fieldName field with the text :stringInput
     */
    public function iFillInTheField($fieldName, $stringInput)
    {
        $inputField = $this->page->findField($fieldName);
        $inputField->setValue($stringInput);
    }

    /**
     * @Then the button :idType :button should turn green
     */
    public function continueTurnsGreen($idType, $button)
    {
        // Assume that the first match will suffice. Keep this in mind when
        // writing the feature definition.
        if ($idType === "id") {
            $element = $this->page->find('named', array('id',$button));
            if (!$element->hasClass('green')) {
                throw new Error("The button did not turn green.");
            }
        } elseif ($idType === "css") {
            $element = $this->page->find('css', $button);
            if (!$element->hasClass('green')) {
                throw new Error("The button did not turn green.");
            }
        }
    }

    /**
     * @When I click :idType :button
     */
    public function iClickButton($idType, $button)
    {
        if ($idType === "id") {
            $this->scrollElementIntoView("#${button}");
            sleep(1);
            $this->page->find('named', array('id',$button))->click();
            sleep(2);
        } elseif ($idType === "css") {
            $this->scrollElementIntoView("${button}");
            sleep(1);
            $this->page->find('css', $button)->click();
            sleep(2);
        }
    }

    /**
     * @When I select :option from dropdown :idType :id
     */
    public function iSelectOptionFromDropdown($option, $idType, $id)
    {
        if ($idType === "id") {
            $this->scrollElementIntoView("#${id}");
            sleep(1);
            $dropdown = $this->page->find('named', array('id',$id));
        } elseif ($idType === "css") {
            $this->scrollElementIntoView("${id}");
            sleep(1);
            $dropdown = $this->page->find('css', $id);
        }
        $dropdown->click();
        $dropdown->find('css', ".item[data-value=${option}]")->click();
        sleep(1);
    }

    /**
     * @Given I am on :arg1
     */
    public function iAmOn($arg1)
    {
        $this->page = $this->session->getPage();
    }

    /**
     * @When I press a card for :arg1
     */
    public function iPressACardFor($arg1)
    {
        $linkName = "/guest/${arg1}";
        $searchResult = $this->page->find("xpath", "//a[contains(@href,'/guest/${arg1}')]");
        $searchResult->click();
    }

    /**
     * @Then I should be taken to :page
     */
    public function iShouldBeTakenTo($page)
    {
        $myURL = parse_url($this->session->getCurrentUrl());
        $pathComponent = explode('/', $myURL["path"]);
        if (strcmp($pathComponent[1], $page) !== 0) {
            throw new Exception("Taken to the wrong page.");
        }
        #$this->session->stop();
    }
}
