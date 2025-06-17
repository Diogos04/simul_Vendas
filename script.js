document.getElementById("submit").addEventListener("click", function () {

  const produto = document.getElementById("produto").value;
  const preco = parseFloat(document.getElementById("preco").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const cupom = document.getElementById("cupom").value.toUpperCase();

  const resultadoCalculo = calcularTotal(preco, quantidade, cupom);

  let listaPedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  const pedido = {
    produto,
    preco: resultadoCalculo.preco,quantidade,
    cupom: cupom.toUpperCase(),
    descontoPercentual: resultadoCalculo.descontoPercentual,
    totalFinal: resultadoCalculo.totalFinal
  };

  const indexEditando = document.getElementById("indexEditar").value;

  if(indexEditando !== ""){
    listaPedidos[indexEditando] = pedido;
    document.getElementById("indexEditar").value = "";
  } else {
    listaPedidos.push(pedido);
  }

  localStorage.setItem("pedidos", JSON.stringify(listaPedidos));

  const resultado = `
    <strong>Produto:</strong> ${produto}<br/>
    <strong>Quantidade:</strong> ${quantidade}<br/>
    <strong>Preço unitário:</strong> R$${resultadoCalculo.preco}<br/>
    <strong>Desconto aplicado:</strong> ${resultadoCalculo.descontoPercentual}%<br/>
    <strong>Total com desconto:</strong> R$${resultadoCalculo.totalFinal}
  `;

  document.getElementById("resultado").innerHTML = resultado;

  document.getElementById("formVenda").reset();

  listarPedidos();
});

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

function listarPedidos(){
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
    `
    corpoTabela.appendChild(linha);
  });
}

function editarPedido(index){
  const lista = JSON.parse(localStorage.getItem("pedidos")) || [];
  const item = lista[index];

  document.getElementById("produto").value = item.produto;
  document.getElementById("preco").value = item.preco.replace(',','.');
  document.getElementById("quantidade").value = item.quantidade;
  document.getElementById("cupom").value = item.cupom;
  document.getElementById("indexEditar").value = index;

}

function excluirPedido(index){
  const lista = JSON.parse(localStorage.getItem("pedidos")) || [];

  if(confirm("Deseja excluir esse pedido?")){
    lista.splice(index, 1);
    localStorage.setItem("pedidos", JSON.stringify(lista));
    listarPedidos();
  }
}

listarPedidos();