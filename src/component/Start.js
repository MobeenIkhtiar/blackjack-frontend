import React, {useState, useEffect, useContext} from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, Redirect  } from "react-router-dom";

import "../App.css";
import { SocketContext } from "../context/SocketContext";
import PrimaryButton from "./PrimaryButton";

export default function Start(props) {
  const [pulseAnimation, setPulse] = useState("");
  const [players, setPlayers] = useState([]);
  const [readyPlayers, setReadyPlayers] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    setTimeout(() => {
      setPulse("")
    }, 1000);
  });

  useEffect(() => {
    socket.on('getUsers', (data) => {
      console.log("data");
      console.log(data);
      setPlayers(data);
      console.log("players");
    });
    console.log(players);
  });

  useEffect(() => {
    socket.on('getReadyUsers', (data) => {
      console.log("data");
      console.log(data);
      if(data.length===2){
        setReadyPlayers(true);
        props.start();
      }
    });
  },[socket, props]);

  const registerPlayer = () => {
    console.log("registerPlayer", props.playerName);
    socket.emit("addUser", {
      name: props.playerName,
    });
    props.setPlayerName("");
  };

  const readyPlayer = () => {
    socket.emit("userReady", socket.id);
  };

  return (
    <Container className="appBackgroundColor primaryColor center whiteSpaceUnderNav startScreenHeightBugFix">
      <Row className="whitespaceBetweenNavStartTite">
        <Col>
          <h3>Let's Play</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <h1>Black Jack</h1>
        </Col>
      </Row>
      <Row>
        <Col
          className={`redCheque ${pulseAnimation}`}
          onClick={() => {
            props.addToBet();
            setPulse("pulseWhenClicked");
          }}
          xs={{ span: 9, offset: 1 }}
          sm={{ span: 8, offset: 2 }}
          md={{ span: 6, offset: 3 }}
          lg={{ span: 6, offset: 3 }}
          xl={{ span: 6, offset: 3 }}
        >
          ${props.bet}
        </Col>
      </Row>
      <Row>
        <Col>
          Click the chip to increase your bet, in increments of $5, up to your
          bank amount of ${props.money}
        </Col>
      </Row>
      {
        players.length <2 &&
        <Row>
          <Col>
            <input type={"text"} placeholder="Player Name..." value={props.playerName} onChange={(e)=>props.setPlayerName(e.target.value)}/>
            <PrimaryButton
              size="largeButtonSize"
              title="Register"
              action={registerPlayer}
            />
          </Col>
        </Row>
      }
      {
        players.length === 2 &&
        <Row>
          <Col>
              <PrimaryButton
                size="largeButtonSize"
                title="Let's Play"
                action={readyPlayer}
              />
          </Col>
        </Row>
      }
      {
        readyPlayers &&
        <Redirect to="/play"/>
      }
    </Container>
  );
}
