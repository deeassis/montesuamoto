const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

const projeto = {
    titulo: "Minha Moto",
    modelo: { id: selectedModel },
    cor: { id: selectedColor },
    adesivo: { id: selectedSticker },
    valor: "R$ 250,00",
    usuario: { id: usuarioLogado.id }
};

fetch("http://10.92.195.72:8080/garagem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projeto)
})
.then(response => response.json())
.then(data => {
    console.log("Projeto salvo:", data);
    alert("Projeto salvo com sucesso!");
})
.catch(error => console.error("Erro ao salvar projeto:", error));


let idProjetoParaExcluir = null;

function abrirModalConfirmacao(idProjeto) {
    idProjetoParaExcluir = idProjeto;
    document.getElementById("modalConfirmacao").style.display = "flex";
}

document.getElementById("btnConfirmarExclusao").addEventListener("click", function () {
    if (idProjetoParaExcluir) {
        fetch(`http://10.92.195.72:8080/garagem/${idProjetoParaExcluir}`, {
            method: "DELETE"
        })
        .then(response => response.text())
        .then(mensagem => {
            alert("Projeto removido com sucesso!");
            document.getElementById("modalConfirmacao").style.display = "none";
            window.location.reload();
        })
        .catch(error => console.error("Erro ao excluir projeto:", error));
    }
});
