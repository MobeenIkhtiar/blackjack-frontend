import React from "react";
import { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";

import "../App.css";
import { SocketContext } from "../context/SocketContext";
import CardArea from "./CardArea";
import PrimaryButton from "./PrimaryButton";

function ButtonChoice(props) {
  return (
    <Row>
      <Col xs={4}>
        <PrimaryButton
          size="smallButtonSize"
          title={props.title}
          action={props.action}
        />
      </Col>
      <Col xs={8}>
        <p className="instructionText">{props.text}</p>
      </Col>
    </Row>
  );
}

export default function PlayArea(props) {
  const socket = useContext(SocketContext);
  return (
    <Container className="appBackgroundColor">
      {
        props.players.length===2 &&
        <div>
          <Row>
            <Col 
              xs={{span:12}}
              sm={{span:8, offset:2}}
            >
              <CardArea
                bgColor="dealerAreaColor"
                cardsGiven={props.dealerCards}
                total={props.dealerTotal}
                tableTitle="Dealer"
              />
              <CardArea
                bgColor="playerAreaColor"
                cardsGiven={props.player1Cards}
                total={props.player1Total}
                tableTitle={props.players[0].name}
              />
              <CardArea
                bgColor="playerAreaColor"
                cardsGiven={props.player2Cards}
                total={props.player2Total}
                tableTitle={props.players[1].name}
              />
            </Col>
          </Row>
          <Row>
            <Col
              xs={{span:12}}
              sm={{span:8, offset:2}}        
            >
              {(props.player1Total < 17 || props.player2Total < 17) && (
                <ButtonChoice
                  title="Hit"
                  action={props.hit}
                  text={"Get another card. If your new total is over 21, you lose!"}
                />
              )}

              <ButtonChoice
                title="Stand"
                action={props.stand}
                text={props.players[0].id === socket.id ? "Click to end your turn. The Player 2 starts drawing cards!" : "Click to end your turn. The Dealer starts drawing cards!"}
              />

              {((props.player1Total >= 17 && props.dealerCards.length <3 && props.player1Cards.length === 2) || (props.player2Total >= 17 && props.dealerCards.length <3 && props.player2Cards.length === 2)) && (
                <p className="primaryColor whiteSpaceUnderNav">You must stand if your total is greater then 17.</p>
              )
              }

              {(props.player1Total < 17 || props.player2Total < 17) && (
                <ButtonChoice
                  title={"Double Down"}
                  action={props.doubleDown}
                  text={"Double your bet, get one card, and the dealer turn starts!"}
                />
              )}
            </Col>
          </Row>
          {/* <Row>
          <Col
              xs={{span:12}}
              sm={{span:8, offset:2}}        
            >
              {props.player2Total < 17 && (
                <ButtonChoice
                  title="Hit 2"
                  action={props.hit2}
                  text={"Get another card. If your new total is over 21, you lose!"}
                />
              )}

              <ButtonChoice
                title="Stand 2"
                action={props.stand}
                text={"Click to end your turn. The dealer starts drawing cards!"}
              />

              {props.player2Total >= 17 && props.dealerCards.length <3 && props.player2Cards.length === 2 && (
                <p className="primaryColor whiteSpaceUnderNav">You must stand if your total is greater then 17.</p>
              )

              }

              {props.player2Total < 17 && (
                <ButtonChoice
                  title={"Double Down 2"}
                  action={props.doubleDown2}
                  text={"Double your bet, get one card, and the dealer turn starts!"}
                />
              )}
            </Col>
          </Row> */}
        </div>
      }
    </Container>
  );
}
