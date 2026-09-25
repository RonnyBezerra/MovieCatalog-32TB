import express from "express"
import mysql2 from "mysql2"

const app = express()

app.use(express.json())

app.get("/", (request, response) => {
  response.json({
    message: "Aviso do backend"
  })
})

app.post("/create-movie", (request, response) => {
    const { name, genre, duration, age_rating } = request.body

    const insertCommand = "INSERT INTO filmes_ronnyBezerra (name, genre, duration, age_rating) VALUES (?, ?, ?, ?)"
    
    sql.query(insertCommand, [name, genre, duration, age_rating], (error) => {
        if (error) {
            console.log(error)
            return
        }

        response.status(201).json({
            message: "Filme adicionado com sucesso!"
        })
    })
})

app.delete("/delete-movie/:id", (request, response) => {
    const { id } = request.params

    const deleteCommand = "DELETE FROM filmes_ronnyBezerra WHERE id = ?"

    sql.query(deleteCommand, [id], (error) => {
        if (error) {
            console.log(error)
            return
        }

        response.status(200).json({
            message: "Filme deletado com sucesso!"
        })
    })
})

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})

const sql = mysql2.createPool({
    host: "benserverplex.ddns.net",
    user: "alunos",
    password: "senhaAlunos",
    database: "alunos_filmes03TB"
})