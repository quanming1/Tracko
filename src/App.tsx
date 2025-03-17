import React from "react";
import "./stores";
import TestPage from "./Pages/TestPage";
import "./Style/index.scss";
import TestPage2 from "./Pages/TestPage/test1";

const App: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <TestPage2 />
    </div>
  );
};

export default App;
