import "./App.css";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
function App() {
  const [currentDetection, setDetection] = useState([]);
  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("BOUNDING_BOX", (filteredBoxes) => {
      const { bounding, widthHeight } = filteredBoxes;
      setDetection(bounding);
    });
  }, []);

  return (
    <div>
      <p>{currentDetection}</p>
    </div>
  );
}

export default App;
