async function carregarModelos() {
    const response = await fetch("http://10.92.195.72:8080/modelos");
    const modelos = await response.json();
    console.log("Modelos:", modelos);
}

async function carregarCores() {
    const response = await fetch("http://10.92.195.72:8080/cores");
    const cores = await response.json();
    console.log("Cores:", cores);
}

async function carregarAdesivos() {
    const response = await fetch("http://10.92.195.72:8080/adesivos");
    const adesivos = await response.json();
    console.log("Adesivos:", adesivos);
}

// carregarModelos();
// carregarCores();
// carregarAdesivos();
