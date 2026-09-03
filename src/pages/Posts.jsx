import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
    fetchPosts,
    createPost,
    updatePost,
    deletePost
} from "../redux/postsSlice";


function Posts() {

    const dispatch = useDispatch();
const [currentPage, setCurrentPage] = useState(1);

    // ===============================
    // REDUX STATE
    // ===============================

    const {
        posts,
        loading,
        error,
     
        totalPages,
        totalPosts
    } = useSelector(
        (state) => state.posts
    );


    // ===============================
    // CREATE POST STATE
    // ===============================

    const [title, setTitle] = useState("");

    const [body, setBody] = useState("");


    // ===============================
    // EDIT POST STATE
    // ===============================

    const [editId, setEditId] = useState(null);

    const [editTitle, setEditTitle] = useState("");

    const [editBody, setEditBody] = useState("");


    // ===============================
    // POSTS PER PAGE
    // ===============================

    const PostsPerPage = 10;


    // ===============================
    // FETCH POSTS
    // ===============================

    useEffect(() => {

        dispatch(
            fetchPosts({
                page: currentPage,
                limit: PostsPerPage
            })
        );

    }, [dispatch, currentPage]);


    // ===============================
    // CREATE POST
    // ===============================

    const handleCreatePost = async () => {

        if (!title.trim() || !body.trim()) {

            alert("Title and body are required");

            return;

        }


        try {

            await dispatch(
                createPost({
                    title,
                    body
                })
            ).unwrap();


            setTitle("");

            setBody("");


            // Reload current page

            dispatch(
                fetchPosts({
                    page: currentPage,
                    limit: PostsPerPage
                })
            );


        } catch (error) {

            alert(error);

        }

    };


    // ===============================
    // START EDIT
    // ===============================

    const handleEdit = (post) => {

        setEditId(post.id);

        setEditTitle(post.title);

        setEditBody(post.body);

    };


    // ===============================
    // UPDATE POST
    // ===============================

    const handleUpdatePost = async () => {

        if (!editTitle.trim() || !editBody.trim()) {

            alert("Title and body are required");

            return;

        }


        try {

            await dispatch(
                updatePost({
                    id: editId,
                    title: editTitle,
                    body: editBody
                })
            ).unwrap();


            setEditId(null);

            setEditTitle("");

            setEditBody("");


            // Reload current page

            dispatch(
                fetchPosts({
                    page: currentPage,
                    limit: PostsPerPage
                })
            );


        } catch (error) {

            alert(error);

        }

    };


    // ===============================
    // DELETE POST
    // ===============================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this post?"
            );


        if (!confirmDelete) {

            return;

        }


        try {

            await dispatch(
                deletePost(id)
            ).unwrap();


            // Reload current page

            dispatch(
                fetchPosts({
                    page: currentPage,
                    limit: PostsPerPage
                })
            );


        } catch (error) {

            alert(error);

        }

    };


    // ===============================
    // PAGE CHANGE
    // ===============================

    const handlePageChange = (pageNumber) => {

        setCurrentPage(pageNumber);

    };


    // ===============================
    // PREVIOUS
    // ===============================

    const handlePrevious = () => {

        if (currentPage > 1) {

            setCurrentPage(
                currentPage - 1
            );

        }

    };


    // ===============================
    // NEXT
    // ===============================

    const handleNext = () => {

        if (currentPage < totalPages) {

            setCurrentPage(
                currentPage + 1
            );

        }

    };


    // ===============================
    // UI
    // ===============================

    return (

        <div style={{ padding: "30px" }}>

            <h1>
                Posts Management
            </h1>


            {/* ===============================
                CREATE POST
            =============================== */}

            <h2>
                Add Post
            </h2>


            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) =>
                    setTitle(e.target.value)
                }
            />


            <input
                type="text"
                placeholder="Body"
                value={body}
                onChange={(e) =>
                    setBody(e.target.value)
                }
            />


            <button
                onClick={handleCreatePost}
                disabled={loading}
            >
                Add Post
            </button>


            {/* ===============================
                EDIT POST
            =============================== */}

            {editId && (

                <div style={{ marginTop: "20px" }}>

                    <h2>
                        Edit Post
                    </h2>


                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) =>
                            setEditTitle(e.target.value)
                        }
                    />


                    <input
                        type="text"
                        value={editBody}
                        onChange={(e) =>
                            setEditBody(e.target.value)
                        }
                    />


                    <button
                        onClick={handleUpdatePost}
                        disabled={loading}
                    >
                        Update
                    </button>


                    <button
                        onClick={() => {

                            setEditId(null);

                            setEditTitle("");

                            setEditBody("");

                        }}
                    >
                        Cancel
                    </button>

                </div>

            )}


            {/* ===============================
                ERROR
            =============================== */}

            {error && (

                <p style={{ color: "red" }}>
                    {error}
                </p>

            )}


            {/* ===============================
                POSTS TABLE
            =============================== */}

            <h2>
                Posts List
            </h2>


            {loading ? (

                <p>
                    Loading posts...
                </p>

            ) : (

                <table
                    border="1"
                    cellPadding="10"
                    style={{
                        borderCollapse: "collapse",
                        width: "100%"
                    }}
                >

                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Title
                            </th>

                            <th>
                                Body
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {posts.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="4"
                                    style={{
                                        textAlign: "center"
                                    }}
                                >
                                    No posts found
                                </td>

                            </tr>

                        ) : (

                            posts.map((post) => (

                                <tr key={post.id}>

                                    <td>
                                        {post.id}
                                    </td>

                                    <td>
                                        {post.title}
                                    </td>

                                    <td>
                                        {post.body}
                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                handleEdit(post)
                                            }
                                        >
                                            Edit
                                        </button>


                                        <button
                                            onClick={() =>
                                                handleDelete(post.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            )}


            {/* ===============================
                PAGINATION
            =============================== */}

            {totalPages > 1 && (

                <div
                    style={{
                        marginTop: "20px"
                    }}
                >

                    <button
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
                            onClick={() =>
                                handlePageChange(pageNumber)
                            }
                            style={{
                                margin: "0 5px",
                                fontWeight:
                                    currentPage === pageNumber
                                        ? "bold"
                                        : "normal"
                            }}
                        >
                            {pageNumber}
                        </button>

                    ))}


                    <button
                        onClick={handleNext}
                        disabled={
                            currentPage === totalPages
                        }
                    >
                        Next
                    </button>

                </div>

            )}


            <p>
                Total Posts: {totalPosts}
            </p>

            <p>
                Page {currentPage} of {totalPages}
            </p>

        </div>

    );

}


export default Posts;