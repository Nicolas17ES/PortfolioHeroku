const express = require("express")
const app = express()
const cookieSession = require("cookie-session")
const mysql = require("mysql")
const cors = require('cors');

var bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const fileUpload = require('express-fileupload');
const path = require('path');

require("dotenv").config()



app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
}))
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());






const DB_HOST = "127.0.0.1"
const DB_USER = "nico"
const DB_PASSWORD = "12345"
const DB_DATABASE = "dasboard"
const DB_PORT = 3306

const db = mysql.createPool({
    connectionLimit: 100,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
})


global.db = db;

db.getConnection((err, connection) => {
    if (err) throw (err)
    console.log("DB connected successful: " + connection.threadId)
})

const PORT = 3001
app.listen(PORT,
    () => console.log(`Server Started on port ${PORT}...`))



//PORTFOLIO//

//get feedback//

app.get("/feedback", (req, res) => {
    try {
        
        db.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sql = "SELECT * FROM feedback"
            const select_query = mysql.format(sql)
            await connection.query(select_query, (err, result) => {
                connection.release()
                if (err) throw (err)
                console.log("--------> Deleted Service from User")
                res.send(result)
            })
        }) 
    } catch (e) {
        console.log(e)
    }
})

//post feedback//
app.post('/feedback', async (req, res) => {
    try {
        const text = req.body.text;
        const rating = req.body.rating;
        const questionNumber = req.body.questionNumber;
      
        db.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlInsert = `INSERT INTO feedback (text, rating, questionNumber) VALUES ("${text}", ${rating}, ${questionNumber})`
            const insert_query = mysql.format(sqlInsert)
            await connection.query(insert_query, (err, result) => {
                connection.release()
                if (err) throw (err)
        
                return res.status(200).json({"status": 200,"err": null,"response": result});

            })
        }) //end of connection.query()
    } catch (e) {
        console.log(e)
    }
})

//EDIT FEEDBACK//
app.put('/feedback/:id', async (req, res) => {
    try {
        const feedback_id = req.params.id;
        const text = req.body.text;
        const rating = req.body.rating;
        

        
      
        db.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlInsert = `UPDATE feedback SET text = "${text}", rating = ${rating} WHERE feedback_id = ${feedback_id}`
            const insert_query = mysql.format(sqlInsert)
            await connection.query(insert_query, (err, result) => {
                connection.release()
                if (err) throw (err)
        
                return res.status(200).json({"status": 200,"err": null,"response": result});

            })
        }) //end of connection.query()
    } catch (e) {
        console.log(e)
    }

})


//DELETE FEEDBACK

app.delete('/feedback/:id', async (req, res) => {
    try {
        const feedback_id = req.params.id;        
      
        db.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlInsert = `DELETE FROM feedback WHERE feedback_id = ${feedback_id}`
            const insert_query = mysql.format(sqlInsert)
            await connection.query(insert_query, (err, result) => {
                connection.release()
                if (err) throw (err)
        
                return res.send(result)

            })
        }) //end of connection.query()
    } catch (e) {
        console.log(e)
    }
})


//FEEDBACK LIKES//

//get likes//

app.get("/portfolio/likes", (req, res) => {
    try {

                
        
        db.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sql = `SELECT * from feedback_agree;`
            const select_query = mysql.format(sql)
            await connection.query(select_query, (err, result) => {
                connection.release()
                if (err) throw (err)
                console.log("--------> got your likes")
                res.send(result)
            })
        }) 
    } catch (e) {
        console.log(e)
    }
})

//post like// 
app.post('/portfolio/likes', async (req, res) => {
    try {
        console.log(req.body)
        const id = req.body.feedback_id;
        
        db.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlInsert = `INSERT INTO feedback_agree (feedback_id) VALUES (${id})`
            
            const insert_query = mysql.format(sqlInsert)
            await connection.query(insert_query, (err, result) => {
                connection.release()
                if (err) throw (err)
                console.log("added likes")
                return res.status(200).json({"status": 200,"err": null,"response": result});

            })
        }) //end of connection.query()
    } catch (e) {
        console.log(e)
    }
})

// FEEDBACK REPLIES //

//GET COMMENTS //
app.get("/portfolio/comments", (req, res) => {
    try {

                
        
        db.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sql = `SELECT * from feedback_reply;`
            const select_query = mysql.format(sql)
            await connection.query(select_query, (err, result) => {
                connection.release()
                if (err) throw (err)
                console.log("--------> got your comments")
                res.send(result)
            })
        }) 
    } catch (e) {
        console.log(e)
    }
})

//POST COMMNETS//

app.post('/portfolio/comments', async (req, res) => {
    try {
        
        const id = req.body.feedback_id;
        const comment = req.body.comment;
        
        db.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlInsert = `INSERT INTO feedback_reply (feedback_id, comment) VALUES (${id}, "${comment}")`
            
            const insert_query = mysql.format(sqlInsert)
            await connection.query(insert_query, (err, result) => {
                connection.release()
                if (err) throw (err)
                console.log("added likes")
                return res.status(200).json({"status": 200,"err": null,"response": result});

            })
        }) //end of connection.query()
    } catch (e) {
        console.log(e)
    }
})