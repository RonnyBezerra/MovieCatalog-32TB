const STORAGE_KEY = 'cine-hall-filmes';

const filmesPadrao = [
    {
        id: 1,
        title: 'Duna',
        genre: 'Ficção Científica',
        year: 2021,
        duration: 155,
        rating: 14,
        category: 'em-cartaz',
        description: 'Uma aventura épica em um planeta hostil e fascinante.'
    },
    {
        id: 2,
        title: 'O Rei Leão',
        genre: 'Animação',
        year: 2019,
        duration: 118,
        rating: 0,
        category: 'em-cartaz',
        description: 'Uma história emocionante sobre coragem, família e destino.'
    },
    {
        id: 3,
        title: 'Matrix',
        genre: 'Ação',
        year: 1999,
        duration: 136,
        rating: 16,
        category: 'classicos',
        description: 'Uma revolução tecnológica e uma jornada de liberdade.'
    },
    {
        id: 4,
        title: 'Pulp Fiction',
        genre: 'Crime',
        year: 1994,
        duration: 154,
        rating: 18,
        category: 'classicos',
        description: 'Uma obra intensa e irreverente com histórias entrelaçadas.'
    },
    {
        id: 5,
        title: 'A Origem',
        genre: 'Suspense',
        year: 2010,
        duration: 148,
        rating: 14,
        category: 'em-cartaz',
        description: 'Uma jornada complexa dentro dos sonhos e da mente humana.'
    },
    {
        id: 6,
        title: 'Interestelar',
        genre: 'Drama',
        year: 2014,
        duration: 169,
        rating: 10,
        category: 'futuro',
        description: 'Uma missão para salvar a humanidade através do espaço.'
    },
    {
        id: 7,
        title: 'Mad Max: Estrada da Fúria',
        genre: 'Aventura',
        year: 2015,
        duration: 120,
        rating: 16,
        category: 'futuro',
        description: 'A sobrevivência, a violência e a esperança em um futuro brutal.'
    }
];

function generateId() {
    return Date.now() + Math.floor(Math.random() * 10000);
}

function getFilmes() {
    const dados = localStorage.getItem(STORAGE_KEY);

    if (!dados) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filmesPadrao));
        return [...filmesPadrao];
    }

    try {
        const filmes = JSON.parse(dados);
        return Array.isArray(filmes) && filmes.length ? filmes : [...filmesPadrao];
    } catch {
        return [...filmesPadrao];
    }
}

function salvarFilmes(filmes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filmes));
}

function getClassificacao(rating) {
    if (rating === 0) {
        return 'Livre';
    }

    return `${rating} anos`;
}

function renderizarFilmesHome() {
    const filmes = getFilmes();
    const tracks = document.querySelectorAll('.carrossel-track');

    tracks.forEach((track) => {
        const categoria = track.dataset.section;
        const filmesCategoria = filmes.filter((filme) => filme.category === categoria);

        if (!filmesCategoria.length) {
            track.innerHTML = '<div class="empty-state">Nenhum filme nesta categoria.</div>';
            return;
        }

        track.innerHTML = filmesCategoria.map((filme) => `
            <article class="filme-card">
                <div class="filme-poster">
                    <span>${filme.genre}</span>
                </div>
                <div class="filme-info">
                    <h3>${filme.title}</h3>
                    <p>${filme.year}</p>
                    <p><strong>Gênero:</strong> ${filme.genre}</p>
                    <p><strong>Duração:</strong> ${filme.duration} min</p>
                    <p><strong>Classificação:</strong> ${getClassificacao(filme.rating)}</p>
                    <p class="descricao">${filme.description}</p>
                    <div class="card-actions">
                        <a class="card-btn secondary" href="editar.html?id=${filme.id}">Editar</a>
                        <button class="card-btn danger" type="button" data-action="deletar" data-id="${filme.id}">Deletar</button>
                    </div>
                </div>
            </article>
        `).join('');
    });

    document.querySelectorAll('.carrossel-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const carrossel = button.closest('.carrossel');
            const track = carrossel.querySelector('.carrossel-track');
            const direction = button.classList.contains('next') ? 1 : -1;
            track.scrollBy({
                left: direction * 300,
                behavior: 'smooth'
            });
        });
    });

    document.querySelectorAll('[data-action="deletar"]').forEach((botao) => {
        botao.addEventListener('click', (event) => {
            const id = Number(event.currentTarget.dataset.id);
            const filmesAtualizados = getFilmes().filter((filme) => filme.id !== id);
            salvarFilmes(filmesAtualizados);
            renderizarFilmesHome();
        });
    });
}

