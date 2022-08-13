import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import "../App.css";
import Nav from "./Nav";
import Results from "./Results";

export default function EndGame(props) {
  return (
    <Container>
      <Row>
        <Col>
          <Nav money={props.money} bet={props.bet} />
          <Results
            player1Total={props.player1Total}
            player2Total={props.player2Total}
            gameResults={props.gameResults}
            start={props.start}
            addToBet={props.addToBet}
            bet={props.bet}
            pulse={props.pulse}
            clickToPulse={props.clickToPulse}
            dealerTotal={props.dealerTotal}
            money={props.money}
            playerLeave = {props.playerLeave}
            resetBet = {props.resetBet}
            players={props.players}
          />
        </Col>
      </Row>
    </Container>
  );
}
