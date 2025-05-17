// Definir variáveis globais com valores padrão
let selectedModel = localStorage.getItem('selectedModel') || 'xre190';
let selectedColor = localStorage.getItem('selectedColor') || 'cinza';
let selectedSticker = localStorage.getItem('selectedSticker') || 'none';
let selectedPage = localStorage.getItem('selectedPage') || '../pages/modelos.html';
function switchPage(selectedPage) {
    localStorage.setItem('selectedPage', selectedPage);
    window.location.href = selectedPage;
}
// // Seleciona todos os radios das miniaturas
// Estrutura de adesivos disponíveis para cada cor e modelo
const stickersByColor = {
    cinza: ["mod1", "mod2", "mod3"],
    roxo: ["mod1", "mod2", "mod3"],
    laranja: ["mod1", "mod2", "mod3"]
};

// Função para carregar o modelo pré-selecionado na página de modelos
function loadSelectedModel() {
    selectedModel = localStorage.getItem('selectedModel') || 'xre190';
    document.getElementById('motoImg').src = `../img/${selectedModel}.png`;
}

// Função para selecionar o modelo ao clicar na miniatura
function selectModel(model) {
    selectedModel = model;
    localStorage.setItem('selectedModel', selectedModel);
    document.getElementById('motoImg').src = `../img/${selectedModel}.png`;
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
}

// Função para selecionar a cor ao clicar na miniatura
function selectColor(color) {
    selectedColor = color;
    localStorage.setItem('selectedColor', selectedColor);
    document.getElementById('motoImg').src = `../img/${selectedModel}_${selectedColor}.png`;
}

// Função para carregar miniaturas dos adesivos baseados na cor escolhida
function loadStickerOptions() {
    selectedModel = localStorage.getItem('selectedModel') || 'xre190';
    selectedColor = localStorage.getItem('selectedColor') || 'cinza';

    let miniaturasContainer = document.getElementById('miniaturas-adesivos');

    let adesivosDisponiveis = stickersByColor[selectedColor] || [];

    miniaturasContainer.innerHTML = '';

    document.getElementById('motoImg').src = `../img/${selectedModel}_${selectedColor}.png`;

    adesivosDisponiveis.forEach(sticker => {
        let img = document.createElement('img');
        img.src = `../img/${selectedModel}_${selectedColor}_${sticker}.png`;
        img.alt = sticker;
        img.onclick = function() {
            selectSticker(sticker);
        };
        miniaturasContainer.appendChild(img);
    });
}

// Função para selecionar um adesivo ao clicar na miniatura
function selectSticker(sticker) {
    selectedSticker = sticker;
    localStorage.setItem('selectedSticker', selectedSticker);
    document.getElementById('motoImg').src = `../img/${selectedModel}_${selectedColor}_${selectedSticker}.png`;
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
