import React from "react";
import { RouterProvider } from "react-router";
import router from "./Router";
import "./stores";

const App: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
