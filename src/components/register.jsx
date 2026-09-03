import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Register() {
  const [fullName,setFullName]= useState("");
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Validation
    if(!fullName){
      setMessage("enter the full name");
      return;
    }
    if (!userid) {
      setMessage("Enter User ID");
      return;
    }

    if (!password) {
      setMessage("Enter Password");
      return;
    }

    if (!confirmPassword) {
      setMessage("Confirm Password");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await api.post("/register", {
        fullName,
        userid,
        password,
      });

      if (response.data.success) {
        setMessage(response.data.message);

        // Go to Login page after successful registration
        navigate("/");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setMessage("Server Error");
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Enter full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter User ID"
          value={userid}
          onChange={(e) => setUserid(e.target.value)}
        />

        <br />
        <br />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <br />
        <br />

        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </label>

        <br />
        <br />

        <button onClick={handleSubmit}>
          Register
        </button>

        <br />
        <br />

        {message && <p>{message}</p>}

        <p>
          Already have an account?{" "}
          <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;