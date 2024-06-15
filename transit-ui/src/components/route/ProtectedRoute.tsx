import { Navigate } from "react-router";

import { Outlet } from "react-router";

import { useLocalStorage } from "@uidotdev/usehooks";

function ProtectedRoute() {
    const [userId, _] = useLocalStorage("user_id", null)

    return userId !== null ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute