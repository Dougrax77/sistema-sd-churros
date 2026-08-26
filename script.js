/* =====================================
   DADOS
===================================== */

let produtos =
    JSON.parse(
        localStorage.getItem("produtos")
    ) || [];


let vendas =
    JSON.parse(
        localStorage.getItem("vendas")
    ) || [];


let saidas =
    JSON.parse(
        localStorage.getItem("saidas")
    ) || [];


let comanda = [];

let comandaIfood = [];



/* =====================================
   NAVEGAÇÃO
===================================== */

function mostrarPagina(id) {

    document
        .querySelectorAll(".page")
        .forEach(p =>
            p.classList.remove("active")
        );


    document
        .getElementById(id)
        .classList.add("active");


    atualizarTudo();

}



/* =====================================
   DINHEIRO
===================================== */

function dinheiro(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}



/* =====================================
   PRODUTOS
===================================== */

function adicionarProduto() {

    const nome =
        document
            .getElementById("produtoNome")
            .value
            .trim();


    const preco =
        Number(
            document
                .getElementById("produtoPreco")
                .value
        );


    const categoria =
        document
            .getElementById("produtoCategoria")
            .value;


    if (!nome || !preco) {

        alert(
            "Preencha o nome e o preço."
        );

        return;

    }


    produtos.push({

        id: Date.now(),

        nome: nome,

        preco: preco,

        categoria: categoria

    });


    salvar();


    document
        .getElementById("produtoNome")
        .value = "";


    document
        .getElementById("produtoPreco")
        .value = "";


    atualizarProdutos();

    atualizarProdutosComanda();

}



/* =====================================
   EXCLUIR PRODUTO
===================================== */

function excluirProduto(id) {

    if (
        !confirm(
            "Deseja excluir este produto?"
        )
    ) return;


    produtos =
        produtos.filter(
            produto =>
                produto.id !== id
        );


    salvar();

    atualizarProdutos();

    atualizarProdutosComanda();

}



/* =====================================
   LISTAR PRODUTOS
===================================== */

function atualizarProdutos() {

    const lista =
        document.getElementById(
            "listaProdutos"
        );


    lista.innerHTML = "";


    produtos.forEach(
        produto => {

            lista.innerHTML += `

                <tr>

                    <td>
                        ${produto.nome}
                    </td>

                    <td>
                        ${produto.categoria}
                    </td>

                    <td>
                        ${dinheiro(
                            produto.preco
                        )}
                    </td>

                    <td>

                        <button
                            class="btn-delete"
                            onclick="excluirProduto(${produto.id})">

                            Excluir

                        </button>

                    </td>

                </tr>

            `;

        }
    );

}



/* =====================================
   PRODUTOS DA COMANDA
===================================== */

function atualizarProdutosComanda() {

    const div =
        document.getElementById(
            "produtosComanda"
        );


    div.innerHTML = "";


    produtos.forEach(
        produto => {

            div.innerHTML += `

                <div class="produto-item">

                    <div>

                        <strong>
                            ${produto.nome}
                        </strong>

                        <br>

                        ${dinheiro(
                            produto.preco
                        )}

                    </div>


                    <button
                        onclick="adicionarComanda(${produto.id})">

                        +

                    </button>

                </div>

            `;

        }
    );

}



/* =====================================
   ADICIONAR COMANDA
===================================== */

function adicionarComanda(id) {

    const produto =
        produtos.find(
            p => p.id === id
        );


    if (!produto) return;


    const existente =
        comanda.find(
            item => item.id === id
        );


    if (existente) {

        existente.quantidade++;

    } else {

        comanda.push({

            id: produto.id,

            nome: produto.nome,

            preco: produto.preco,

            quantidade: 1

        });

    }


    atualizarComanda();

}



/* =====================================
   ATUALIZAR COMANDA
===================================== */

function atualizarComanda() {

    const div =
        document.getElementById(
            "itensComanda"
        );


    div.innerHTML = "";


    if (comanda.length === 0) {

        div.innerHTML =
            "<p>Nenhum produto adicionado.</p>";


        document
            .getElementById(
                "totalComanda"
            )
            .innerText =
            dinheiro(0);

        return;

    }


    let total = 0;


    comanda.forEach(
        (item, index) => {

            const subtotal =
                item.preco *
                item.quantidade;


            total += subtotal;


            div.innerHTML += `

                <div class="comanda-item">

                    <span>

                        <strong>
                            ${item.nome}
                        </strong>

                        <br>

                        ${item.quantidade}
                        x
                        ${dinheiro(
                            item.preco
                        )}

                    </span>


                    <strong>
                        ${dinheiro(
                            subtotal
                        )}
                    </strong>


                    <button
                        class="btn-delete"
                        onclick="removerComanda(${index})">

                        X

                    </button>

                </div>

            `;

        }
    );


    document
        .getElementById(
            "totalComanda"
        )
        .innerText =
        dinheiro(total);

}