function inicializarCadastro() {
    const form = document.getElementById('cadastroForm');

    if (!form) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const novoFilme = {
            id: generateId(),
            title: formData.get('title').toString().trim(),
            genre: formData.get('genre').toString().trim(),
            year: Number(formData.get('year')),
            duration: Number(formData.get('duration')),
            rating: Number(formData.get('rating')),
            category: formData.get('category').toString(),
            description: formData.get('description').toString().trim()
        };

        const filmes = getFilmes();
        filmes.push(novoFilme);
        salvarFilmes(filmes);
        alert('Filme cadastrado com sucesso!');
        window.location.href = 'index.html';
    });
}

function getIdSelecionado() {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id'));
    return Number.isNaN(id) ? null : id;
}

function inicializarEdicao() {
    const lista = document.getElementById('listaEdicao');

    if (!lista) {
        return;
    }

    const filmes = getFilmes();
    const filmeSelecionado = filmes.find((filme) => filme.id === getIdSelecionado());

    if (!filmeSelecionado) {
        lista.innerHTML = '<p class="empty-state">Selecione um filme na página inicial para editar.</p>';
        return;
    }

    lista.innerHTML = `
        <form class="form-edicao" data-id="${filmeSelecionado.id}">
            <div class="campo">
                <label>Título</label>
                <input name="title" value="${filmeSelecionado.title}" required>
            </div>
            <div class="campo-duplo">
                <div class="campo">
                    <label>Gênero</label>
                    <input name="genre" value="${filmeSelecionado.genre}" required>
                </div>
                <div class="campo">
                    <label>Ano</label>
                    <input name="year" type="number" value="${filmeSelecionado.year}" required>
                </div>
            </div>
            <div class="campo-duplo">
                <div class="campo">
                    <label>Duração</label>
                    <input name="duration" type="number" value="${filmeSelecionado.duration}" required>
                </div>
                <div class="campo">
                    <label>Classificação</label>
                    <input name="rating" type="number" min="0" max="18" value="${filmeSelecionado.rating}" required>
                </div>
            </div>
            <div class="campo">
                <label>Categoria</label>
                <select name="category">
                    <option value="em-cartaz" ${filmeSelecionado.category === 'em-cartaz' ? 'selected' : ''}>Em cartaz</option>
                    <option value="classicos" ${filmeSelecionado.category === 'classicos' ? 'selected' : ''}>Clássicos</option>
                    <option value="futuro" ${filmeSelecionado.category === 'futuro' ? 'selected' : ''}>Em breve</option>
                </select>
            </div>
            <div class="campo">
                <label>Descrição</label>
                <textarea name="description" rows="3" required>${filmeSelecionado.description}</textarea>
            </div>
            <div class="acoes-edicao">
                <button type="submit" class="primary-btn small">Salvar</button>
                <button type="button" class="danger-btn small" data-action="delete-edit" data-id="${filmeSelecionado.id}">Excluir</button>
            </div>
        </form>
    `;

    lista.addEventListener('submit', (event) => {
        const form = event.target;

        if (!form.matches('.form-edicao')) {
            return;
        }

        event.preventDefault();
        const id = Number(form.dataset.id);
        const filmesAtualizados = getFilmes().map((filme) => {
            if (filme.id !== id) {
                return filme;
            }

            return {
                ...filme,
                title: form.title.value.trim(),
                genre: form.genre.value.trim(),
                year: Number(form.year.value),
                duration: Number(form.duration.value),
                rating: Number(form.rating.value),
                category: form.category.value,
                description: form.description.value.trim()
            };
        });

        salvarFilmes(filmesAtualizados);
        alert('Filme atualizado com sucesso!');
        window.location.href = 'index.html';
    });

    lista.addEventListener('click', (event) => {
        if (!event.target.matches('[data-action="delete-edit"]')) {
            return;
        }

        const id = Number(event.target.dataset.id);
        const filmesAtualizados = getFilmes().filter((filme) => filme.id !== id);
        salvarFilmes(filmesAtualizados);
        alert('Filme removido com sucesso!');
        window.location.href = 'index.html';
    });
}

function iniciarApp() {
    const page = document.body.dataset.page;

    if (page === 'home') {
        renderizarFilmesHome();
    }

    if (page === 'cadastro') {
        inicializarCadastro();
    }

    if (page === 'editar') {
        inicializarEdicao();
    }
}

iniciarApp();