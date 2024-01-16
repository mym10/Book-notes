import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "books",
    password: "password@1010",
    port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let list = [
    {id:1, title:"ATOMIC HABITS", date_: "14-01-2024", rating_:"9/10", value_: "0735211299" ,description_:"I was doubtful, but everyone kept telling me it’s awesome, so I reluctantly read it. Holy crap! It’s GREAT! Feels like the definitive masterpiece on the subject of how to make good habits and break bad ones. Very focused on helping you take action. Very relatable and inspiring."}
];

app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM books ORDER BY rating_ DESC");
        list = result.rows;
        res.render("index.ejs", {books: list});
    } catch (err) {
        console.log(err);
    }; 
});

app.get("/add", (req, res) => {
    res.render("add.ejs");
})
app.post("/add", async (req, res) => {
    const title = req.body.title;
    const date = req.body.date;
    const rating = req.body.rating;
    const description = req.body.description;
    const value = req.body.value;
    try {
        db.query("INSERT INTO books (title, date_, rating_, description_, value_) VALUES ($1, $2, $3, $4, $5)", [title, date, rating, description, value]);
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});

app.get("/delete", (req, res) => {
    res.render("delete.ejs");
})

app.post("/delete", async (req, res) => {
    const id = req.body.Id;
    try{
        db.query("DELETE FROM books WHERE id=($1)", [id]);
        res.redirect("/"); 
    } catch(err) {
        console.log(err);
    }
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});