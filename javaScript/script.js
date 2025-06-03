// Definir variáveis globais com valores padrão
let selectedModel = localStorage.getItem('selectedModel') || 'xre190';
let selectedColor = localStorage.getItem('selectedColor') || 'cinza';
let selectedSticker = localStorage.getItem('selectedSticker') || '';
let selectedPage = localStorage.getItem('selectedPage') || '../pages/modelos.html';
// Função para trocar de página
function switchPage(url) {
    window.location.href = url;
}

// --------- LOGIN E CADASTRO ---------
document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toRegister = document.getElementById('toRegister');
    const toLogin = document.getElementById('toLogin');
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');
    const registerSuccess = document.getElementById('registerSuccess');
    const fotoInput = document.getElementById('fotoPerfil');
    const previewFotoPerfil = document.getElementById('previewFotoPerfil');

    // Utilitários
    function validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function validarSenhaForte(senha) {
        return senha.length >= 6;
    }
    function limparCampos(form) {
        form.querySelectorAll('input').forEach(input => input.value = '');
        if (previewFotoPerfil) previewFotoPerfil.src = '../img/usuario.png';
        if (fotoInput) fotoInput.value = '';
    }
    function marcarErro(input, condicao) {
        if (condicao) input.style.borderColor = '#e74c3c';
        else input.style.borderColor = '';
    }

    // Alternância de abas
    function showLogin() {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = '';
        registerForm.style.display = 'none';
        loginError.textContent = '';
        registerError.textContent = '';
        registerSuccess.textContent = '';
        limparCampos(registerForm);
        // Foca no campo de e-mail do login
        const emailInput = loginForm.querySelector('input[type="email"]');
        if (emailInput) emailInput.focus();
    }
    function showRegister() {
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        loginForm.style.display = 'none';
        registerForm.style.display = '';
        loginError.textContent = '';
        registerError.textContent = '';
        registerSuccess.textContent = '';
        limparCampos(loginForm);
    }
    loginTab.onclick = showLogin;
    registerTab.onclick = showRegister;
    toRegister.onclick = (e) => { e.preventDefault(); showRegister(); };
    toLogin.onclick = (e) => { e.preventDefault(); showLogin(); };

    // Login
    loginForm.onsubmit = function(e) {
        e.preventDefault();
        const emailInput = loginForm.querySelector('input[type="email"]');
        const senhaInput = loginForm.querySelector('input[type="password"]');
        const email = emailInput.value.trim();
        const senha = senhaInput.value;

        marcarErro(emailInput, !validarEmail(email));
        marcarErro(senhaInput, senha.length < 6);

        if (!validarEmail(email)) {
            loginError.textContent = 'E-mail inválido.';
            return;
        }
        if (senha.length < 6) {
            loginError.textContent = 'Senha deve ter pelo menos 6 caracteres.';
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuario = usuarios.find(u => u.email === email && u.senha === senha);

        if (usuario) {
            loginError.textContent = '';
            localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
            window.location.href = '../pages/modelos.html';
        } else {
            loginError.textContent = 'E-mail ou senha inválidos.';
        }
    };

    // Pré-visualização da foto de perfil
    if (fotoInput && previewFotoPerfil) {
        fotoInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewFotoPerfil.src = e.target.result;
                };
                reader.readAsDataURL(this.files[0]);
            } else {
                previewFotoPerfil.src = '../img/usuario.png';
            }
        });
    }

    // Cadastro
    registerForm.onsubmit = function(e) {
        e.preventDefault();
        registerError.textContent = '';
        registerSuccess.textContent = '';
        const inputs = registerForm.querySelectorAll('input');
        const nomeInput = registerForm.querySelector('input[placeholder="Nome completo"]');
        const emailInput = registerForm.querySelector('input[placeholder="E-mail"]');
        const senhaInput = registerForm.querySelector('input[placeholder="Senha"]');
        const confirmaSenhaInput = registerForm.querySelector('input[placeholder="Confirme a senha"]');

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const senha = senhaInput.value;
        const confirmaSenha = confirmaSenhaInput.value;

        // Marcação de erro
        marcarErro(nomeInput, nome === '');
        marcarErro(emailInput, !validarEmail(email));
        marcarErro(senhaInput, !validarSenhaForte(senha));
        marcarErro(confirmaSenhaInput, senha !== confirmaSenha);

        if (nome === '') {
            registerError.textContent = 'Nome obrigatório.';
            return;
        }
        if (!validarEmail(email)) {
            registerError.textContent = 'E-mail inválido.';
            return;
        }
        if (!validarSenhaForte(senha)) {
            registerError.textContent = 'Senha deve ter pelo menos 6 caracteres.';
            return;
        }
        if (senha !== confirmaSenha) {
            registerError.textContent = 'As senhas não coincidem.';
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        if (usuarios.some(u => u.email === email)) {
            registerError.textContent = 'E-mail já cadastrado.';
            return;
        }

        // Ler a imagem como base64
        if (fotoInput && fotoInput.files && fotoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                const fotoPerfil = evt.target.result;
                usuarios.push({ nome, email, senha, fotoPerfil });
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                registerError.textContent = '';
                abrirModalCadastroSucesso();
            };
            reader.readAsDataURL(fotoInput.files[0]);
        } else {
            // Sem foto
            usuarios.push({ nome, email, senha, fotoPerfil: '../img/usuario.png' });
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            registerError.textContent = '';
            abrirModalCadastroSucesso();
        }
    };

    // Toggle de visualização de senha
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
            } else {
                input.type = 'password';
            }
        });
    });

    // Função para abrir o modal de cadastro sucesso
    function abrirModalCadastroSucesso() {
        const modal = document.getElementById('modalCadastroSucesso');
        modal.style.display = 'flex';
        document.getElementById('btnFecharModalCadastro').onclick = function() {
            modal.style.display = 'none';
            showLogin();
        };
        // Também fecha ao pressionar ESC
        document.onkeydown = function(e) {
            if (e.key === "Escape") {
                modal.style.display = 'none';
                showLogin();
            }
        };
    }
});

