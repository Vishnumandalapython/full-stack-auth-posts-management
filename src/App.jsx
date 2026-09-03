import Login from "./components/Login";
import Register from "./components/Register";

import Users from "./pages/Users";
import { BrowserRouter,Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

import Posts from "./pages/Posts";
import UserDashboard from "./pages/UserDashboard";
import SuperadminDashboard from "./pages/SuperadminDashboard";
function App() {
  return (
         
<BrowserRouter>

    <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
            path="/user/dashboard"
            element={
                <ProtectedRoute allowedRole="user">
                    <UserDashboard />
                </ProtectedRoute>
            }
        />

        <Route
            path="/superadmin/dashboard"
            element={
                <ProtectedRoute allowedRole="superadmin">
                    <SuperadminDashboard />
                </ProtectedRoute>
            }
        />

        <Route
            path="/Users"
            element={
                <ProtectedRoute>
                    <Users />
                </ProtectedRoute>
            }
        />

        <Route
            path="/posts"
            element={<Posts />}
        />

    </Routes>

</BrowserRouter>

    );

}

export default App;