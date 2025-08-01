import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export function App(props: any) {
  return (
    <>
      <RouterProvider router={props.router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