// --------- MODELOS ---------
document.addEventListener('DOMContentLoaded', function() {
    // Carregar modelos na página de modelos
    const modelosContainer = document.getElementById('miniaturas-modelos');
    if (modelosContainer) {
        const modelos = [
            { id: 'xre190', nome: 'XRE 190', img: '../img/xre190.png' },
            { id: 'fan160', nome: 'Fan 160', img: '../img/fan160.png' },
            { id: 'cb300f', nome: 'CB 300F', img: '../img/cb300f.png' },
            { id: 'xre300', nome: 'XRE 300', img: '../img/xre300.png' },
        ];
        modelos.forEach(modelo => {
            const div = document.createElement('div');
            div.className = 'miniatura';
            div.setAttribute('data-model', modelo.id);

            const radio = document.createElement('input');
            radio.className = 'radio';
            radio.type = 'radio';
            radio.name = 'moto';
            radio.id = `moto-${modelo.id}`;
            radio.value = modelo.id;
            if (localStorage.getItem('selectedModel') === modelo.id) radio.checked = true;
            radio.onchange = () => selectModel(modelo.id);

            const label = document.createElement('label');
            label.htmlFor = `moto-${modelo.id}`;
            label.className = 'miniatura-label';

            const img = document.createElement('img');
            img.src = modelo.img;
            img.alt = modelo.nome;
            img.onclick = () => {
                radio.checked = true;
                selectModel(modelo.id);
            };

            label.appendChild(img);
            div.appendChild(radio);
            div.appendChild(label);
            modelosContainer.appendChild(div);
        });
    }
});

