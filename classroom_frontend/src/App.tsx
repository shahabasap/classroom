
import { RouterProvider } from "react-router-dom";
import RouteTree from "./routes/MainRoutes";


function App() {

  return (
    <>
      <div className="flex flex-col  h-screen max-h-screen">
        <RouterProvider router={RouteTree}></RouterProvider>
      </div>

    </>
  )
}

export default App
