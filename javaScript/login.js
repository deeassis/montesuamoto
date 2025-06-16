document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Captura os valores dos campos
    const email = document.querySelector("#loginForm input[type='email']").value;
    const senha = document.querySelector("#loginForm input[type='password']").value;

    // Validação básica
    if (!email || !senha) {
        document.getElementById("loginError").textContent = "Preencha todos os campos!";
        return;
    }

    try {
        const response = await fetch("http://10.92.195.72:8080/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();
     
        if (response.ok) {
            console.log("Login bem-sucedido:", data);
            document.getElementById("loginError").textContent = "";
            const dataRetorno = JSON.stringify(data);
            dataRetorno.senha = "";
            // Salve o usuário logado no localStorage, se desejar
            localStorage.setItem("usuarioLogado", dataRetorno);
            // Redirecione para a página principal ou dashboard
           window.location.href = "../pages/modelos.html";
        } else {
            document.getElementById("loginError").textContent = data.message || "E-mail ou senha inválidos!";
        }
    } catch (error) {
        document.getElementById("loginError").textContent = "Erro ao conectar com o servidor.";
    }
});