// --------- CORES ---------
document.addEventListener('DOMContentLoaded', function() {
    // Carregar cores na página de cores
    const coresContainer = document.getElementById('miniaturas-cores');
    if (coresContainer) {
        const selectedModel = localStorage.getItem('selectedModel') || 'xre190';
        const cores = ["cinza", "roxo", "laranja", "vermelho"];
        cores.forEach(cor => {
            const div = document.createElement('div');
            div.className = 'miniatura';
            div.setAttribute('data-color', cor);

            const radio = document.createElement('input');
            radio.className = 'radio';
            radio.type = 'radio';
            radio.name = 'cor';
            radio.id = `cor-${cor}`;
            radio.value = cor;
            if (localStorage.getItem('selectedColor') === cor) radio.checked = true;
            radio.onchange = () => selectColor(cor);

            const label = document.createElement('label');
            label.htmlFor = `cor-${cor}`;
            label.className = 'miniatura-label';

            const img = document.createElement('img');
            img.src = `../img/${selectedModel}_${cor}.png`;
            img.alt = cor;
            img.onclick = () => {
                radio.checked = true;
                selectColor(cor);
            };

            label.appendChild(img);
            div.appendChild(radio);
            div.appendChild(label);
            coresContainer.appendChild(div);
        });
    }
});

// --------- ADESIVOS ---------
document.addEventListener('DOMContentLoaded', function() {
    // Carregar adesivos na página de adesivos
    const adesivosContainer = document.getElementById('miniaturas-adesivos');
    if (adesivosContainer) {
        const selectedModel = localStorage.getItem('selectedModel') || 'xre190';
        const selectedColor = localStorage.getItem('selectedColor') || 'cinza';
        const stickersByColor = {
            cinza: ["mod1", "mod2", "mod3", "mod4"],
            roxo: ["mod1", "mod2", "mod3", "mod4"],
            laranja: ["mod1", "mod2", "mod3", "mod4"],
            vermelho: ["mod1", "mod2", "mod3", "mod4"]
        };
        const valoresAdesivos = {
            mod1: 150,
            mod2: 200,
            mod3: 250,
            mod4: 150
        };
        const adesivos = stickersByColor[selectedColor] || [];
        adesivos.forEach(sticker => {
            const div = document.createElement('div');
            div.className = 'miniatura';

            const radio = document.createElement('input');
            radio.className = 'radio';
            radio.type = 'radio';
            radio.name = 'adesivo';
            radio.id = `adesivo-${sticker}`;
            radio.value = sticker;
            if (localStorage.getItem('selectedSticker') === sticker) radio.checked = true;
            radio.onchange = () => selectSticker(sticker);

            console.log(`adesivo-${sticker}`)

            const label = document.createElement('label');
            label.htmlFor = `adesivo-${sticker}`;
            label.className = 'miniatura-label';

            const img = document.createElement('img');
            img.src = `../img/${selectedModel}_${selectedColor}_${sticker}.png`;
            img.alt = sticker;
            img.onclick = () => {
                radio.checked = true;
                selectSticker(sticker);
            };

            const valorSpan = document.createElement('span');
            valorSpan.style.display = "block";
            valorSpan.style.marginTop = "8px";
            valorSpan.style.color = "#fff";
            valorSpan.textContent = `R$ ${valoresAdesivos[sticker].toFixed(2).replace('.', ',')}`;

            label.appendChild(img);
            label.appendChild(valorSpan);
            div.appendChild(radio);
            div.appendChild(label);
            adesivosContainer.appendChild(div);
        });
    }
});

// --------- MINHA GARAGEM ---------
document.addEventListener('DOMContentLoaded', function() {
    // Carregar informações na página minhaGaragem.html
    if (document.getElementById('modeloSelecionado')) {
        loadGarage();
    }
});

// Funções de seleção e salvar
function selectModel(model) {
    localStorage.setItem('selectedModel', model);
    document.getElementById('motoImg').src = `../img/${model}.png`;
    let btnAvancar = document.querySelector('.btn.avancar');
    if (btnAvancar) btnAvancar.disabled = false;
}
function selectColor(color) {
    localStorage.setItem('selectedColor', color);
    const selectedModel = localStorage.getItem('selectedModel') || 'xre190';
    document.getElementById('motoImg').src = `../img/${selectedModel}_${color}.png`;
    let btnAvancar = document.querySelector('.btn.avancar');
    if (btnAvancar) btnAvancar.disabled = false;
}
function selectSticker(sticker) {
    localStorage.setItem('selectedSticker', sticker);
    const selectedModel = localStorage.getItem('selectedModel') || 'xre190';
    const selectedColor = localStorage.getItem('selectedColor') || 'cinza';
    document.getElementById('motoImg').src = `../img/${selectedModel}_${selectedColor}_${sticker}.png`;
    let btnAvancar = document.querySelector('.btn.avancar');
    if (btnAvancar) btnAvancar.disabled = false;
}

