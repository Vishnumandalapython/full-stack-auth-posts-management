import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
function SuperadminDashboard() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const getUsers = async () => {

        try {

            const response = await api.get("/users");

            setUsers(response.data);

        } catch (error) {

            console.log("GET USERS ERROR:", error);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div>
 <Sidebar />
            <h1>Superadmin Dashboard</h1>

            <h2>
                Welcome, {user?.fullName}
            </h2>

            <p>
                Role: {user?.role}
            </p>


            {/* DASHBOARD CARDS */}

            <div>

                <div>
                    <h3>Total Users</h3>
                    <h2>{users.length}</h2>
                </div>

                <div>
                    <h3>Superadmins</h3>
                    <h2>
                        {
                            users.filter(
                                (u) => u.role === "superadmin"
                            ).length
                        }
                    </h2>
                </div>

                <div>
                    <h3>Normal Users</h3>
                    <h2>
                        {
                            users.filter(
                                (u) => u.role === "user"
                            ).length
                        }
                    </h2>
                </div>

            </div>


            {/* USERS TABLE */}

            <h2>User Management</h2>

            {loading ? (

                <p>Loading users...</p>

            ) : (

                <table border="1" cellPadding="10">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>User ID</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {users.map((item) => (

                            <tr key={item.id}>

                                <td>{item.id}</td>

                                <td>{item.fullName}</td>

                                <td>{item.userid}</td>

                                <td>{item.role}</td>

                                <td>

                                    <button>
                                        Edit
                                    </button>

                                    {" "}

                                    <button>
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </div>
    );
}

export default SuperadminDashboard;