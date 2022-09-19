import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

import { Container, Card, Button } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import OnlineLeapVisualizer from './components/OnlineLeapVisualizer';
import OfflineSequenceVisualizer from './components/OfflineSequenceVisualizer';


function Navigator() {
  const navigate = useNavigate();
  return <Container style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }} fluid><Card style={{ width: '400px', height: 200, display: "flex", backgroundColor: "#3D3D3D", alignItems: "center", justifyContent: "center" }} >
    <Card.Body style={{ display: "flex", alignItems: "center" }}>
      <div>
        <Button onClick={() => { navigate('/online_sequence_visualizer'); }} variant='light' style={{ margin: 10, width: "95%" }}>Online recognition</Button>
        <Button onClick={() => { navigate('/offline_sequence_visualizer'); }} variant='light' style={{ margin: 10, width: "95%" }}>Offline recognition from sequence</Button>
      </div>
    </Card.Body>
  </Card>
  </Container>
}

function App() {


  return (
    <div className="App">



      <Router initial="/">
        <Routes >
          <Route path="/" element={<Navigator />} />
          <Route path="/online_sequence_visualizer" element={<OnlineLeapVisualizer />} />
          <Route path="/offline_sequence_visualizer" element={<OfflineSequenceVisualizer />} />
        </Routes>
      </Router>



    </div>
  );
}

export default App;
