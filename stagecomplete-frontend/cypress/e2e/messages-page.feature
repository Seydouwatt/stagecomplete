Feature: Messages Page
  As an artist or venue
  I want to use the messages page
  So that I can communicate about confirmed events

  Background:
    Given the application is accessible
    And the backend services are running

  Scenario: Artist views messages page with conversations
    Given I am logged in as an artist
    And I have 3 confirmed events with different venues
    When I navigate to "/messages"
    Then I should see the page title "Messages"
    And I should see 3 conversation cards
    And Each conversation card should display:
      | Element         | Present |
      | Venue name      | Yes     |
      | Event date      | Yes     |
      | Location        | Yes     |
      | Message count   | Yes     |
      | Status icon     | Yes     |

  Scenario: Empty messages page for new artist
    Given I am logged in as a new artist with no events
    When I navigate to "/messages"
    Then I should see "Aucune conversation"
    And I should see "Les conversations avec les venues apparaîtront ici une fois que vous aurez accepté des demandes de booking"

  Scenario: Opening a conversation thread
    Given I am logged in as an artist
    And I have a confirmed event "Jazz Night" with venue "Blue Note"
    When I navigate to "/messages"
    And I click on the conversation with "Blue Note"
    Then I should see the message thread view
    And I should see "Jazz Night" in the header
    And I should see event details:
      | Detail   | Value      |
      | Venue    | Blue Note  |
      | Date     | Event date |
      | Location | Event location |
    And I should see a back button

  Scenario: Sending a message in a thread
    Given I am in a message thread for event "Rock Festival"
    When I type "Merci pour cette opportunité!" in the message input
    And I press Enter
    Then I should see my message in the thread
    And the message should be aligned to the right
    And the message should show the current time
    And the input should be cleared

  Scenario: Receiving messages in real-time
    Given I am in a message thread with a venue
    When the venue sends me a message "Pouvez-vous arriver 30 minutes plus tôt?"
    Then I should see the message appear in the thread within 5 seconds
    And the message should be aligned to the left
    And I should see the venue's name on the message

  Scenario: Message thread auto-scroll
    Given I am in a message thread with 50 previous messages
    When I open the conversation
    Then the view should scroll to the bottom automatically
    When a new message arrives
    Then the view should scroll to show the new message

  Scenario: Venue views messages page
    Given I am logged in as a venue
    And I have 2 confirmed events with different artists
    When I navigate to "/messages"
    Then I should see 2 conversation cards
    And each card should show the artist's name
    And I should see "Communiquez avec les artistes pour vos événements"

  Scenario: Navigating back from thread to list
    Given I am in a message thread
    When I click the back button
    Then I should return to the messages list
    And I should see all my conversations

  Scenario: Message status indicators
    Given I am logged in as an artist
    And I have events with different statuses:
      | Event           | Status    |
      | Jazz Night      | CONFIRMED |
      | Rock Concert    | TENTATIVE |
      | Blues Evening   | CANCELLED |
    When I navigate to "/messages"
    Then I should see status icons for each conversation:
      | Event         | Icon Color |
      | Jazz Night    | Green      |
      | Rock Concert  | Yellow     |
    And "Blues Evening" should not appear in the list

  Scenario: Unread message badge
    Given I am logged in as an artist
    And I have 3 unread messages in "Jazz Night" conversation
    When I navigate to "/messages"
    Then I should see a badge with "3" on the "Jazz Night" conversation
    When I open the conversation
    Then the unread badge should disappear

  Scenario: Search and filter conversations
    Given I am logged in as an artist with 10 conversations
    When I navigate to "/messages"
    And I search for "Blue Note"
    Then I should only see conversations with "Blue Note" venue
    When I clear the search
    Then I should see all 10 conversations again

  Scenario: Message input features
    Given I am in a message thread
    Then the message input should have a placeholder "Écrivez votre message..."
    When I type a very long message exceeding 1000 characters
    Then I should see a character counter
    And the send button should be disabled after 1000 characters
    When I press Shift+Enter
    Then a new line should be added to the message