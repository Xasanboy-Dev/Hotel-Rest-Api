const express = require("express")
const server = express()
require("dotenv").config()
const PORT = process.env.PORT || 1234
const pool = require("./pg/db")
const ejs = require("ejs")
const { urlencoded } = require("express")
const e = require("express")
server.use(express.json())
server.set("view engine", "ejs")
// Get Method

server.get("/users", async (req, res) => {
    try {
        const users = await pool.query(`SELECT * FROM users`)
        res.render("getusers", { data: users })
    } catch (error) {
        res.status(500).json({ mesage: error.mesage })
    }
})

server.use(urlencoded({ extended: false }))

// Post Method

server.post("/users/register", async (req, res) => {
    try {
        // let user = { name, lastname, email, gender, skill, phone } = req.body
        const users = await pool.query(`SELECT * FROM users`)
        let { name, lastname, email, gender, skill, phone } = req.body
        if (name !== undefined && lastname !== undefined && email !== undefined && gender !== undefined && skill !== undefined && phone !== undefined) {
            let arr = []
            for (let r in users.rows) {
                let d = users.rows[r]
                if (d.name == name && d.lastname == lastname && d.email == email && d.gender == gender && d.skill == skill && d.phone == phone) {
                    arr.push(d)
                }
            }
            if (arr.length == 0) {
                pool.query(`INSERT INTO users (name,lastname,email,gender,skill,phone) VALUES ($1,$2,$3,$4,$5,$6)`, [name, lastname, email, gender, skill, phone])
                res.redirect("/users/register")
            } else {
                res.render('error', { username: name })
            }
        } else {
            res.render("error", { username: name })
        }
    } catch (error) {
        res.render("error", { username: error.mesage })
    }
})

// Delete Method

server.delete("/users/delete", async (req, res) => {
    try {
        if (req.body.id !== undefined) {
            const users = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.body.id])
            if (users.rows.length == 0) {
                res.status(400).json({ message: "Your isn't exist in here." })
            } else {
                pool.query(`DELETE FROM users WHERE id = $1`, [req.body.id])
                res.status(200).json({ mesage: "Your DATA has Deleted" })
            }
        } else {
            res.status(400).json({ message: "You must fill the gap! Then you can DELETE." })
        }
    } catch (error) {
        res.status(500).json({ message: error.mesage })
    }
})
server.post("/users/login", async (req, res) => {
    const { name, email, phone } = req.body
    const allusers = await pool.query(`SELECT * FROM users WHERE name = $1 AND phone = $2 AND email = $3`, [name, phone, email])
    console.log(allusers.rows)
})
server.get("/about", (req, res) => {
    res.render("about", { name: "Xasanboy req dan galadi" })
})
server.get('/users/register', (req, res) => {
    res.render("register")
})
server.get("/users/login", (req, res) => {
    res.render("login")
})
server.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`)
})