// Carrega informações da garagem na página minhaGaragem.html
function loadGarage() {
    const modelosAmigaveis = {
        xre190: "XRE 190",
        fan160: "Fan 160",
        cb300f: "CB 300F",
        xre300: "XRE 300",
    };
    const coresAmigaveis = {
        cinza: "Cinza",
        roxo: "Roxo",
        laranja: "Laranja",
        vermelho: "Vermelho",
    };
    const adesivosAmigaveis = {
        mod1: "Adesivo 1",
        mod2: "Adesivo 2",
        mod3: "Adesivo 3",
        mod4: "Adesivo 4"
    };
    const valoresAdesivos = {
        mod1: 150,
        mod2: 200,
        mod3: 250,
        mod4: 150
    };

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    const garagemKey = 'garagem_' + usuarioLogado.email;
    const garagem = JSON.parse(localStorage.getItem(garagemKey) || '[]');

    // Verifica se veio da navbar para mostrar só os cards
    const somenteCards = window.location.search.includes('somenteCards=1');

    const motoImg = document.getElementById('motoImg');
    if (motoImg) {
        if (somenteCards) {
            motoImg.src = "";
            motoImg.style.opacity = "0"; // Esconde visualmente
        } else {
            let previewModelo = localStorage.getItem('selectedModel') || 'xre190';
            let previewCor = localStorage.getItem('selectedColor') || 'cinza';
            let previewAdesivo = localStorage.getItem('selectedSticker') || '';
            if (previewAdesivo) {
                motoImg.src = `../img/${previewModelo}_${previewCor}_${previewAdesivo}.png`;
            } else {
                motoImg.src = `../img/${previewModelo}_${previewCor}.png`;
            }
            motoImg.style.opacity = "1";
        }
    }

    // Atualiza o valor total
    const totalElement = document.getElementById('totalGaragem');
    if (totalElement) {
        totalElement.textContent = "R$ 0,00";
    }

    // Exibir cards das motos salvas
    const cardsContainer = document.getElementById('cardsGaragem');
    if (cardsContainer) {
        cardsContainer.innerHTML = '';
        if (garagem.length === 0) {
            // Garagem vazia
            const vazio = document.createElement('div');
            vazio.style.color = "#fff";
            vazio.style.marginTop = "40px";
            vazio.textContent = "Sua garagem está vazia.";
            cardsContainer.appendChild(vazio);
        } else {
            garagem.forEach(moto => {
                const card = document.createElement('div');
                card.className = 'card-garagem';

                // Botão deletar
                const btnDel = document.createElement('button');
                btnDel.className = 'btn-deletar-card';
                btnDel.title = 'Excluir projeto';
                btnDel.innerHTML = '&times;';
                btnDel.onclick = (ev) => {
                    ev.stopPropagation();
                    abrirModalExcluir(() => deletarMoto(moto.id));
                };
                card.appendChild(btnDel);

                // Imagem da moto (com adesivo se houver)
                let imgSrc = `../img/${moto.modelo}_${moto.cor}.png`;
                if (moto.adesivo) {
                    imgSrc = `../img/${moto.modelo}_${moto.cor}_${moto.adesivo}.png`;
                }
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = 'Moto';

                // Info do card com título e detalhes
                const info = document.createElement('div');
                info.className = 'card-garagem-info';
                info.innerHTML = `
                    <strong>${moto.titulo ? moto.titulo : (modelosAmigaveis[moto.modelo] || moto.modelo)}</strong><br>
                    Modelo: ${modelosAmigaveis[moto.modelo] || moto.modelo}<br>
                    Cor: ${coresAmigaveis[moto.cor] || moto.cor}<br>
                    Adesivo: ${adesivosAmigaveis[moto.adesivo] || '-'}<br>
                `;

                card.appendChild(img);
                card.appendChild(info);

                // Ao clicar no card, mostra a moto na imagem grande
                card.onclick = function() {
                    if (motoImg) {
                        motoImg.src = imgSrc;
                        motoImg.style.opacity = "1";
                    }
                    // Atualiza o valor total conforme o card clicado
                    if (totalElement) {
                        let valor = 0;
                        if (moto.adesivo && valoresAdesivos[moto.adesivo]) {
                            valor = valoresAdesivos[moto.adesivo];
                        }
                        totalElement.textContent = `R$ ${valor.toFixed(2).replace('.', ',')}`;
                    }
                };

                cardsContainer.appendChild(card);
            });
        }
    }
}

