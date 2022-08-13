import React, { Component, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Container } from "react-bootstrap";
import swal from "sweetalert";

import "./App.css";
import { cards } from "./component/cardDeck";
import PlayGame from "./component/PlayGame"; //component to play the game
import StartGame from "./component/StartGame"; //component to start the game
import EndGame from "./component/EndGame"; //component to show the results of the game

//socket.io
// import io from "socket.io-client";
import { socket, SocketContext } from "./context/SocketContext";
// const socket = io.connect("http://localhost:3001");

const App = () => {
  const [funds, setFunds] = useState(100); //the player betting funds
  const [results, setResults] = useState(false); //when true, the results of the game is shown
  const [winLose, setWinLose] = useState("lose"); //state sent to the results component to show win, lose, or tie
  const [currentBet, setCurrentBet] = useState(5); //current player bet amount
  const [dealerStack, setDealerStack] = useState([]); //dealer hand, stack of cards
  const [player1Stack, setPlayer1Stack] = useState([]); //player1 hand, stack of cards
  const [player2Stack, setPlayer2Stack] = useState([]); //player2 hand, stack of cards
  const [dealerDeckTotal, setDealerDeckTotal] = useState(0); //dealer hand total
  const [player1DeckTotal, setPlayer1DeckTotal] = useState(0); //player1 hand total
  const [player2DeckTotal, setPlayer2DeckTotal] = useState(0); //player2 hand total
  const [players, setPlayers] = useState([]); //array of players
  const [playerName, setPlayerName] = useState(""); //array of players
  

  //called from the register button on the Start Game to register player in the game
  const registerPlayer = () => {
    console.log("registerPlayer", playerName);
    socket.emit("addUser", {
      name: playerName,
    });
    setPlayerName("");
  };

  // Alert thanking a player for playing
  const endGameAlert = () => {
    swal("Thank you for playing. Good luck next time");
    setFunds(100);
    setCurrentBet(5);
  };

  //Reset Bet amount for button on Results page
  const resetBetAmount = () => {
    setCurrentBet(5);
  };

  //At the beginning of the game the player is dealt 2 face up cards and the dealer one face up/one face down
  //All cards are dealt one at a time
  const dealCards = () => {
    dealACard(dealerStack, setDealerStack); //deal the dealer one card

    //update the dealer's hand total points
    setDealerDeckTotal(getCardPointsTotal(dealerStack));

    //deal the player a card and update the points
    setTimeout(() => {
      dealACard(player1Stack, setPlayer1Stack);
      setPlayer1DeckTotal(getCardPointsTotal(player1Stack));
    }, 1000);

    //deal the player a card and update the points
    setTimeout(() => {
      dealACard(player1Stack, setPlayer1Stack);
      setPlayer1DeckTotal(getCardPointsTotal(player1Stack));
    }, 2000);

    //deal the player a card and update the points
    setTimeout(() => {
      dealACard(player2Stack, setPlayer2Stack);
      setPlayer2DeckTotal(getCardPointsTotal(player2Stack));
    }, 3000);

    //deal the player a card and update the points
    setTimeout(() => {
      dealACard(player2Stack, setPlayer2Stack);
      setPlayer2DeckTotal(getCardPointsTotal(player2Stack));
    }, 4000);

    //deal the dealer a down card
    setTimeout(() => {
      const hand = dealerStack; //array to create dealer's hand of random cards
      hand.push(cards[0]);
      setDealerStack(hand);
    }, 5000);
  };

  //standard method for getting a random index of the cards array
  const randomCard = () => {
    return Math.floor(Math.random() * (cards.length - 1)) + 1;
  };

  //method use to add one card to either the player or dealer hand
  const dealACard = (stackOfCards, setStackOfCards) => {
    let hand = stackOfCards; //get the current array of card objects
    let cardNumber = randomCard(); //get a random card index number

    //check if card have been played already
    if (cards[cardNumber].played) {
      cardNumber = randomCard();
      cards[cardNumber].played = true;
    } else {
      cards[cardNumber].played = true;
    }

    hand.push(cards[cardNumber]); //add the card object from the cards array based on the index number
    setStackOfCards(hand); //update the current array of cards objects
  };

  //Get a sum of all cards worth and update the state
  const getCardPointsTotal = (deck) => {
    let total = 0;
    let foundAces = 0;

    //loop through each card adding the value to "total". Keep track of all values that is 11 to add up later
    for (var i = 0; i < deck.length; i++) {
      if (deck[i].value === 11) {
        //if the value is a 11, track it but don't add
        foundAces++;
      } else {
        total += deck[i].value; //add the value to total
      }
    }

    if (foundAces > 0) {
      //if the number of Aces is more then 0,
      for (var j = 0; j < foundAces; j++) {
        //loop through the number of Aces

        if (total + 11 > 21) {
          //if the total of all cards including the Ace is over 21, add the Ace as a 2
          total += 2;
        } else {
          total += 11; //if the total of all cards including the Ace is under 21, add the Ace as a 11
        }
      }
    }

    return total;
  };

  //method to increase the bet amount up to the fund limit. If the bet amount is greater then fund
  //then the bet amount start over at 5.
  const increaseBet = () => {
    if (currentBet >= funds) {
      setCurrentBet(5);
    } else {
      setCurrentBet(currentBet + 5);
    }
  };

  //called from the start button on the Start Game and Results component to start the game
  const startGame = () => {
    dealCards();
    setResults(false);
  };

  //Show the Results component
  const endGame = () => {
    let gameResults = "lose";

    //if the player has less then 21 but more then the dealer or the dealer has bust but the player has not then the player win
    if (
      (player1DeckTotal <= 21 && player1DeckTotal > dealerDeckTotal) ||
      (dealerDeckTotal > 21 && player1DeckTotal <= 21)
    ) {
      gameResults = "win1"; //return that the player won

      //player win the money bet
      setFunds(funds + currentBet);
    } else if (
      (player2DeckTotal <= 21 && player2DeckTotal > dealerDeckTotal) ||
      (dealerDeckTotal > 21 && player2DeckTotal <= 21)
    ) {
      gameResults = "win2"; //return that the player won

      //player win the money bet
      setFunds(funds + currentBet);
    } else if (
      player1DeckTotal === dealerDeckTotal &&
      player2DeckTotal === dealerDeckTotal
    ) {
      gameResults = "push"; //return that the game was tie
    } else {
      gameResults = "lose"; //return that the player lost

      //player lose the money bet
      setFunds(funds - currentBet);
    }
    //switch to the EndGame component with results of the game and reset player/dealer hands
    setResults(true);
    setPlayer1Stack([]);
    setPlayer2Stack([]);
    setDealerStack([]);
    setPlayer1DeckTotal(0);
    setPlayer2DeckTotal(0);
    setDealerDeckTotal(0);
  };

  //deals cards to the dealer till get a soft 17 or one card over
  const dealerHand = () => {
    let hand = dealerStack; //get the current dealer's hand
    hand.pop(); //uncover the card by removing the "cover" card

    let currentTotal = dealerDeckTotal; //get current sum of dealer's hand

    //Add card to the dealer hand as long as the sum of the dealer's and is less then or equal to 17
    do {
      dealACard(dealerStack); //deal the dealer one card

      //update the dealer's hand total points
      setDealerDeckTotal(getCardPointsTotal(dealerStack));

      //update currentTotal
      currentTotal = getCardPointsTotal(dealerStack);
    } while (currentTotal < 17);

    setTimeout(() => {
      endGame();
    }, 2000);
  };

  //Add a card to the player deck stack if the hand's sum is under or equal to 17
  const player1Hit = () => {
    //if hand's sum is under or equal to 17 add one card
    if (player1DeckTotal <= 17) {
      dealACard(player1Stack, setPlayer1Stack); //deal the player one card
    }

    //update the player's hand total points
    setPlayer1DeckTotal(getCardPointsTotal(player1Stack));

    //Bug Fixed: need a up to date total
    const currentTotal = getCardPointsTotal(player1Stack);

    //if hand's sum is greater then 17 then its the dealer turn
    if (currentTotal > 17) {
      dealerHand(); //get cards for the dealer
    }
  };

  const player2Hit = () => {
    //if hand's sum is under or equal to 17 add one card
    if (player2DeckTotal <= 17) {
      dealACard(player2Stack, setPlayer2Stack); //deal the player one card
    }

    //update the player's hand total points
    setPlayer2DeckTotal(getCardPointsTotal(player2Stack));

    //Bug Fixed: need a up to date total
    const currentTotal = getCardPointsTotal(player2Stack);

    //if hand's sum is greater then 17 then its the dealer turn
    if (currentTotal > 17) {
      dealerHand(); //get cards for the dealer
    }
  };

  //The player use their current points and allow the dealer to take a turn
  const playerStand = () => {
    dealerHand();
  };

  //The player double their bet (or go all in), receive one card, and end their turn.
  const player1DoubleDown = () => {
    dealACard(player1Stack, setPlayer1Stack); //deal the player one card

    //update the player's hand total points
    setPlayer1DeckTotal(getCardPointsTotal(player1Stack));

    //double the bet unless that amount is more then the player funds. If so, bet the entire funds amount
    if (currentBet * 2 > funds) {
      setCurrentBet(funds);
    } else {
      setCurrentBet(currentBet * 2);
    }

    dealerHand(); //Deal the dealer a hand
  };
  const player2DoubleDown = () => {
    dealACard(player2Stack, setPlayer2Stack); //deal the player one card

    //update the player's hand total points
    setPlayer2DeckTotal(getCardPointsTotal(player2Stack));

    //double the bet unless that amount is more then the player funds. If so, bet the entire funds amount
    if (currentBet * 2 > funds) {
      setCurrentBet(funds);
    } else {
      setCurrentBet(currentBet * 2);
    }

    dealerHand(); //Deal the dealer a hand
  };

  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Container>
          {results && <Redirect to="/end" />}
          <Route
            exact
            path="/"
            render={(props) => (
              <StartGame
                money={funds}
                start={startGame}
                addToBet={increaseBet}
                bet={currentBet}
                players={players}
                setPlayerName={setPlayerName}
                playerName={playerName}
                registerPlayer={registerPlayer}
              />
            )}
          />
          <Route
            path="/play"
            render={(props) => (
              <PlayGame
                money={funds}
                hit1={player1Hit}
                hit2={player2Hit}
                stand={playerStand}
                doubleDown1={player1DoubleDown}
                doubleDown2={player2DoubleDown}
                bet={currentBet}
                dealerTotal={dealerDeckTotal}
                player1Total={player1DeckTotal}
                player2Total={player2DeckTotal}
                dealerCards={dealerStack}
                player1Cards={player1Stack}
                player2Cards={player2Stack}
                players={players}
              />
            )}
          />
          <Route
            path="/end"
            render={(props) => (
              <EndGame
                gameResults={winLose}
                money={funds}
                start={startGame}
                bet={currentBet}
                addToBet={increaseBet}
                dealerTotal={dealerDeckTotal}
                player1Total={player1DeckTotal}
                player2Total={player2DeckTotal}
                playerLeave={endGameAlert}
                resetBet={resetBetAmount}
                players={players}
              />
            )}
          />
        </Container>
      </Router>
    </SocketContext.Provider>
  );
};
export default App;
