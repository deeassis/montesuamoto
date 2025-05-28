// Definir variáveis globais com valores padrão
let selectedModel = localStorage.getItem('selectedModel') || 'xre190';
let selectedColor = localStorage.getItem('selectedColor') || 'cinza';
let selectedSticker = localStorage.getItem('selectedSticker') || '';
let selectedPage = localStorage.getItem('selectedPage') || '../pages/modelos.html';
function switchPage(url) {
    window.location.href = url;
}
// // Seleciona todos os radios das miniaturas
// Estrutura de adesivos disponíveis para cada cor e modelo
const stickersByColor = {
    cinza: ["mod1", "mod2", "mod3"],
    roxo: ["mod1", "mod2", "mod3"],
    laranja: ["mod1", "mod2", "mod3"]
};

const valoresAdesivos = {
    mod1: 150,
    mod2: 200,
    mod3: 250
   
};

// Função para carregar o modelo pré-selecionado na página de modelos
function loadSelectedModel() {
    selectedModel = localStorage.getItem('selectedModel') || '';
    document.getElementById('motoImg').src = selectedModel ? `../img/${selectedModel}.png` : '';
    // Habilita o botão avançar se já houver modelo selecionado
    let btnAvancar = document.querySelector('.btn.avancar');
    if (btnAvancar) btnAvancar.disabled = !selectedModel;
}

// Função para selecionar o modelo ao clicar na miniatura
function selectModel(model) {
    selectedModel = model;
    localStorage.setItem('selectedModel', selectedModel);
    document.getElementById('motoImg').src = `../img/${selectedModel}.png`;
    let btnAvancar = document.querySelector('.btn.avancar');
    if (btnAvancar) btnAvancar.disabled = false;
}

// Função para carregar miniaturas das cores baseadas no modelo selecionado
function loadColorOptions() {
    selectedModel = localStorage.getItem('selectedModel') || 'xre190';
    let miniaturasContainer = document.getElementById('miniaturas-cores');
    let coresDisponiveis = ["cinza", "roxo", "laranja"];
    let selectedColor = localStorage.getItem('selectedColor') || 'cinza';

    miniaturasContainer.innerHTML = '';

    coresDisponiveis.forEach(cor => {
        // Cria o container da miniatura
        let miniaturaDiv = document.createElement('div');
        miniaturaDiv.className = 'miniatura';
        miniaturaDiv.setAttribute('data-color', cor);

        // Cria o input radio
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

        // Cria o label com a imagem
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

// Função para selecionar a cor ao clicar na miniatura
function selectColor(color) {
    selectedColor = color;
    localStorage.setItem('selectedColor', selectedColor);
    document.getElementById('motoImg').src = `../img/${selectedModel}_${selectedColor}.png`;
    let btnAvancar = document.querySelector('.btn.avancar');
    if (btnAvancar) btnAvancar.disabled = false;
}

// Função para carregar miniaturas dos adesivos baseados na cor escolhida
function loadStickerOptions() {
    selectedModel = localStorage.getItem('selectedModel') || 'xre190';
    selectedColor = localStorage.getItem('selectedColor') || 'cinza';

    let miniaturasContainer = document.getElementById('miniaturas-adesivos');
    let adesivosDisponiveis = stickersByColor[selectedColor] || [];
    let selectedSticker = localStorage.getItem('selectedSticker') || '';

    miniaturasContainer.innerHTML = '';

    document.getElementById('motoImg').src = `../img/${selectedModel}_${selectedColor}.png`;

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
        };

        // Cria o valor do adesivo
        let valorSpan = document.createElement('span');
        valorSpan.style.display = "block";
        valorSpan.style.marginTop = "8px";
        valorSpan.style.color = "#fff";
        valorSpan.textContent = `R$ ${valoresAdesivos[sticker].toFixed(2).replace('.', ',')}`;

        label.appendChild(img);
        label.appendChild(valorSpan);
        miniaturaDiv.appendChild(radio);
        miniaturaDiv.appendChild(label);

        miniaturasContainer.appendChild(miniaturaDiv);
    });

    let btnAvancar = document.querySelector('.btn.avancar');
    if (btnAvancar) btnAvancar.disabled = !selectedSticker;

    // Atualiza o total ao carregar a página
    atualizarTotalAdesivo();
}

