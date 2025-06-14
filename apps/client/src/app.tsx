import { RouterProvider } from "react-router-dom";

export function App(props: any) {
  return (
    <RouterProvider router={props.router} />
  );
}

export default App;