/* =====================================
   REMOVER COMANDA
===================================== */

function removerComanda(index) {

    comanda.splice(
        index,
        1
    );


    atualizarComanda();

}



/* =====================================
   FINALIZAR COMANDA
===================================== */

function finalizarComanda() {

    if (
        comanda.length === 0
    ) {

        alert(
            "A comanda está vazia."
        );

        return;

    }


    const pagamento =
        document
            .getElementById(
                "pagamentoComanda"
            )
            .value;


    const total =
        comanda.reduce(
            (soma, item) =>
                soma +
                (
                    item.preco *
                    item.quantidade
                ),
            0
        );


    vendas.push({

        id:
            Date.now(),

        data:
            new Date().toISOString(),

        origem:
            "Balcão",

        itens:
            comanda.map(
                item => ({

                    nome:
                        item.nome,

                    quantidade:
                        item.quantidade,

                    preco:
                        item.preco

                })
            ),

        pagamento:
            pagamento,

        total:
            total

    });


    comanda = [];


    salvar();

    atualizarTudo();


    alert(
        "Venda registrada com sucesso!"
    );

}



/* =====================================
   IFOOD
===================================== */

function adicionarIfood() {

    const produto =
        document
            .getElementById(
                "ifoodProduto"
            )
            .value
            .trim();


    const valor =
        Number(
            document
                .getElementById(
                    "ifoodValor"
                )
                .value
        );


    const pedido =
        document
            .getElementById(
                "ifoodPedido"
            )
            .value
            .trim();


    const pagamento =
        document
            .getElementById(
                "ifoodPagamento"
            )
            .value;


    if (
        !produto ||
        !valor
    ) {

        alert(
            "Informe o produto e o valor."
        );

        return;

    }


    comandaIfood.push({

        id:
            Date.now() +
            Math.random(),

        produto:
            produto,

        valor:
            valor,

        pedido:
            pedido,

        pagamento:
            pagamento

    });


    document
        .getElementById(
            "ifoodProduto"
        )
        .value = "";


    document
        .getElementById(
            "ifoodValor"
        )
        .value = "";


    document
        .getElementById(
            "ifoodPedido"
        )
        .value = "";


    atualizarIfood();

}



/* =====================================
   ATUALIZAR IFOOD
===================================== */

function atualizarIfood() {

    const lista =
        document.getElementById(
            "listaIfood"
        );


    lista.innerHTML = "";


    let totalCartao = 0;

    let totalDinheiro = 0;

    let totalAplicativo = 0;

    let totalGeral = 0;


    comandaIfood.forEach(
        (item, index) => {

            totalGeral +=
                Number(item.valor);


            if (
                item.pagamento ===
                "Cartão"
            ) {

                totalCartao +=
                    Number(item.valor);

            }


            if (
                item.pagamento ===
                "Dinheiro"
            ) {

                totalDinheiro +=
                    Number(item.valor);

            }


            if (
                item.pagamento ===
                "Aplicativo"
            ) {

                totalAplicativo +=
                    Number(item.valor);

            }


            lista.innerHTML += `

                <tr>

                    <td>
                        ${item.produto}
                    </td>

                    <td>
                        ${item.pedido}
                    </td>

                    <td>
                        ${item.pagamento}
                    </td>

                    <td>
                        ${dinheiro(
                            item.valor
                        )}
                    </td>

                    <td>

                        <button
                            class="btn-delete"
                            onclick="removerIfood(${index})">

                            Excluir

                        </button>

                    </td>

                </tr>

            `;

        }
    );


    document
        .getElementById(
            "totalIfoodCartao"
        )
        .innerText =
        dinheiro(totalCartao);


    document
        .getElementById(
            "totalIfoodDinheiro"
        )
        .innerText =
        dinheiro(totalDinheiro);


    document
        .getElementById(
            "totalIfoodAplicativo"
        )
        .innerText =
        dinheiro(totalAplicativo);


    document
        .getElementById(
            "totalIfood"
        )
        .innerText =
        dinheiro(totalGeral);

}



