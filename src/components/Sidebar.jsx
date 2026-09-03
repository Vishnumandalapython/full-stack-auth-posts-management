import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

function Sidebar() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(
        (state) => state.auth.user
    );

    const handleLogout = () => {

        dispatch(logout());

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    return (

        <div
            style={{
                width: "220px",
                height: "100vh",
                backgroundColor: "#3e7fe7",
                color: "white",
                padding: "20px",
                boxSizing: "border-box"
            }}
        >

            <h2>My App</h2>

            <h2>Learn Full Stack</h2>

            <hr />

            {/* USER INFORMATION */}

            <div style={{ marginTop: "20px" }}>

                <p>
                    Welcome, {user?.fullName}
                </p>

                <p>
                    Role: {user?.role}
                </p>

            </div>

            <hr />

            {/* DASHBOARD */}

            <Link
                to={
                    user?.role === "superadmin"
                        ? "/superadmin/dashboard"
                        : "/user/dashboard"
                }
                style={{
                    display: "block",
                    color: "white",
                    textDecoration: "none",
                    padding: "12px 0"
                }}
            >
                Dashboard
            </Link>


            {/* SUPERADMIN ONLY */}

            {user?.role === "superadmin" && (

                <Link
                    to="/Users"
                    style={{
                        display: "block",
                        color: "white",
                        textDecoration: "none",
                        padding: "12px 0"
                    }}
                >
                    Users
                </Link>

            )}


            {/* POSTS */}

            <Link
                to="/posts"
                style={{
                    display: "block",
                    color: "white",
                    textDecoration: "none",
                    padding: "12px 0"
                }}
            >
                Posts
            </Link>


            {/* LOGOUT */}

            <button
                onClick={handleLogout}
                style={{
                    marginTop: "30px",
                    padding: "10px",
                    width: "100%",
                    cursor: "pointer"
                }}
            >
                Logout
            </button>

        </div>
    );
}

export default Sidebar;