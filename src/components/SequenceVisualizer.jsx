import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Canvas, } from 'react-three-fiber';

import HandsLeap from './OnlineLeapVisualizer';
import '../App.css';

import { Row, Col, Container, Form, Card } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';



function SequenceVisualizer() {
  const [stride, setStride] = React.useState(2);
  const [windowSize, setWindowSize] = React.useState(10);
  const [energy, setEnergy] = React.useState(false);
  const [isLeapMotionConnected, setIsLeapMotionConnected] = React.useState(true);
  const toggleLeapConnected = (isLeapConnected) => {
    if (isLeapConnected === isLeapMotionConnected) { return }
    setIsLeapMotionConnected(isLeapConnected)
  }
  return (
    <div className="App">

      <Container style={{ paddingTop: "80px", paddingLeft: "40px", paddingRight: "40px" }} fluid>
        <Row>
          <Col xs={2} style={{ display: "flex", height: "100%" }}>
            <Card style={{ width: '23rem', padding: 8, backgroundColor: "#3D3D3D", alignItems: "center" }} >
              <Card.Body>
                <Card.Title>Configuration</Card.Title>

                <Row style={{ marginBottom: 10, }}>
                  <Form.Label>Sliding window size</Form.Label>

                  <Col xs="8">
                    <RangeSlider
                      value={windowSize}
                      min={10}
                      max={100}
                      onChange={changeEvent => {
                        setWindowSize(changeEvent.target.value)

                        if (stride > windowSize) {
                          setStride(windowSize)
                        }
                      }}
                    />
                  </Col>
                  <Col xs="4">
                    <Form.Control value={windowSize} />
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10, }}>
                  <Form.Label>Stride</Form.Label>

                  <Col xs="8">
                    <RangeSlider
                      value={stride}
                      min={1}
                      max={windowSize}
                      onChange={changeEvent => setStride(changeEvent.target.value)}
                    />
                  </Col>
                  <Col xs="4">
                    <Form.Control value={stride} />
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10, paddingLeft: 20, }}>


                  <Form.Check
                    type={"checkbox"}
                    label="Energy"
                    id={`disabled-default-checkbox`}
                    onChange={changeEvent => setEnergy(changeEvent.target.value)}
                  />




                </Row>
              </Card.Body>
            </Card>

          </Col>
          <Col xs={7} style={{ height: "100%" }}>
            {/* {
              !isLeapMotionConnected ? (
                <Card style={{ width: '100%', padding: 8, backgroundColor: "#3D3D3D", alignItems: "center" }} >
                <Card.Body>
  
                  <Card.Text>
                    Your leapmotion is not connected
                  </Card.Text>
                </Card.Body>
              </Card>
              ):
              ( */}
            <Canvas
              camera={{
                fov: 75,
                aspect: 2,
                near: 0.1,
                far: 1000,
                position: [0, 200, 200],
                rotation: [-1, 0, 0]
              }}
              style={{
                width: "100%",
                height: "80vh"
              }}
            >
              <color attach="background" args={["#050505"]} />
              <mesh position={[0, 0, -10]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial color="red" />
              </mesh>
              <HandsLeap toggleLeapConnected={toggleLeapConnected} />
            </Canvas>
            {/* )
            } */}


          </Col>
          <Col xs={3} style={{ height: "100%" }}>
            <Card style={{ width: '100%', padding: 8, backgroundColor: "#3D3D3D", alignItems: "center", marginBottom: 10 }} >
              <Card.Body>
                <Card.Title>Result</Card.Title>
                <Card.Text>
                  Left
                </Card.Text>
              </Card.Body>
            </Card>
            <Card style={{ width: '100%', padding: 8, backgroundColor: "#3D3D3D", alignItems: "center" }} >
              <Card.Body>
                <Card.Title>Robot simulator</Card.Title>
                <Card.Text>
                  Coming soon
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Card style={{ width: '200px', padding: 8, backgroundColor: "#3D3D3D", alignItems: "center", position: "absolute", right: 0, bottom: 0 }} >
          <Card.Body>
            <Card.Title>RRC V1 </Card.Title>
          </Card.Body>
        </Card>
      </Container>

    </div>
  );
}

export default SequenceVisualizer;
