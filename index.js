import express from "express"

const app = express()

app.get("/", (req, res) => {
  response.json({
    message: "Aviso do backend"
  })
})

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})