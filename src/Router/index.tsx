import { createBrowserRouter } from "react-router-dom";
import TestPage from "../Pages/TestPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TestPage />,
  },
]);

export default router;