// Função para abrir o modal de título
function abrirModalTitulo(callbackSalvar) {
    const modal = document.getElementById('modalTitulo');
    const input = document.getElementById('inputTituloProjeto');
    modal.style.display = 'flex';
    input.value = '';
    input.focus();

    // Salvar
    const salvar = () => {
        let titulo = input.value.trim();
        if (!titulo) titulo = 'Projeto sem nome';
        modal.style.display = 'none';
        callbackSalvar(titulo);
    };
    // Cancelar
    const cancelar = () => {
        modal.style.display = 'none';
    };

    document.getElementById('btnSalvarTitulo').onclick = salvar;
    document.getElementById('btnCancelarTitulo').onclick = cancelar;
    input.onkeydown = function(e) {
        if (e.key === 'Enter') salvar();
        if (e.key === 'Escape') cancelar();
    };
}

// Substitua a função salvarMoto por esta:
function salvarMoto() {
    abrirModalTitulo(function(titulo) {
        // Use valores padrão se algum campo estiver vazio ou nulo
        const modelo = localStorage.getItem('selectedModel') || 'xre190';
        const cor = localStorage.getItem('selectedColor') || 'cinza';
        const adesivo = localStorage.getItem('selectedSticker') || '';
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        if (!usuarioLogado.email) {
            alert('Faça login para salvar sua moto!');
            return;
        }
        if (!modelo || !cor || !adesivo) {
            alert('Selecione modelo, cor e adesivo antes de salvar!');
            return;
        }
        const garagemKey = 'garagem_' + usuarioLogado.email;
        const moto = {
            id: Date.now(),
            modelo,
            cor,
            adesivo,
            titulo
        };
        let garagem = JSON.parse(localStorage.getItem(garagemKey)) || [];
        garagem.push(moto);
        localStorage.setItem(garagemKey, JSON.stringify(garagem));
        localStorage.setItem('ultimaMotoSelecionada', moto.id);
        loadGarage();
    });
}

// Função para deletar um card
function deletarMoto(idMoto) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    const garagemKey = 'garagem_' + usuarioLogado.email;
    let garagem = JSON.parse(localStorage.getItem(garagemKey)) || [];
    garagem = garagem.filter(m => m.id !== idMoto);
    localStorage.setItem(garagemKey, JSON.stringify(garagem));
    // Se deletou a selecionada, limpa seleção
    if (localStorage.getItem('ultimaMotoSelecionada') == idMoto) {
        localStorage.removeItem('ultimaMotoSelecionada');
    }
    loadGarage();
}

// Função para abrir o modal de exclusão
function abrirModalExcluir(callbackConfirmar) {
    const modal = document.getElementById('modalExcluir');
    modal.style.display = 'flex';

    const confirmar = () => {
        modal.style.display = 'none';
        callbackConfirmar();
    };
    const cancelar = () => {
        modal.style.display = 'none';
    };

    document.getElementById('btnConfirmarExcluir').onclick = confirmar;
    document.getElementById('btnCancelarExcluir').onclick = cancelar;
}