/* =====================================
   REMOVER IFOOD
===================================== */

function removerIfood(index) {

    comandaIfood.splice(
        index,
        1
    );


    atualizarIfood();

}



/* =====================================
   FINALIZAR IFOOD
===================================== */

function finalizarIfood() {

    if (
        comandaIfood.length === 0
    ) {

        alert(
            "A comanda iFood está vazia."
        );

        return;

    }


    comandaIfood.forEach(
        item => {

            vendas.push({

                id:
                    Date.now() +
                    Math.random(),

                data:
                    new Date()
                        .toISOString(),

                origem:
                    "iFood",

                itens: [

                    {

                        nome:
                            item.produto,

                        quantidade:
                            1,

                        preco:
                            item.valor

                    }

                ],

                pagamento:
                    item.pagamento,

                total:
                    item.valor

            });

        }
    );


    comandaIfood = [];


    salvar();

    atualizarTudo();


    alert(
        "Vendas iFood registradas com sucesso!"
    );

}



/* =====================================
   SAÍDAS
===================================== */

function adicionarSaida() {

    const data =
        document
            .getElementById(
                "saidaData"
            )
            .value;


    const descricao =
        document
            .getElementById(
                "saidaDescricao"
            )
            .value
            .trim();


    const valor =
        Number(
            document
                .getElementById(
                    "saidaValor"
                )
                .value
        );


    const categoria =
        document
            .getElementById(
                "saidaCategoria"
            )
            .value;


    if (
        !data ||
        !descricao ||
        !valor
    ) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    saidas.push({

        id:
            Date.now(),

        data:
            data,

        descricao:
            descricao,

        valor:
            valor,

        categoria:
            categoria

    });


    salvar();


    document
        .getElementById(
            "saidaDescricao"
        )
        .value = "";


    document
        .getElementById(
            "saidaValor"
        )
        .value = "";


    atualizarSaidas();

    atualizarDashboard();

    atualizarRelatorio();

}



/* =====================================
   EXCLUIR SAÍDA
===================================== */

function excluirSaida(id) {

    if (
        !confirm(
            "Deseja excluir esta saída?"
        )
    ) return;


    saidas =
        saidas.filter(
            saida =>
                saida.id !== id
        );


    salvar();


    atualizarSaidas();

    atualizarDashboard();

    atualizarRelatorio();

}



/* =====================================
   LISTAR SAÍDAS
===================================== */

function atualizarSaidas() {

    const lista =
        document.getElementById(
            "listaSaidas"
        );


    lista.innerHTML = "";


    saidas.forEach(
        saida => {

            lista.innerHTML += `

                <tr>

                    <td>
                        ${saida.data}
                    </td>

                    <td>
                        ${saida.descricao}
                    </td>

                    <td>
                        ${saida.categoria}
                    </td>

                    <td>
                        ${dinheiro(
                            saida.valor
                        )}
                    </td>

                    <td>

                        <button
                            class="btn-delete"
                            onclick="excluirSaida(${saida.id})">

                            Excluir

                        </button>

                    </td>

                </tr>

            `;

        }
    );

}



/* =====================================
   HISTÓRICO DE VENDAS
===================================== */

function atualizarVendas() {

    const lista =
        document.getElementById(
            "listaVendas"
        );


    lista.innerHTML = "";


    vendas
        .slice()
        .reverse()
        .forEach(
            venda => {

                const itens =
                    venda.itens
                        .map(
                            item =>
                                `${item.quantidade}x ${item.nome}`
                        )
                        .join(", ");


                lista.innerHTML += `

                    <tr>

                        <td>

                            ${new Date(
                                venda.data
                            ).toLocaleString(
                                "pt-BR"
                            )}

                        </td>


                        <td>
                            ${venda.origem}
                        </td>


                        <td>
                            ${itens}
                        </td>


                        <td>
                            ${venda.pagamento}
                        </td>


                        <td>
                            ${dinheiro(
                                venda.total
                            )}
                        </td>


                        <td>

                            <button
                                class="btn-edit"
                                onclick="abrirEdicaoVenda(${venda.id})">

                                ✏️ Editar

                            </button>


                            <button
                                class="btn-delete"
                                onclick="excluirVenda(${venda.id})">

                                🗑️ Excluir

                            </button>

                        </td>

                    </tr>

                `;

            }
        );

}



/* =====================================
   EXCLUIR VENDA
===================================== */

