import { createBrowserRouter } from "react-router-dom";
import TestPage from "../Pages/TestPage";
import StoreUpdateDemo from "../Pages/TestPage/StoreUpdateDemo";
import MobxUpdateDemo from "../Pages/TestPage/MobxUpdateDemo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <StoreUpdateDemo />,
  },
]);

export default router;