// Atualize a função loadGarage para incluir o botão deletar:
function loadGarage() {
    const modelosAmigaveis = {
        xre190: "XRE 190",
        fan160: "Fan 160",
        cb300f: "CB 300F",
        xre300: "XRE 300"
    };
    const coresAmigaveis = {
        cinza: "Cinza",
        roxo: "Roxo",
        laranja: "Laranja",
        vermelho: "Vermelho"
    };
    const adesivosAmigaveis = {
        mod1: "Adesivo 1",
        mod2: "Adesivo 2",
        mod3: "Adesivo 3",
        mod4: "Adesivo 4"
    };
    const valoresAdesivos = {
        mod1: 150,
        mod2: 200,
        mod3: 250,
        mod4: 150
    };

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    const garagemKey = 'garagem_' + usuarioLogado.email;
    const garagem = JSON.parse(localStorage.getItem(garagemKey) || '[]');

    // Verifica se veio da navbar para mostrar só os cards
    const somenteCards = window.location.search.includes('somenteCards=1');

    const motoImg = document.getElementById('motoImg');
    if (motoImg) {
        if (somenteCards) {
            motoImg.src = "";
            motoImg.style.opacity = "0"; // Esconde visualmente
        } else {
            let previewModelo = localStorage.getItem('selectedModel') || 'xre190';
            let previewCor = localStorage.getItem('selectedColor') || 'cinza';
            let previewAdesivo = localStorage.getItem('selectedSticker') || '';
            if (previewAdesivo) {
                motoImg.src = `../img/${previewModelo}_${previewCor}_${previewAdesivo}.png`;
            } else {
                motoImg.src = `../img/${previewModelo}_${previewCor}.png`;
            }
            motoImg.style.opacity = "1";
        }
    }

    // Atualiza o valor total
    const totalElement = document.getElementById('totalGaragem');
    if (totalElement) {
        totalElement.textContent = "R$ 0,00";
    }

    // Exibir cards das motos salvas
    const cardsContainer = document.getElementById('cardsGaragem');
    if (cardsContainer) {
        cardsContainer.innerHTML = '';
        if (garagem.length === 0) {
            // Garagem vazia
            const vazio = document.createElement('div');
            vazio.style.color = "#fff";
            vazio.style.marginTop = "40px";
            vazio.textContent = "Sua garagem está vazia.";
            cardsContainer.appendChild(vazio);
        } else {
            garagem.forEach(moto => {
                const card = document.createElement('div');
                card.className = 'card-garagem';

                // Botão deletar
                const btnDel = document.createElement('button');
                btnDel.className = 'btn-deletar-card';
                btnDel.title = 'Excluir projeto';
                btnDel.innerHTML = '&times;';
                btnDel.onclick = (ev) => {
                    ev.stopPropagation();
                    abrirModalExcluir(() => deletarMoto(moto.id));
                };
                card.appendChild(btnDel);

                // Imagem da moto (com adesivo se houver)
                let imgSrc = `../img/${moto.modelo}_${moto.cor}.png`;
                if (moto.adesivo) {
                    imgSrc = `../img/${moto.modelo}_${moto.cor}_${moto.adesivo}.png`;
                }
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = 'Moto';

                // Info do card com título e detalhes
                const info = document.createElement('div');
                info.className = 'card-garagem-info';
                info.innerHTML = `
                    <strong>${moto.titulo ? moto.titulo : (modelosAmigaveis[moto.modelo] || moto.modelo)}</strong><br>
                    Modelo: ${modelosAmigaveis[moto.modelo] || moto.modelo}<br>
                    Cor: ${coresAmigaveis[moto.cor] || moto.cor}<br>
                    Adesivo: ${adesivosAmigaveis[moto.adesivo] || '-'}<br>
                `;

                card.appendChild(img);
                card.appendChild(info);

                // Ao clicar no card, mostra a moto na imagem grande
                card.onclick = function() {
                    if (motoImg) {
                        motoImg.src = imgSrc;
                        motoImg.style.opacity = "1";
                    }
                    // Atualiza o valor total conforme o card clicado
                    if (totalElement) {
                        let valor = 0;
                        if (moto.adesivo && valoresAdesivos[moto.adesivo]) {
                            valor = valoresAdesivos[moto.adesivo];
                        }
                        totalElement.textContent = `R$ ${valor.toFixed(2).replace('.', ',')}`;
                    }
                };

                cardsContainer.appendChild(card);
            });
        }
    }
}