// Função para selecionar um adesivo ao clicar na miniatura
function selectSticker(sticker) {
    selectedSticker = sticker;
    localStorage.setItem('selectedSticker', selectedSticker);
    document.getElementById('motoImg').src = `../img/${selectedModel}_${selectedColor}_${selectedSticker}.png`;
    let btnAvancar = document.querySelector('.btn.avancar');
    if (btnAvancar) btnAvancar.disabled = false;

    // Atualiza o total ao selecionar adesivo
    atualizarTotalAdesivo();
}

// Função para carregar a pré-visualização final
function loadFinalPreview() {
    selectedModel = localStorage.getItem('selectedModel');
    selectedColor = localStorage.getItem('selectedColor');
    selectedSticker = localStorage.getItem('selectedSticker') || 'none';

    let motoImg = document.getElementById('motoImg');
    let imgSrc = `../img/${selectedModel}_${selectedColor}.png`;

    if (selectedSticker !== 'none') {
        imgSrc = `../img/${selectedModel}_${selectedColor}_${selectedSticker}.png`;
    }

    motoImg.src = imgSrc;
}

// Função para aplicar transição suave ao trocar imagem
function updatePreview() {
    let motoImg = document.getElementById('motoImg');
    motoImg.style.opacity = "0";
    setTimeout(() => motoImg.style.opacity = "1", 300);
}

// Executa as funções ao carregar cada página correspondente
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('motoImg')) {
        loadSelectedModel();
        loadColorOptions();
        loadStickerOptions();
    }
});

function loadGarage() {
    // Mapas para nomes amigáveis
    const modelosAmigaveis = {
        xre190: "XRE 190",
        fan160: "Fan 160",
        cb300f: "CB 300F"
        // Adicione outros modelos conforme necessário
    };
    const coresAmigaveis = {
        cinza: "Cinza",
        roxo: "Roxo",
        laranja: "Laranja"
        // Adicione outras cores conforme necessário
    };
    const adesivosAmigaveis = {
        mod1: "Modelo 1",
        mod2: "Modelo 2",
        mod3: "Modelo 3"
        // Adicione outros adesivos conforme necessário
    };

    const modelo = localStorage.getItem('selectedModel') || '-';
    const cor = localStorage.getItem('selectedColor') || '-';
    const adesivo = localStorage.getItem('selectedSticker') || '-';

    document.getElementById('modeloSelecionado').textContent = modelosAmigaveis[modelo] || modelo;
    document.getElementById('corSelecionada').textContent = coresAmigaveis[cor] || cor;
    document.getElementById('adesivoSelecionado').textContent = adesivosAmigaveis[adesivo] || adesivo;

    // Imagem do modelo
    const imgModelo = document.getElementById('imgModeloSelecionado');
    if (imgModelo && modelo !== '-') {
        imgModelo.src = `../img/${modelo}.png`;
    }

    // Imagem da cor
    const imgCor = document.getElementById('imgCorSelecionada');
    if (imgCor && modelo !== '-' && cor !== '-') {
        imgCor.src = `../img/${modelo}_${cor}.png`;
    }

    // Imagem do adesivo
    const imgAdesivo = document.getElementById('imgAdesivoSelecionado');
    if (imgAdesivo && modelo !== '-' && cor !== '-' && adesivo !== '-' && adesivo !== 'none') {
        imgAdesivo.src = `../img/${modelo}_${cor}_${adesivo}.png`;
    } else if (imgAdesivo) {
        imgAdesivo.src = '';
    }

    // Imagem principal da moto
    let imgSrc = `../img/${modelo}_${cor}.png`;
    if (adesivo !== '-' && adesivo !== 'none') {
        imgSrc = `../img/${modelo}_${cor}_${adesivo}.png`;
    }
    document.getElementById('motoImg').src = imgSrc;

    // Atualiza o valor total na garagem com base no adesivo selecionado
    const totalElement = document.querySelector('footer p strong');
    if (totalElement) {
        if (adesivo && valoresAdesivos[adesivo]) {
            totalElement.textContent = `R$ ${valoresAdesivos[adesivo].toFixed(2).replace('.', ',')}`;
        } else {
            totalElement.textContent = 'R$ 0,00';
        }
    }
}

function atualizarTotalAdesivo() {
    const totalElement = document.querySelector('footer p strong');
    if (totalElement) {
        if (selectedSticker && valoresAdesivos[selectedSticker]) {
            totalElement.textContent = `R$ ${valoresAdesivos[selectedSticker].toFixed(2).replace('.', ',')}`;
        } else {
            totalElement.textContent = 'R$ 0,00';
        }
    }
}