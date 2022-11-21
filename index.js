const APP = "buylists"
const listas = storage.get(APP) ?? [];
const table_lista = document.querySelector('#table_lista');
const table_itens = document.querySelector('#table_itens');
const input_lista = document.querySelector('#input_lista');
const btn_cadastro_lista = document.querySelector('#btn_cadastro_lista');
const modifica_lista = document.querySelector('#lista_edit');
const n_item = document.querySelector('#nome_item');
const q_item = document.querySelector('#quantidade_item');

let listaEditando = null;



function salvarLista() {
    const nome = input_lista.value;
    if (nome == "") {
        alert("Você não pode deixar sua lista sem nome!!");
        return;
    }
    const itens = [];
    listas.push({ nome, itens });
    salvar();
    window.location.href = "/#listas";
    document.location.reload();
    alert("Lista adicionada com sucesso !!!");
}

btn_cadastro_lista.addEventListener('click', salvarLista)


function listar() {

    table_lista.innerHTML = listas.map(function (lista) {
        return `<tr class="">
        <td class="" onclick = "listar_itens('${lista.nome}')">${lista.nome}</td>
        <td class=""><div class=" d-flex justify-content-end"><button class="btn btn-success mr-3" onclick = "linkEditar('${lista.nome}')">Editar</button>
        <button class="btn btn-danger" onclick="excluir_lista('${lista.nome}')">Excluir</button></div></td> </tr>`;
    }).join("");
}

function listar_itens(lista) {
    window.location.href = "/#lista_itens";
    for (const key in listas) {
        const element = listas[key].nome;
        if (element === lista) {
            mostrar_itens(table_itens, Object.values(listas[key].itens), lista)
        }

    }
}

function mostrar_itens(el, itens, nomeLista) {
    el.innerHTML = itens.map(function (item) {
        return `<tr class="">
                    <td class="">${item.nome}</td>
                    <td class="">${item.quantidade}</td>
                    <td><button class="btn btn-danger" onclick="excluir_item('${item.nome}','${nomeLista}')">Excluir</button></td>
                </tr>`;
    }).join("");
}

function getListaAtual(nome) {
    for (const key in listas) {
        if (listas[key].nome === nome) {
            return listas[key]
        }
    }
}

function getKeyLista(nome) {
    for (const key in listas) {
        if (listas[key].nome === nome) {
            return key
        }
    }
}


function excluir_lista(lista_excluida) {
    alert('excluir acionado : vamos excluir a lista ' + lista_excluida);
    const key = getKeyLista(lista_excluida)
    listas.splice(key, 1);
    salvar()
    window.location.reload()
}


function excluir_item(item_excluido, lista) {

    const lista_atual = getListaAtual(lista);

    for (chave in lista_atual.itens) {
        const produto = lista_atual.itens[chave].nome;
        if (produto === item_excluido) {
            lista_atual.itens.splice(chave, 1);
            salvar();
            redirecionar(lista);
        }
    }

}

function redirecionar(l) {
    if(window.location.hash == "#lista_itens") {
        listar_itens(l);
        return;
    } else {
        linkEditar(l)
        return; 
    }
}



function linkEditar(lista){
    listaEditando = lista
    storage.salvar(APP+"listaEditando", lista)
    window.location.href = "/#cadastroitens";
    
}

function editar() {
    listaEditando =  storage.get(APP+"listaEditando");
    
    modifica_lista.setAttribute("data-value", listaEditando);
    modifica_lista.value = listaEditando

    const listaAtual = getListaAtual(listaEditando)
    const itensDaLista = listaAtual.itens
    mostrar_itens(cadastroitens__table_item, itensDaLista, listaEditando)
}

function edit_lista() {
    const atual_nome = modifica_lista.getAttribute("data-value");
    const novo_nome = modifica_lista.value;
    if (novo_nome == "") {
        alert("Você não pode deixar sua lista sem nome!!");
        return;
    }

    const listaAtual = getListaAtual(atual_nome)
    listaAtual.nome = novo_nome
    salvar()
    window.location.href = "/#listas";
    alert("Nome de lista alterado com sucesso!!!");
}

function adicionarItem() {
    const lista_detentora = modifica_lista.getAttribute("data-value");
    const nome = n_item.value
    for (const key in listas) {
        const element = listas[key].nome;
        if (element === lista_detentora) {
            const item = { nome, quantidade: q_item.value };
            listas[key].itens.push(item);
            salvar();
            alert("Item adicionado com sucesso!!");
            document.querySelector('#nome_item').value = "";
            document.querySelector('#quantidade_item').value = "";
            linkEditar(lista_detentora);
        }

    }



}

function verificarInput(e) {
    const char = String.fromCharCode(e.keyCode);
    const pattern = '[@!.,`/?"#]'

    if(!(char.match(pattern))) {
        return true;
    }

}


function salvar() {
    storage.salvar(APP, listas);
}

function back() {
    history.back();
}


function iniciar(){

    const {hash} = window.location
    
    const urls = {
        "#listas" : listar,
        "#cadastroitens" : editar,
    }
    
    if(urls[hash]){
        urls[hash]()
    }
}

n_item.addEventListener('keypress', function(e){
    if(!verificarInput(e)){
        e.preventDefault();
    }
})
q_item.addEventListener('keypress', function(e){
    if(!verificarInput(e)){
        e.preventDefault();
    }
})
window.addEventListener('popstate', iniciar)
window.addEventListener('load', iniciar)
