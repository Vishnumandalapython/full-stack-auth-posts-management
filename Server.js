require("dotenv").config();
console.log("JWT SECRET EXISTS:", !!process.env.JWT_SECRET);
const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;
const app = express();
const authMiddleware =
    require("./middleware/authMiddleware");
const PORT = 5000;

// CORS
app.use(cors({
    origin: "http://localhost:5173"
}));

// Read JSON data from React
app.use(express.json());


// HOME API
app.get("/", (req, res) => {
    res.send("Server is Running...");
});


// ===============================
// GET USERS
// ===============================

app.get("/users",authMiddleware, (req, res) => {

    db.query("SELECT * FROM users", (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        res.json(result);
    });

});

app.post("/users", (req, res) => {

    const { fullName, userid, password } = req.body;

    if (!fullName || !userid || !password) {

        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });

    }

    const checkQuery =
        "SELECT * FROM users WHERE userid = ?";

    db.query(
        checkQuery,
        [userid],
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });

            }

            if (result.length > 0) {

                return res.status(409).json({
                    success: false,
                    message: "User ID already exists"
                });

            }

            const insertQuery =
                "INSERT INTO users (fullName, userid, password) VALUES (?, ?, ?)";

            db.query(
                insertQuery,
                [fullName, userid, password],
                (err, result) => {

                    if (err) {

                        return res.status(500).json({
                            success: false,
                            message: "Failed to create user"
                        });

                    }

                    res.status(201).json({
                        success: true,
                        message: "User created successfully",
                        userId: result.insertId
                    });

                }
            );

        }
    );

});

// ===============================
// LOGIN API
// ===============================

app.post("/login", async (req, res) => {

    const { userid, password } = req.body;

    if (!userid || !password) {
        return res.status(400).json({
            success: false,
            message: "User ID and Password are required"
        });
    }

    const loginQuery =
        "SELECT * FROM users WHERE userid = ?";

    db.query(
        loginQuery,
        [userid],
        async (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid User ID or Password"
                });
            }

            const user = result[0];

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid User ID or Password"
                });
            }

            // JWT
            const token = jwt.sign(
                {
                    id: user.id,
                    userid: user.userid,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );

            res.json({
                success: true,
                message: "Login successful",

                token,

                user: {
                    id: user.id,
                    fullName: user.fullName,
                    userid: user.userid,
                    role: user.role
                }
            });
        }
    );
});
// ===============================
// REGISTER API
// ===============================



app.post("/register", async (req, res) => {

    const { fullName, userid, password } = req.body;

    // 1. Validate
    if (!fullName || !userid || !password) {
        return res.status(400).json({
            success: false,
            message: "Full Name, User ID and Password are required"
        });
    }

    // 2. Check whether userid already exists
    const checkQuery =
        "SELECT * FROM users WHERE userid = ?";

    db.query(checkQuery, [userid], async (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        // 3. Duplicate userid
        if (result.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User ID already exists"
            });
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Insert user
        const insertQuery = `
            INSERT INTO users
            (fullName, userid, password, role)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            insertQuery,
            [fullName, userid, hashedPassword, "user"],
            (err, result) => {

                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Registration failed"
                    });
                }

                // 6. Send response
                res.status(201).json({
                    success: true,
                    message: "Registration successful"
                });
            }
        );

    });

});
app.put("/users/:id", (req, res) => {

    const { id } = req.params;
    const { fullName, userid, password } = req.body;

    if (!fullName || !userid || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const query = `
        UPDATE users
        SET fullName = ?, userid = ?, password = ?
        WHERE id = ?
    `;

    db.query(
        query,
        [fullName, userid, password, id],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update user"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.json({
                success: true,
                message: "User updated successfully"
            });

        }
    );
});
app.delete("/users/:id", (req, res) => {

    const { id } = req.params;

    const query = `
        DELETE FROM users
        WHERE id = ?
    `;

    db.query(query, [id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete user"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "User deleted successfully"
        });

    });

});

// ===============================
// START SERVER
// ===============================
// ===============================
// POSTS API
// ===============================

app.get("/posts", (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const offset = (page - 1) * limit;

    const countQuery = "SELECT COUNT(*) AS total FROM posts";

    db.query(countQuery, (err, countResult) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Failed to count posts"
            });
        }

        const totalPosts = countResult[0].total;

        const totalPages = Math.ceil(
            totalPosts / limit
        );

        const postsQuery = `
            SELECT *
            FROM posts
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `;

        db.query(
            postsQuery,
            [limit, offset],
            (err, result) => {

                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Failed to fetch posts"
                    });
                }

                res.json({
                    success: true,
                    posts: result,
                    currentPage: page,
                    totalPages: totalPages,
                    totalPosts: totalPosts
                });

            }
        );

    });

});
// CREATE POST
app.post("/posts", (req, res) => {

    const { title, body } = req.body;

    if (!title || !body) {

        return res.status(400).json({
            success: false,
            message: "Title and body are required"
        });

    }

    const query = `
        INSERT INTO posts (title, body)
        VALUES (?, ?)
    `;

    db.query(
        query,
        [title, body],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create post"
                });

            }

            res.status(201).json({
                success: true,
                message: "Post created successfully",

                post: {
                    id: result.insertId,
                    title: title,
                    body: body
                }
            });

        }
    );

});
// UPDATE POST
app.put("/posts/:id", (req, res) => {

    const { id } = req.params;
    const { title, body } = req.body;

    if (!title || !body) {

        return res.status(400).json({
            success: false,
            message: "Title and body are required"
        });

    }

    const query = `
        UPDATE posts
        SET title = ?, body = ?
        WHERE id = ?
    `;

    db.query(
        query,
        [title, body, id],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update post"
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Post not found"
                });

            }

            res.json({
                success: true,
                message: "Post updated successfully",
                post: {
                    id: Number(id),
                    title,
                    body
                }
            });

        }
    );

});
// DELETE POST
app.delete("/posts/:id", (req, res) => {

    const { id } = req.params;

    const query = `
        DELETE FROM posts
        WHERE id = ?
    `;

    db.query(query, [id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete post"
            });

        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Post not found"
            });

        }

        res.json({
            success: true,
            message: "Post deleted successfully",
            postId: Number(id)
        });

    });

});
app.get("/profile", authMiddleware, (req, res) => {

    res.json({
        success: true,
        message: "Protected API accessed",
        user: req.user
    });

});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});