const mesesNomes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const meses = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

const $main = document.querySelector("#main-section");

const btn_todos = document.querySelector("#btn-todos");
const btn_mes = document.querySelector("#btn-mes");
const btn_hoje = document.querySelector("#btn-hoje");

let aniversarios = [];

const getAll = () => fetch('aniversariantes.txt') 
    .then(response => response.text())
    .then(data => {
        // Do something with your data
        words = data.split('\n');
        let aniversariantes = makeData(words);
        let arr = mountBirthSet(aniversariantes);
        aniversarios = arr;
        start(arr);

        return arr;
    });


let makeData = function (words) {
    people = [];

    for (let word of words) {
        let dados = word.split(' - ');

        let data = dados[0].split('/');
        let obj = {
            "nome": dados[1].replace(",", ""),            
            "dia": data[0],
            "mes": data[1]
        }

        people.push(obj);
    }

    return people;
}

let filterBirthdays = (datas, mes, numero) => {
    const hoje = new Date();
    let month = {};

    if (mes) {
        arr = datas.filter(data => data.mes == mes );

        month.nome = mesesNomes[numero];
        month.numero = meses[numero];

    } else {
        arr = datas.filter(data => data.mes == hoje.getMonth() + 1 );

        month.nome = mesesNomes[hoje.getMonth()];
        month.numero = meses[hoje.getMonth()]
    }

    let filtered = arr.sort((a,b) => (a.dia > b.dia) ? 1 : ((b.dia > a.dia) ? -1 : 0));
    month.datas = filtered;

    return month;
}

let  getBirthToday = (datas) => {
    const hoje = new Date();
    let aniversarios =  datas.filter(data => {
        return data.dia == hoje.getDate() && data.mes == (hoje.getMonth() + 1) 
    });

    return filterBirthdays(aniversarios);
}

const getBirthThisMonth = (datas) => {
    const hoje = new Date();

    return filterBirthdays(datas);
}

const getBirthFilterByYear = (datas) => {
    let ordered = [];
    ordered = meses.map((value, key) => filterBirthdays(datas, value, key));

    return ordered;
}

const mountBirthSet = function (datas) {
    return {
        birthToday: getBirthToday(datas),
        birthThisMonth: getBirthThisMonth(datas),
        birthByYear: getBirthFilterByYear(datas)
    }
}

const render = function (option, dados) {
    let template = '';
    let renderLista = (mes) => {
        let texto = "";

        texto += "<ul>";
        for (dia of mes) {
            texto += `<li>${dia.dia} - ${dia.nome}</li>`;
        }
        texto += "</ul>";

        return texto;
    }

    let renderAno = (ano) => {
        texto = "";

        for (mes of ano) {
            texto += `<h3>${mes.nome}</h3>`;
            texto += renderLista(mes.datas);
            
        }

        return texto;
    }

    template = `<h1>Aniversariantes da Trancozada e Família</h1>`;

    switch (option) {
        case "ano":
            template += renderAno(dados);
            break;

        case "mes":
            template += `<h3>${dados.nome}</h3>`;
            template += renderLista(dados.datas);
            break;

        default:
            if (dados.datas.length) {
                template += `<h3>Hoje 🥳</h3>`;
                template += renderLista(dados.datas);
            } else {
                template += "<p style='text-align: center'>Hoje ninguém da família faz aniversário</p>"
            }
    }

    $("#main-section").html(template);
}

function start (aniversarios) {
    const dados = aniversarios;

    $("#btn-ano").on("click", function(){
        render("ano", dados.birthByYear);
    });

    $("#btn-mes").on("click", function(){
        render("mes", dados.birthThisMonth);
    });

    $("#btn-hoje").on("click", function(){
        render("hoje", dados.birthToday);
    });

    if (dados.birthToday.datas.length) {
        render("hoje", dados.birthToday);
    } else {
        render("mes", dados.birthThisMonth);
    }
};

getAll();
