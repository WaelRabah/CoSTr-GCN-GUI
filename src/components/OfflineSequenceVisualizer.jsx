import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { Canvas } from "react-three-fiber";

import "../App.css";
import { useRef } from "react";
import * as THREE from "three";
import { Row, Col, Container, Form, Card } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";
import { useNavigate } from "react-router-dom";

function HandsLeap({sequence}) {
  let meshRef = useRef();
  let handsRef = useRef();
  let lineRef = useRef();
  const [positions, setPositions] = useState([])
  let pos=[]
  let colors = [];
  function createCanvasMaterial(color, size) {
    var matCanvas = document.createElement("canvas");
    matCanvas.width = matCanvas.height = size;
    var matContext = matCanvas.getContext("2d");
    // create exture object from canvas.
    var texture = new THREE.Texture(matCanvas);
    // Draw a circle
    var center = size / 2;
    matContext.beginPath();
    matContext.arc(center, center, size / 2, 0, 2 * Math.PI, false);
    matContext.closePath();
    matContext.fillStyle = color;
    matContext.fill();
    // need to set needsUpdate
    texture.needsUpdate = true;
    // return a texture made from the canvas
    return texture;
  }
  React.useEffect(()=>{
      const frames=sequence.split("\n")
      const frames_num=frames.length
      
      let counter=0
      const interval=setInterval(()=>{
        
        if (counter>=frames_num-1){
          clearInterval(interval)
        }
        const value=frames[counter]
        counter++
        let pos=[]
        const frame=value.split(";").slice(0,-1)
        if (frame.length===0){
          return
        }
        const num_joints=frame.length / 7
        let count=0
        for (let i=0 ; i< num_joints ; i++){
          count++
          pos=[...pos,...frame.slice(i*7,(i+1)*7).slice(0,3).map((item)=>Number(item) * 100 )]
        }
        setPositions(pos)
        // clearInterval(interval)
      },10)

  },[])
  useEffect(() => {

    if (positions.length){
    // const a=syncReadFile('./seq.txt');
    // console.log(a)

      // if (frame.hands.length > 0) {
      //   meshRef.current.visible = true;

      //   frame.hands.forEach((hand) => {
      //     /*positions.push(...hand.elbow.toArray());
      //     colors.push(1, 1, 1);

      //     positions.push(...hand.wrist.toArray());
      //     colors.push(1, 1, 1);*/

      //     hand.fingers.forEach((finger, idx) => {
      //       // positions.push(...finger.carpPosition.toArray());
      //       // colors.push(1, 1, 1);
      //       positions.push(...hand.palm.position.toArray());
      //       colors.push(0, 153 / 255, 1);
      //       positions.push(...finger.mcpPosition.toArray());
      //       colors.push(1, 1, 1);
      //       positions.push(...finger.mcpPosition.toArray());
      //       colors.push(1, 1, 1);
      //       positions.push(...finger.pipPosition.toArray());
      //       colors.push(1, 1, 1);
      //       positions.push(...finger.pipPosition.toArray());
      //       colors.push(1, 1, 1);
      //       positions.push(...finger.dipPosition.toArray());
      //       colors.push(1, 1, 1);
      //       positions.push(...finger.dipPosition.toArray());
      //       colors.push(1, 1, 1);
      //       positions.push(...finger.btipPosition.toArray());
      //       colors.push(1, 1, 1);
      //     }); // fingers
      //   }); // hands
      //   console.log(positions);
      for (let i=0 ; i< positions.length / 3 ; i++){
        if (i==0){
          colors.push(0, 153 / 255, 1);
        }
        else {
          colors.push(1, 1, 1);
        }
      }
        handsRef.current.geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3)
        );

        handsRef.current.geometry.setAttribute(
          "color",
          new THREE.Float32BufferAttribute(colors, 3)
        );

        handsRef.current.geometry.attributes.position.count =
          positions.length / 3;
        handsRef.current.geometry.attributes.position.itemSize = 3;
        handsRef.current.geometry.attributes.color.count = colors.length / 3;
        handsRef.current.geometry.attributes.color.itemSize = 3;

        handsRef.current.geometry.computeBoundingSphere();

        lineRef.current.geometry = handsRef.current.geometry;
        console.log(lineRef.current.geometry)

        colors = [];
      } else {
        meshRef.current.visible = false;
      }
    
  },[positions]);
  return (
    <group ref={meshRef}>
      <points ref={handsRef}>
        <bufferGeometry attach="geometry" />
        <pointsMaterial
          attach="material"
          vertexColors
          size={10}
          sizeAttenuation={true}
          map={createCanvasMaterial("#fff", 256)}
        />
        <lineSegments ref={lineRef}>
          <lineBasicMaterial
            vertexColors
            blending={THREE.NormalBlending}
            transparent
          />
        </lineSegments>
      </points>
    </group>
  );
}
function OfflineSequenceVisualizer() {
  const [selectedFile, setSelectedFile] = React.useState();
  const [sequence, setSequence] = React.useState();
  const [stride, setStride] = React.useState(2);
  const [isSelected, setIsSelected] = React.useState(2);
  const [windowSize, setWindowSize] = React.useState(10);
  const [energy, setEnergy] = React.useState(false);
  const [isLeapMotionConnected, setIsLeapMotionConnected] =
    React.useState(true);
  const toggleLeapConnected = (isLeapConnected) => {
    if (isLeapConnected === isLeapMotionConnected) {
      return;
    }
    setIsLeapMotionConnected(isLeapConnected);
  };
  const changeHandler = (event) => {
		setSelectedFile(event.target.files[0].name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setSequence(text)
    };
    reader.readAsText(event.target.files[0]);
		setIsSelected(true);
	};

  const navigate = useNavigate();
  return (
    <div className="App" style={{alignItems:"center"}}>
      {!sequence  ? (
        <Container
          style={{
            
            
            display: "flex",
            flexDirection:"column",
            alignItem: "center",
            justifyContent: "center",
            width:"600px"
          }}
          fluid
        >
            <div>
          <Form.Group controlId="formFileLg" className="mb-3">
            <Form.Label> Shrec21 hand gesture sequence file </Form.Label>
            <Form.Control onChange={changeHandler}  type="file" size="lg" />
          </Form.Group>{" "}
          </div>
        </Container>
      ) : (
        <Container
          style={{
            paddingTop: "80px",
            paddingLeft: "40px",
            paddingRight: "40px",
          }}
          fluid
        >
          <Row>
            <Col xs={2} style={{ display: "flex", height: "100%" }}>
              <Card
                style={{
                  width: "23rem",
                  padding: 8,
                  backgroundColor: "#3D3D3D",
                  alignItems: "center",
                }}
              >
                <Card.Body>
                  <Card.Title>Configuration</Card.Title>

                  <Row style={{ marginBottom: 10 }}>
                    <Form.Label>Sliding window size</Form.Label>

                    <Col xs="8">
                      <RangeSlider
                        value={windowSize}
                        min={10}
                        max={100}
                        onChange={(changeEvent) => {
                          setWindowSize(changeEvent.target.value);

                          if (stride > windowSize) {
                            setStride(windowSize);
                          }
                        }}
                      />
                    </Col>
                    <Col xs="4">
                      <Form.Control value={windowSize} />
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 10 }}>
                    <Form.Label>Stride</Form.Label>

                    <Col xs="8">
                      <RangeSlider
                        value={stride}
                        min={1}
                        max={windowSize}
                        onChange={(changeEvent) =>
                          setStride(changeEvent.target.value)
                        }
                      />
                    </Col>
                    <Col xs="4">
                      <Form.Control value={stride} />
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 10, paddingLeft: 20 }}>
                    <Form.Check
                      type={"checkbox"}
                      label="Energy"
                      id={`disabled-default-checkbox`}
                      onChange={(changeEvent) =>
                        setEnergy(changeEvent.target.value)
                      }
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
                  rotation: [-1, 0, 0],
                }}
                style={{
                  width: "100%",
                  height: "80vh",
                }}
              >
                <color attach="background" args={["#050505"]} />
                <mesh position={[0, 0, -10]}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshBasicMaterial color="red" />
                </mesh>
                <HandsLeap sequence={sequence} toggleLeapConnected={toggleLeapConnected} />
              </Canvas>
              {/* )
            } */}
            </Col>
            <Col xs={3} style={{ height: "100%" }}>
              <Card
                style={{
                  width: "100%",
                  padding: 8,
                  backgroundColor: "#3D3D3D",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Card.Body>
                  <Card.Title>Result</Card.Title>
                  <Card.Text>Left</Card.Text>
                </Card.Body>
              </Card>
              <Card
                style={{
                  width: "100%",
                  padding: 8,
                  backgroundColor: "#3D3D3D",
                  alignItems: "center",
                }}
              >
                <Card.Body>
                  <Card.Title>Robot simulator</Card.Title>
                  <Card.Text>Coming soon</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Card
            style={{
              width: "200px",
              padding: 8,
              backgroundColor: "#3D3D3D",
              alignItems: "center",
              position: "absolute",
              right: 0,
              bottom: 0,
            }}
          >
            <Card.Body>
              <Card.Title>RRC V1 </Card.Title>
            </Card.Body>
          </Card>
          <Card
            onClick={() => {
              navigate("/");
            }}
            style={{
              width: "200px",
              padding: 8,
              backgroundColor: "#3D3D3D",
              alignItems: "center",
              position: "absolute",
              left: 0,
              bottom: 0,
              cursor: "pointer",
            }}
          >
            <Card.Body>
              <Card.Title>Back</Card.Title>
            </Card.Body>
          </Card>
        </Container>
      )}
    </div>
  );
}

export default OfflineSequenceVisualizer;
