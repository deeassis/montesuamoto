document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Captura os valores dos campos
    const nome = document.querySelector("#registerForm input[type='text']").value;
    const email = document.querySelector("#registerForm input[type='email']").value;
    const senha = document.getElementById("createSenha").value;
    const confirmarSenha = document.getElementById("confirmSenha").value;
    const fotoInput = document.querySelector("#fotoPerfil");


    console.log("Nome:", senha);
    // Validação básica
    if (senha !== confirmarSenha) {
        document.getElementById("registerError").textContent = "As senhas não coincidem!";
        return;
    }

    // Processa a imagem de perfil para Base64
    let fotoPerfilBase64 = "";
    if (fotoInput.files.length > 0) {
        const file = fotoInput.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            fotoPerfilBase64 = reader.result;
            enviarDados(nome, email, senha,  fotoPerfilBase64);
        };
    } else {
        enviarDados(nome, email, senha,  fotoPerfilBase64);
    }
});

async function enviarDados(nome, email, senha, fotoPerfil) {
    try {
        const response = await fetch("http://10.92.195.72:8080/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha, fotoPerfil, tipo: "USER" }),
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById("registerSuccess").textContent = "Cadastro realizado com sucesso!";
        } else {
            document.getElementById("registerError").textContent = "Erro ao cadastrar usuário!";
        }
    } catch (error) {
        document.getElementById("registerError").textContent = "Erro ao conectar com o servidor.";
    }
}