// Função para carregar opções de cor
function loadColorOptions() {
    const selectedModel = localStorage.getItem('selectedModel') || 'xre190';
    const selectedColor = localStorage.getItem('selectedColor') || 'cinza';

    // Atualiza a imagem principal da moto ao entrar na página
    const motoImg = document.getElementById('motoImg');
    if (motoImg) {
        motoImg.src = `../img/${selectedModel}_${selectedColor}.png`;
    }

    let miniaturasContainer = document.getElementById('miniaturas-cores');
    let coresDisponiveis = ["cinza", "roxo", "laranja", "vermelho"];

    miniaturasContainer.innerHTML = '';

    coresDisponiveis.forEach(cor => {
        let miniaturaDiv = document.createElement('div');
        miniaturaDiv.className = 'miniatura';
        miniaturaDiv.setAttribute('data-color', cor);

        let radio = document.createElement('input');
        radio.className = 'radio';
        radio.type = 'radio';
        radio.name = 'cor';
        radio.id = `cor-${cor}`;
        radio.value = cor;
        if (cor === selectedColor) radio.checked = true;
        radio.onchange = function() {
            selectColor(cor);
        };

        let label = document.createElement('label');
        label.htmlFor = `cor-${cor}`;
        label.className = 'miniatura-label';

        let img = document.createElement('img');
        img.src = `../img/${selectedModel}_${cor}.png`;
        img.alt = cor;
        img.onclick = function() {
            radio.checked = true;
            selectColor(cor);
        };

        label.appendChild(img);
        miniaturaDiv.appendChild(radio);
        miniaturaDiv.appendChild(label);

        miniaturasContainer.appendChild(miniaturaDiv);
    });

    let btnAvancar = document.querySelector('.btn.avancar');
    if (btnAvancar) btnAvancar.disabled = !selectedColor;
}

// Função para carregar opções de adesivo
function loadStickerOptions() {
    const selectedModel = localStorage.getItem('selectedModel') || 'xre190';
    const selectedColor = localStorage.getItem('selectedColor') || 'cinza';
    const selectedSticker = localStorage.getItem('selectedSticker') || '';

    // Atualiza a imagem principal da moto ao entrar na página de adesivos
    const motoImg = document.getElementById('motoImg');
    if (motoImg) {
        if (selectedSticker) {
            motoImg.src = `../img/${selectedModel}_${selectedColor}_${selectedSticker}.png`;
        } else {
            motoImg.src = `../img/${selectedModel}_${selectedColor}.png`;
        }
    }

    let miniaturasContainer = document.getElementById('miniaturas-adesivos');
    const stickersByColor = {
        cinza: ["mod1", "mod2", "mod3", "mod4"],
        roxo: ["mod1", "mod2", "mod3", "mod4"],
        laranja: ["mod1", "mod2", "mod3", "mod4"],
        vermelho: ["mod1", "mod2", "mod3", "mod4"]
    };
    const valoresAdesivos = {
        mod1: 150,
        mod2: 200,
        mod3: 250,
        mod4: 150
    };
    let adesivosDisponiveis = stickersByColor[selectedColor] || [];

    miniaturasContainer.innerHTML = '';

    adesivosDisponiveis.forEach(sticker => {
        let miniaturaDiv = document.createElement('div');
        miniaturaDiv.className = 'miniatura';

        let radio = document.createElement('input');
        radio.className = 'radio';
        radio.type = 'radio';
        radio.name = 'adesivo';
        radio.id = `adesivo-${sticker}`;
        radio.value = sticker;
        if (selectedSticker === sticker) radio.checked = true;
        radio.onchange = function() {
            selectSticker(sticker);
            atualizarTotalAdesivo(sticker); // Atualiza o preço ao selecionar
        };

        let label = document.createElement('label');
        label.htmlFor = `adesivo-${sticker}`;
        label.className = 'miniatura-label';

        let img = document.createElement('img');
        img.src = `../img/${selectedModel}_${selectedColor}_${sticker}.png`;
        img.alt = sticker;
        img.onclick = function() {
            radio.checked = true;
            selectSticker(sticker);
            atualizarTotalAdesivo(sticker); // Atualiza o preço ao clicar na imagem
        };

        // Valor do adesivo
        let valorSpan = document.createElement('span');
        valorSpan.style.display = "block";
        valorSpan.style.marginTop = "8px";
        valorSpan.style.color = "#fff";

        console.log(valoresAdesivos[sticker]);

        valorSpan.textContent = `R$ ${valoresAdesivos[sticker].toFixed(2).replace('.', ',')}`;

        label.appendChild(img);
        label.appendChild(valorSpan);
        miniaturaDiv.appendChild(radio);
        miniaturaDiv.appendChild(label);

        miniaturasContainer.appendChild(miniaturaDiv);
    });

    let btnAvancar = document.querySelector('.btn.avancar');
    if (btnAvancar) {
        // Habilita só se houver adesivo selecionado
        const selectedSticker = localStorage.getItem('selectedSticker') || '';
        btnAvancar.disabled = !(selectedSticker && selectedSticker.length > 0);
    }

    // Atualiza o preço ao carregar a página
    atualizarTotalAdesivo(selectedSticker);

    // Função para atualizar o preço total
    function atualizarTotalAdesivo(sticker) {
        const totalElement = document.querySelector('footer p strong');
        if (totalElement) {
            if (sticker && valoresAdesivos[sticker]) {
                totalElement.textContent = `R$ ${valoresAdesivos[sticker].toFixed(2).replace('.', ',')}`;
            } else {
                totalElement.textContent = 'R$ 0,00';
            }
        }
    }
}

