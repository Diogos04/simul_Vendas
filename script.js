document.getElementById("submit").addEventListener("click", function () {
  document.getElementById("indexEditar").value = ""; // Força modo cadastro
  salvarPedido();
});

document.getElementById("salvarEdicao").addEventListener("click", function () {
  salvarPedido(true); // Modo edição ativado
});

function salvarPedido(modoEdicao = false) {
  const produto = document.getElementById("produto").value;
  const preco = parseFloat(document.getElementById("preco").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const cupom = document.getElementById("cupom").value.toUpperCase();

  const resultadoCalculo = calcularTotal(preco, quantidade, cupom);

  const pedido = {
    produto,
    preco: resultadoCalculo.preco,
    quantidade,
    cupom,
    descontoPercentual: resultadoCalculo.descontoPercentual,
    totalFinal: resultadoCalculo.totalFinal
  };

  let listaPedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  if (modoEdicao) {
    const index = parseInt(document.getElementById("indexEditar").value);
    if (!isNaN(index)) {
      listaPedidos[index] = pedido;
    }
    document.getElementById("indexEditar").value = "";
    document.getElementById("salvarEdicao").style.display = "none";
    document.getElementById("submit").style.display = "inline-block";
  } else {
    listaPedidos.push(pedido);
  }

  localStorage.setItem("pedidos", JSON.stringify(listaPedidos));
  listarPedidos();
  limparCampos();
}

function calcularTotal(preco, quantidade, cupom) {
  let descontoPercentual = 0;
  cupom = cupom.toUpperCase();

  if (cupom === "CUPOM10") {
    descontoPercentual = 10;
  } else if (cupom === "CUPOM20") {
    descontoPercentual = 20;
  }

  const totalBruto = preco * quantidade;
  const descontoValor = (descontoPercentual / 100) * totalBruto;
  const totalFinal = totalBruto - descontoValor;

  return {
    descontoPercentual,
    totalFinal: totalFinal.toFixed(2).replace('.', ','),
    preco: preco.toFixed(2).replace('.', ',')
  };
}

function listarPedidos() {
  const lista = JSON.parse(localStorage.getItem("pedidos")) || [];
  const corpoTabela = document.getElementById("corpoTabelaPedidos");
  corpoTabela.innerHTML = "";

  lista.forEach((pedido, index) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${pedido.produto}</td>
      <td>R$ ${pedido.preco}</td>
      <td>${pedido.quantidade}</td>
      <td>${pedido.cupom}</td>
      <td>${pedido.descontoPercentual}%</td>
      <td>${pedido.totalFinal}</td>
      <td>
        <button onclick="editarPedido(${index})">Editar</button>
        <button onclick="excluirPedido(${index})">Excluir</button>
      </td>
    `;
    corpoTabela.appendChild(linha);
  });
}

window.editarPedido = function (index) {
  const lista = JSON.parse(localStorage.getItem("pedidos")) || [];
  const item = lista[index];

  document.getElementById("produto").value = item.produto;
  document.getElementById("preco").value = item.preco.replace(",", ".");
  document.getElementById("quantidade").value = item.quantidade;
  document.getElementById("cupom").value = item.cupom;
  document.getElementById("indexEditar").value = index;

  document.getElementById("submit").style.display = "none";
  document.getElementById("salvarEdicao").style.display = "inline-block";
};

window.excluirPedido = function (index) {
  const lista = JSON.parse(localStorage.getItem("pedidos")) || [];

  if (confirm("Deseja excluir esse pedido?")) {
    lista.splice(index, 1);
    localStorage.setItem("pedidos", JSON.stringify(lista));
    listarPedidos();
  }
};

function limparCampos() {
  document.getElementById("produto").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("quantidade").value = "";
  document.getElementById("cupom").value = "";
}

listarPedidos();