function excluirVenda(id) {

    if (
        !confirm(
            "Deseja excluir esta venda?"
        )
    ) return;


    vendas =
        vendas.filter(
            venda =>
                venda.id !== id
        );


    salvar();


    atualizarTudo();

}



/* =====================================
   ABRIR EDIÇÃO
===================================== */

function abrirEdicaoVenda(id) {

    const venda =
        vendas.find(
            v => v.id === id
        );


    if (!venda) return;


    document
        .getElementById(
            "editarVendaId"
        )
        .value = id;


    const data =
        new Date(
            venda.data
        );


    const ano =
        data.getFullYear();


    const mes =
        String(
            data.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            data.getDate()
        ).padStart(2, "0");


    const hora =
        String(
            data.getHours()
        ).padStart(2, "0");


    const minuto =
        String(
            data.getMinutes()
        ).padStart(2, "0");


    document
        .getElementById(
            "editarVendaData"
        )
        .value =
        `${ano}-${mes}-${dia}T${hora}:${minuto}`;


    document
        .getElementById(
            "editarVendaOrigem"
        )
        .value =
        venda.origem;


    const itens =
        venda.itens
            .map(
                item =>
                    `${item.quantidade}x ${item.nome}`
            )
            .join(", ");


    document
        .getElementById(
            "editarVendaItens"
        )
        .value =
        itens;


    document
        .getElementById(
            "editarVendaPagamento"
        )
        .value =
        venda.pagamento;


    document
        .getElementById(
            "editarVendaValor"
        )
        .value =
        venda.total;


    document
        .getElementById(
            "modalEdicao"
        )
        .style.display =
        "flex";

}



/* =====================================
   FECHAR EDIÇÃO
===================================== */

function fecharEdicao() {

    document
        .getElementById(
            "modalEdicao"
        )
        .style.display =
        "none";

}



/* =====================================
   SALVAR EDIÇÃO
===================================== */

function salvarEdicaoVenda() {

    const id =
        Number(
            document
                .getElementById(
                    "editarVendaId"
                )
                .value
        );


    const venda =
        vendas.find(
            v => Number(v.id) === id
        );


    if (!venda) return;


    const data =
        document
            .getElementById(
                "editarVendaData"
            )
            .value;


    const origem =
        document
            .getElementById(
                "editarVendaOrigem"
            )
            .value;


    const itensTexto =
        document
            .getElementById(
                "editarVendaItens"
            )
            .value
            .trim();


    const pagamento =
        document
            .getElementById(
                "editarVendaPagamento"
            )
            .value;


    const valor =
        Number(
            document
                .getElementById(
                    "editarVendaValor"
                )
                .value
        );


    if (
        !data ||
        !itensTexto ||
        !valor
    ) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    venda.data =
        new Date(data)
            .toISOString();


    venda.origem =
        origem;


    venda.itens = [

        {

            nome:
                itensTexto,

            quantidade:
                1,

            preco:
                valor

        }

    ];


    venda.pagamento =
        pagamento;


    venda.total =
        valor;


    salvar();


    fecharEdicao();


    atualizarTudo();


    alert(
        "Venda editada com sucesso!"
    );

}



/* =====================================
   DASHBOARD
===================================== */

function atualizarDashboard() {

    const inicio =
        document
            .getElementById(
                "dataInicial"
            )
            .value;


    const fim =
        document
            .getElementById(
                "dataFinal"
            )
            .value;


    const resultado =
        filtrarDados(
            inicio,
            fim
        );


    const bruto =
        resultado.vendas.reduce(
            (total, venda) =>
                total +
                Number(venda.total),
            0
        );


    const totalIfood =
        resultado.vendas

            .filter(
                venda =>
                    venda.origem === "iFood"
            )

            .reduce(
                (total, venda) =>
                    total +
                    Number(venda.total),
                0
            );


    const totalSaidas =
        resultado.saidas.reduce(
            (total, saida) =>
                total +
                Number(saida.valor),
            0
        );


    const liquido =
        bruto -
        totalSaidas;


    document
        .getElementById(
            "totalBruto"
        )
        .innerText =
        dinheiro(bruto);


    document
        .getElementById(
            "totalIfoodDashboard"
        )
        .innerText =
        dinheiro(totalIfood);


    document
        .getElementById(
            "totalSaidas"
        )
        .innerText =
        dinheiro(totalSaidas);


    document
        .getElementById(
            "totalLiquido"
        )
        .innerText =
        dinheiro(liquido);


    document
        .getElementById(
            "quantidadeVendas"
        )
        .innerText =
        resultado.vendas.length;

}



