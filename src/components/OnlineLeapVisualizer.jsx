import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Canvas, } from 'react-three-fiber';

import '../App.css';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, } from 'react-three-fiber';
import { Row, Col, Container, Form, Card } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import { useNavigate } from 'react-router-dom';
import LeapMotion from '../leap/LeapMotion';
import { predict_window } from '../api';
function HandsLeap ({windowSize, setLabel}) {

  let meshRef = useRef();
  let handsRef = useRef();
  let lineRef = useRef();
  // console.log(require('./textures/sprites/disc.png'))
  // const disc = useLoader(THREE.TextureLoader,'./textures/sprites/disc.png' ) 
  // console.log(disc)
  const leapMotion = new LeapMotion();

  leapMotion.addEventListener('deviceConnected', function() {
    console.log("A Leap device has been connected.");
    // toggleLeapConnected(true)
  });
  leapMotion.addEventListener('deviceDisconnected', function() {
    console.log("A Leap device has been connected.");
    // toggleLeapConnected(false)
  });
  leapMotion.framesLength = 10;
  leapMotion.addEventListener("open", evt => {
    console.log(leapMotion, handsRef.current)
    
  });
  
  leapMotion.open();
  let positions = [];
  let frames= [];
  let framePositions= [];
  let colors = [];
  function createCanvasMaterial(color, size) {
    var matCanvas = document.createElement('canvas');
    matCanvas.width = matCanvas.height = size;
    var matContext = matCanvas.getContext('2d');
    // create exture object from canvas.
    var texture = new THREE.Texture(matCanvas);
    // Draw a circle
    var center = size / 2;
    matContext.beginPath();
    matContext.arc(center, center, size/2, 0, 2 * Math.PI, false);
    matContext.closePath();
    matContext.fillStyle = color;
    matContext.fill();
    // need to set needsUpdate
    texture.needsUpdate = true;
    // return a texture made from the canvas
    return texture;
  }
  useFrame(() => {
      // const a=syncReadFile('./seq.txt');
      // console.log(a)
      
      if (leapMotion !== undefined) {
        const frame = leapMotion.frame;
      if (frame !== undefined) {
        if (frame.hands.length > 0) {
          meshRef.current.visible = true

          frame.hands.forEach(hand => {
            /*positions.push(...hand.elbow.toArray());
            colors.push(1, 1, 1);

            positions.push(...hand.wrist.toArray());
            colors.push(1, 1, 1);*/


            framePositions.push(hand.palm.position.toArray());
            hand.fingers.forEach((finger, idx) => {
              // positions.push(...finger.carpPosition.toArray());
              // colors.push(1, 1, 1);
              framePositions.push(finger.mcpPosition.toArray());
              framePositions.push(finger.pipPosition.toArray());
              if (idx != 0){
                framePositions.push(finger.dipPosition.toArray());
              }
              framePositions.push(finger.btipPosition.toArray());
              positions.push(...hand.palm.position.toArray());
              colors.push(0, 153 / 255, 1);
              positions.push(...finger.mcpPosition.toArray());
              colors.push(1, 1, 1);
              positions.push(...finger.mcpPosition.toArray());
              colors.push(1, 1, 1);
              positions.push(...finger.pipPosition.toArray());
              colors.push(1, 1, 1);
              positions.push(...finger.pipPosition.toArray());
              colors.push(1, 1, 1);
              positions.push(...finger.dipPosition.toArray());
              colors.push(1, 1, 1);
              positions.push(...finger.dipPosition.toArray());
              colors.push(1, 1, 1);    
              positions.push(...finger.btipPosition.toArray());
              colors.push(1, 1, 1);
            }); // fingers
          }); // hands
          
          // console.log(framePositions)
          frames.push(framePositions)

          handsRef.current.geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positions, 3)
          );

          handsRef.current.geometry.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(colors, 3)
          );

          
          handsRef.current.geometry.attributes.position.count = positions.length / 3;
          handsRef.current.geometry.attributes.position.itemSize = 3;
          handsRef.current.geometry.attributes.color.count = colors.length / 3;
          handsRef.current.geometry.attributes.color.itemSize = 3;

          handsRef.current.geometry.computeBoundingSphere();

          lineRef.current.geometry = handsRef.current.geometry;
          // console.log(lineRef.current.geometry)
          positions = [];
          colors = [];
          framePositions=[];
          
          if (frames.length == windowSize){
            
            (async ()=>{
              console.log("sent")
              const res=await predict_window(frames)
              setLabel(res.data.label)
            })()
            frames=[];
            return
          }
        } else {
          meshRef.current.visible = false
        }}
      }
  })
  return (
    <group ref={meshRef} rotateX={20}>
      <points ref={handsRef}>
        <bufferGeometry attach="geometry" />
        <pointsMaterial
          attach="material"
          vertexColors
          size={10}
          sizeAttenuation={true}
          map={createCanvasMaterial('#fff', 256)}
          
        />
        <lineSegments ref={lineRef}>
          <lineBasicMaterial   vertexColors blending={THREE.NormalBlending} transparent />
        </lineSegments>
      </points>
    </group>
  )

}
function OnlineLeapVisualizer() {
  const [stride, setStride] = React.useState(2);
  const [windowSize, setWindowSize] = React.useState(30);
  const [energy, setEnergy] = React.useState(false);
  const [isLeapMotionConnected, setIsLeapMotionConnected] = React.useState(true);
  const [label, setLabel] = React.useState("");
  const toggleLeapConnected = (isLeapConnected) => {
    if (isLeapConnected === isLeapMotionConnected) { return }
    setIsLeapMotionConnected(isLeapConnected)
  }
  const navigate = useNavigate();
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
                      min={30}
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
              <HandsLeap windowSize={windowSize} setLabel={setLabel} toggleLeapConnected={toggleLeapConnected} />
            </Canvas>
            {/* )
            } */}


          </Col>
          <Col xs={3} style={{ height: "100%" }}>
            <Card style={{ width: '100%', padding: 8, backgroundColor: "#3D3D3D", alignItems: "center", marginBottom: 10 }} >
              <Card.Body>
                <Card.Title>Result</Card.Title>
                <Card.Text>
                    {label}
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
        <Card onClick={()=>{navigate('/');}} style={{ width: '200px', padding: 8, backgroundColor: "#3D3D3D", alignItems: "center", position: "absolute", left: 0, bottom: 0, cursor:"pointer" }} >
          <Card.Body>
            <Card.Title>Back</Card.Title>
          </Card.Body>
        </Card>
      </Container>

    </div>
  );
}

export default OnlineLeapVisualizer;
