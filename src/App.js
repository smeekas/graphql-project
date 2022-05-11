import { Routes, Route } from "react-router-dom";
import "./App.css";
import Mission from "./components/Mission";
import Missions from "./components/Missions";
import Mutation from "./components/Mutation/Mutation";
import Rocket from "./components/Rocket";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          index
          element={
            <div className="App">
              <Missions />
            </div>
          }
        />
        <Route path="/:missionId" element={<Mission />} />
        <Route path="/rocket/:rocketId" element={<Rocket />} />
        <Route path="/mutation" element={<Mutation />} />
      </Routes>
    </>
  );
}

export default App;
