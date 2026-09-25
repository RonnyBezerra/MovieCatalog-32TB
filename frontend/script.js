async function buscarFilmes() {
    const resposta = await fetch("http://localhost:3000")
    const filmes = await resposta.json()
    const sectionFilmes = document.querySelector(".filmes")

    filmes.forEach((filme) => {
        sectionFilmes.innerHTML += `
            <div>
                <h2>${filme.name}</h2>
                <p><strong>Gênero:</strong> ${filme.genre}</p>
                <p><strong>Duração:</strong> ${filme.duration} minutos</p>
                <p><strong>Classificação indicativa:</strong> ${filme.age_rating > 0 ? filme.age_rating + ' anos' : 'Livre'}</p>
            </div>
        `
    })
}

buscarFilmes()