/* =====================================
   RELATÓRIO DE VENDAS
===================================== */

function atualizarRelatorio() {

    const inicio =
        document
            .getElementById(
                "relatorioDataInicial"
            )
            .value;


    const fim =
        document
            .getElementById(
                "relatorioDataFinal"
            )
            .value;


    const resultado =
        filtrarDados(
            inicio,
            fim
        );


    let ifood = 0;

    let dinheiroTotal = 0;

    let pix = 0;

    let cartao = 0;

    let bruto = 0;



    resultado.vendas.forEach(
        venda => {

            const valor =
                Number(
                    venda.total
                );


            bruto += valor;


            /* IFOOD */

            if (
                venda.origem ===
                "iFood"
            ) {

                ifood += valor;

            }


            /* DINHEIRO */

            if (
                venda.pagamento ===
                "Dinheiro"
            ) {

                dinheiroTotal +=
                    valor;

            }


            /* PIX */

            if (
                venda.pagamento ===
                "Pix"
            ) {

                pix += valor;

            }


            /* CARTÃO */

            if (
                venda.pagamento ===
                    "Cartão" ||

                venda.pagamento ===
                    "Cartão de Crédito" ||

                venda.pagamento ===
                    "Cartão de Débito"
            ) {

                cartao += valor;

            }

        }
    );


    const totalSaidas =
        resultado.saidas.reduce(
            (total, saida) =>
                total +
                Number(saida.valor),
            0
        );


    const liquido =
        bruto -
        totalSaidas;



    document
        .getElementById(
            "relatorioIfood"
        )
        .innerText =
        dinheiro(ifood);


    document
        .getElementById(
            "relatorioDinheiro"
        )
        .innerText =
        dinheiro(dinheiroTotal);


    document
        .getElementById(
            "relatorioPix"
        )
        .innerText =
        dinheiro(pix);


    document
        .getElementById(
            "relatorioCartao"
        )
        .innerText =
        dinheiro(cartao);


    document
        .getElementById(
            "relatorioBruto"
        )
        .innerText =
        dinheiro(bruto);


    document
        .getElementById(
            "relatorioSaidas"
        )
        .innerText =
        dinheiro(totalSaidas);


    document
        .getElementById(
            "relatorioLiquido"
        )
        .innerText =
        dinheiro(liquido);


    document
        .getElementById(
            "relatorioQuantidade"
        )
        .innerText =
        resultado.vendas.length;

}



/* =====================================
   FILTRO DE DADOS
===================================== */

function filtrarDados(
    inicio,
    fim
) {

    let vendasFiltradas =
        [...vendas];


    let saidasFiltradas =
        [...saidas];


    if (inicio) {

        vendasFiltradas =
            vendasFiltradas.filter(
                venda =>
                    venda.data.substring(
                        0,
                        10
                    ) >= inicio
            );


        saidasFiltradas =
            saidasFiltradas.filter(
                saida =>
                    saida.data >= inicio
            );

    }


    if (fim) {

        vendasFiltradas =
            vendasFiltradas.filter(
                venda =>
                    venda.data.substring(
                        0,
                        10
                    ) <= fim
            );


        saidasFiltradas =
            saidasFiltradas.filter(
                saida =>
                    saida.data <= fim
            );

    }


    return {

        vendas:
            vendasFiltradas,

        saidas:
            saidasFiltradas

    };

}



/* =====================================
   SALVAR
===================================== */

function salvar() {

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );


    localStorage.setItem(
        "vendas",
        JSON.stringify(vendas)
    );


    localStorage.setItem(
        "saidas",
        JSON.stringify(saidas)
    );

}



/* =====================================
   ATUALIZAR TUDO
===================================== */

function atualizarTudo() {

    atualizarProdutos();

    atualizarProdutosComanda();

    atualizarComanda();

    atualizarIfood();

    atualizarSaidas();

    atualizarVendas();

    atualizarDashboard();

    atualizarRelatorio();

}



/* =====================================
   DATA AUTOMÁTICA
===================================== */

const campoData =
    document.getElementById(
        "saidaData"
    );


if (campoData) {

    campoData.value =
        new Date()
            .toISOString()
            .substring(
                0,
                10
            );

}



/* =====================================
   INICIAR
===================================== */

atualizarTudo();