// Função para salvar moto e avançar para a página da garagem
function salvarMotoEAvancar() {
    abrirModalTitulo(function(titulo) {
        const modelo = localStorage.getItem('selectedModel');
        const cor = localStorage.getItem('selectedColor');
        const adesivo = localStorage.getItem('selectedSticker');
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        if (!usuarioLogado.email) {
            alert('Faça login para salvar sua moto!');
            return;
        }
        if (!modelo || !cor || !adesivo) {
            alert('Selecione modelo, cor e adesivo antes de salvar!');
            return;
        }
        const garagemKey = 'garagem_' + usuarioLogado.email;
        const moto = {
            id: Date.now(),
            modelo,
            cor,
            adesivo,
            titulo
        };
        let garagem = JSON.parse(localStorage.getItem(garagemKey)) || [];
        garagem.push(moto);
        localStorage.setItem(garagemKey, JSON.stringify(garagem));
        localStorage.setItem('ultimaMotoSelecionada', moto.id);
        // Agora redireciona para a página 4
        window.location.href = '../pages/minhaGaragem.html';
    });
}

// Função para avançar para a página da minha moto
function avancarParaMinhaMoto() {
    // Apenas direciona para a página 4, sem salvar como card ainda
    window.location.href = '../pages/minhaGaragem.html';
}

// Função para criar novo projeto
function novoProjeto() {
    // Só permite se estiver logado
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    if (!usuarioLogado.email) {
        alert('Faça login para criar um novo projeto!');
        return;
    }
    // Limpa seleção atual para novo projeto
    localStorage.removeItem('selectedModel');
    localStorage.removeItem('selectedColor');
    localStorage.removeItem('selectedSticker');
    localStorage.removeItem('ultimaMotoSelecionada');
    // Vai para página 1 (modelos)
    window.location.href = '../pages/modelos.html';
}

const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
const userIcon = document.getElementById('navbarUserIcon');
if (userIcon) {
    if (usuarioLogado.fotoPerfil && usuarioLogado.fotoPerfil.startsWith('data:image/')) {
        userIcon.src = usuarioLogado.fotoPerfil;
    } else {
        userIcon.src = '../img/usuario.png'; // Caminho do ícone padrão
    }
}

