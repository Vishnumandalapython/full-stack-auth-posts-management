import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children, allowedRole }) {

    const user = useSelector(
        (state) => state.auth.user
    );

    // Not logged in
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Role not allowed
    if (allowedRole && user.role !== allowedRole) {

        if (user.role === "superadmin") {
            return <Navigate to="/superadmin/dashboard" replace />;
        }

        if (user.role === "user") {
            return <Navigate to="/user/dashboard" replace />;
        }

    }

    return children;
}

export default ProtectedRoute;