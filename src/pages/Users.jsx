import { useEffect, useState } from "react";
import api from "../api/api";
import "./Users.css";

function Users() {

    // READ
    const [users, setUsers] = useState([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    // Loading / message
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // CREATE
    const [fullName, setFullName] = useState("");
    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");

    // UPDATE
    const [editId, setEditId] = useState(null);
    const [editFullName, setEditFullName] = useState("");
    const [editUserid, setEditUserid] = useState("");
    const [editPassword, setEditPassword] = useState("");


    // GET USERS
    const getUsers = async () => {

        try {

            setLoading(true);

            const response = await api.get("/users");

            setUsers(response.data);

        } catch (error) {

            console.log(error);
            setMessage("Failed to load users");

        } finally {

            setLoading(false);

        }
    };


    // RUN WHEN PAGE LOADS
    useEffect(() => {

        getUsers();

    }, []);


    // CREATE USER
    const handleCreateUser = async () => {

        if (!fullName || !userid || !password) {

            setMessage("All fields are required");
            return;

        }

        try {

            const response = await api.post("/users", {
                fullName,
                userid,
                password
            });

            setMessage(response.data.message);

            setFullName("");
            setUserid("");
            setPassword("");

            setCurrentPage(1);

            await getUsers();

        } catch (error) {

            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to create user"
            );

        }
    };


    // SELECT USER FOR EDIT
    const handleEdit = (user) => {

        setEditId(user.id);
        setEditFullName(user.fullName);
        setEditUserid(user.userid);
        setEditPassword(user.password);

    };


    // UPDATE USER
    const handleUpdate = async () => {

        if (!editFullName || !editUserid || !editPassword) {

            setMessage("All fields are required");
            return;

        }

        try {

            const response = await api.put(
                `/users/${editId}`,
                {
                    fullName: editFullName,
                    userid: editUserid,
                    password: editPassword
                }
            );

            setMessage(response.data.message);

            setEditId(null);

            await getUsers();

        } catch (error) {

            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to update user"
            );

        }
    };


    // DELETE USER
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await api.delete(`/users/${id}`);

            setMessage(response.data.message);

            await getUsers();

            // Calculate pages after deletion
            const remainingUsers = users.length - 1;
            const totalPages = Math.ceil(
                remainingUsers / usersPerPage
            );

            if (currentPage > totalPages && totalPages > 0) {
                setCurrentPage(totalPages);
            }

        } catch (error) {

            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to delete user"
            );

        }
    };


    // -----------------------------
    // PAGINATION
    // -----------------------------

    const totalPages = Math.ceil(
        users.length / usersPerPage
    );

    const indexOfLastUser =
        currentPage * usersPerPage;

    const indexOfFirstUser =
        indexOfLastUser - usersPerPage;

    const currentUsers = users.slice(
        indexOfFirstUser,
        indexOfLastUser
    );


    // Change page
    const handlePageChange = (pageNumber) => {

        setCurrentPage(pageNumber);

    };


    // Previous page
    const handlePrevious = () => {

        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }

    };


    // Next page
    const handleNext = () => {

        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }

    };


    // LOADING
    if (loading) {

        return <h2>Loading...</h2>;

    }


    return (

        <div className="users-page">

            <h1 className="users-title">
                User Management
            </h1>


            {/* ADD USER */}

            <div className="user-form-card">

                <h2>Add User</h2>

                <div className="user-form">

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) =>
                            setFullName(e.target.value)
                        }
                    />

                    <input
                        type="text"
                        placeholder="User ID"
                        value={userid}
                        onChange={(e) =>
                            setUserid(e.target.value)
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <button
                        className="add-user-btn"
                        onClick={handleCreateUser}
                    >
                        Add User
                    </button>

                </div>

                {message && (
                    <p className="user-message">
                        {message}
                    </p>
                )}

            </div>


            {/* EDIT USER */}

            {editId && (

                <div className="user-form-card edit-card">

                    <h2>Edit User</h2>

                    <div className="user-form">

                        <input
                            type="text"
                            placeholder="Full Name"
                            value={editFullName}
                            onChange={(e) =>
                                setEditFullName(e.target.value)
                            }
                        />

                        <input
                            type="text"
                            placeholder="User ID"
                            value={editUserid}
                            onChange={(e) =>
                                setEditUserid(e.target.value)
                            }
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={editPassword}
                            onChange={(e) =>
                                setEditPassword(e.target.value)
                            }
                        />

                        <div className="edit-buttons">

                            <button
                                className="update-btn"
                                onClick={handleUpdate}
                            >
                                Update
                            </button>

                            <button
                                className="cancel-btn"
                                onClick={() => setEditId(null)}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* USER TABLE */}

            <div className="user-table-card">

                <div className="table-header">

                    <h2>User List</h2>

                    <span className="user-count">
                        {users.length} Users
                    </span>

                </div>


                <div className="table-wrapper">

                    <table className="users-table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Full Name *</th>
                                <th>User ID *</th>
                                <th>Password *</th>
                                <th>Actions</th>
                            </tr>

                        </thead>


                        <tbody>

                            {currentUsers.length > 0 ? (

                                currentUsers.map((user) => (

                                    <tr key={user.id}>

                                        <td>
                                            {user.id}
                                        </td>

                                        <td>
                                            {user.fullName}
                                        </td>

                                        <td>
                                            {user.userid}
                                        </td>

                                        <td>
                                            {user.password}
                                        </td>

                                        <td>

                                            <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    handleEdit(user)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(user.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="5">
                                        No users found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {/* PAGINATION */}

                {totalPages > 1 && (

                    <div className="pagination">

                        <button
                            className="pagination-btn"
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>


                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        ).map((pageNumber) => (

                            <button
                                key={pageNumber}
                                className={
                                    currentPage === pageNumber
                                        ? "pagination-btn active"
                                        : "pagination-btn"
                                }
                                onClick={() =>
                                    handlePageChange(pageNumber)
                                }
                            >
                                {pageNumber}
                            </button>

                        ))}


                        <button
                            className="pagination-btn"
                            onClick={handleNext}
                            disabled={
                                currentPage === totalPages
                            }
                        >
                            Next
                        </button>

                    </div>

                )}

           </div>

        </div> 

    );

}

export default Users;