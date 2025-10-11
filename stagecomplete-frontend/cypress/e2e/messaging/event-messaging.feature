Feature: Event Messaging System
  As a logged-in user (artist or venue)
  I want to be able to send and receive messages for my events
  So that I can communicate with my partners

  Background:
    Given I am logged in as an artist
    And I have an event with a venue

  Scenario: Send a message to venue
    When I go to the event messages page
    And I type "Bonjour, pouvons-nous discuter des détails techniques ?" in the message input
    And I click on send message button
    Then I should see the message in the conversation
    And the message should show my name
    And the message should have an unread indicator

  Scenario: Receive and read a message
    Given the venue has sent me a message "Bonjour, avez-vous besoin d'une table de mixage ?"
    When I go to the event messages page
    Then I should see the unread message count badge
    And I should see the venue's message in the conversation
    When I open the message
    Then the message should be marked as read automatically
    And the unread count should decrease by 1

  Scenario: Real-time message updates
    Given I am on the event messages page
    When the venue sends a new message
    Then I should see the new message appear automatically
    And I should see a notification
    And the message list should auto-scroll to bottom

  Scenario: Message with keyboard shortcut
    When I go to the event messages page
    And I type "Message rapide" in the message input
    And I press Ctrl+Enter
    Then the message should be sent
    And the input should be cleared

  Scenario: View unread messages count
    Given I have 3 unread messages in event A
    And I have 2 unread messages in event B
    When I go to the messages overview page
    Then I should see "5" in the total unread count badge
    And event A should show "3" unread messages
    And event B should show "2" unread messages

  Scenario: Empty conversation state
    Given I have an event with no messages
    When I go to the event messages page
    Then I should see "Aucun message"
    And I should see "Soyez le premier à envoyer un message"

  Scenario: Message validation
    When I go to the event messages page
    And I try to send an empty message
    Then the send button should be disabled
    When I type "   " (only spaces)
    Then the send button should still be disabled

  Scenario: Long message handling
    When I go to the event messages page
    And I type a message with 500 characters
    And I click on send message button
    Then the message should be sent successfully
    And the message should be wrapped correctly in the UI
