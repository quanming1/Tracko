import { createBrowserRouter } from "react-router-dom";
import TestPage from "../Pages/TestPage";
import StoreUpdateDemo from "../Pages/TestPage/StoreUpdateDemo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <StoreUpdateDemo />,
  },
  {
    path: "/test",
    element: <TestPage />,
  },
]);

export default router;
