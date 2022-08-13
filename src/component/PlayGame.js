import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import "../App.css";
import Nav from "./Nav";
import PlayArea from "./PlayArea";

export default function PlayGame(props) {
  return (
    <Container>
      <Row>
        <Col>
          <Nav money={props.money} bet={props.bet} />
          <PlayArea
            hit={props.hit}
            stand={props.stand}
            doubleDown={props.doubleDown}
            dealerCards={props.dealerCards}
            player1Cards={props.player1Cards}
            player2Cards={props.player2Cards}
            player1Total={props.player1Total}
            player2Total={props.player2Total}
            dealerTotal={props.dealerTotal}
            players={props.players}
          />
        </Col>
      </Row>
    </Container>
  );
}
