import { Outlet } from "react-router-dom";
import { Header } from "../components";

export function Layoutv1() {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex-1 flex">
                <Outlet />
            </div>
        </div>
    )
}

export default Layoutv1;