import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { loginUser } from "../redux/authSlice";

import "./Login.css";

function Login() {

    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get authentication state from Redux
    const loading = useSelector(
        (state) => state.auth.loading
    );

    const error = useSelector(
        (state) => state.auth.error
    );


    const handleLogin = async () => {

        // Validation
        if (!userid) {
            setMessage("Employee ID is required");
            return;
        }

        if (!password) {
            setMessage("Password is required");
            return;
        }


        try {

    const result = await dispatch(
        loginUser({
            userid,
            password
        })
    ).unwrap();

    setMessage("Login successful");

    if (result.user.role === "superadmin") {

        navigate("/superadmin/dashboard");

    } else if (result.user.role === "user") {

        navigate("/user/dashboard");

    } else {

        setMessage("Invalid user role");

    }

} catch (error) {

    console.log("LOGIN ERROR:", error);

    setMessage(
        typeof error === "string"
            ? error
            : error?.message || "Login failed"
    );


    

}
        

    };


    return (

        <div className="container">

            <div className="login-card">

                <h1>Login</h1>


                <div className="form-group">

                    <label htmlFor="userid">
                        Employee ID
                    </label>

                    <input
                        id="userid"
                        type="text"
                        placeholder="Enter Employee ID"
                        value={userid}
                        onChange={(e) =>
                            setUserid(e.target.value)
                        }
                    />

                </div>


                <div className="form-group">

                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                </div>


                <label>

                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() =>
                            setShowPassword(!showPassword)
                        }
                    />

                    Show Password

                </label>


                <br />
                <br />


                <button
                    className="login-btn"
                    onClick={handleLogin}
                    disabled={loading}
                >

                    {loading
                        ? "Logging in..."
                        : "Login"}

                </button>


                {message && (
                    <p className="message">
                        {message}
                    </p>
                )}


                {error && !message && (
                    <p className="message">
                        {error}
                    </p>
                )}


                <p>
                    Don't have an account?{" "}
                    <Link to="/register">
                        Register
                    </Link>
                </p>

            </div>

        </div>

    );
}

export default Login;