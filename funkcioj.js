let unuajKapvortoj = [];
let nunaIndekso = -1;
let neOrdigitajKapvortoj = [];

const esperantaKonverto = {
    "a": "0",
    "b": "1",
    "c": "2",
    "ĉ": "3",
    "d": "4",
    "e": "5",
    "f": "6",
    "g": "7",
    "ĝ": "8",
    "h": "9",
    "ĥ": "a",
    "i": "b",
    "j": "c",
    "ĵ": "d",
    "k": "e",
    "l": "f",
    "m": "g",
    "n": "h",
    "o": "i",
    "p": "j",
    "r": "k",
    "s": "l",
    "ŝ": "m",
    "t": "n",
    "u": "o",
    "ŭ": "p",
    "v": "q",
    "z": "r"
};

Promise.all([
    fetch('pagxaj-unuaj-kapvortoj.json').then(r => r.json()),
    fetch('ne-ordigitaj-kapvortoj.json').then(r => r.json())
])
    .then(([unuaj, neordigitaj]) => {
        unuajKapvortoj = unuaj;
        neOrdigitajKapvortoj = neordigitaj;
        legiVortonElURL();
    })
    .catch(eraro => {
        document.getElementById('rezulto').innerText = 'Eraro dum ŝargo de la datumoj.';
        console.error(eraro);
    });


document.getElementById('sercxo').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sercxi();
        this.blur(); // movi la fokuson for
    }
});

document.addEventListener('keydown', function (event) {
    if (document.activeElement.tagName === 'INPUT') {
        // Neniu paĝoŝanĝo dum la uzanto tajpas en la serĉokampo
        return;
    }
    if (event.key === 'ArrowRight') {
        sekva();
    } else if (event.key === 'ArrowLeft') {
        antauxa();
    }
});

function antauxa() {
    if (nunaIndekso <= 0) {
        montriBildon(unuajKapvortoj.length - 1);
    } else {
        montriBildon(nunaIndekso - 1);
    }
}

function determiniBazanVojon() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // cd C:\Data\vscode
        // python -m http.server
        // http://localhost:8000/konciza-etimologia-vortaro.github.io/
        return '../kev-webp/';
    } else {
        // https://konciza-etimologia-vortaro.github.io/
        return 'https://konciza-etimologia-vortaro.github.io/kev-webp/';
    }
}

function estasNumero(teksto) {
    return /^\d+$/.test(teksto);
}

function estasVorto(teksto) {
    teksto = konvertiXsistemon(teksto);
    return /^[abcĉdefgĝhĥijĵklmnoprsŝtuŭvz]+$/.test(teksto);
}

function ĝisdatigiURLon(teksto) {
    const novaURL = window.location.pathname + '?s=' + encodeURIComponent(teksto);
    window.history.replaceState(null, '', novaURL);
}

function konvertiXsistemon(teksto) {
    return teksto
        .replace(/cx/g, "ĉ")
        .replace(/gx/g, "ĝ")
        .replace(/hx/g, "ĥ")
        .replace(/jx/g, "ĵ")
        .replace(/sx/g, "ŝ")
        .replace(/ux/g, "ŭ");
}

function legiVortonElURL() {
    const params = new URLSearchParams(window.location.search);
    const sParam = params.get('s');
    if (sParam) {
        document.getElementById('sercxo').value = sParam;;
        sercxi();
    }
}

function montriBildon(indekso) {
    nunaIndekso = indekso;
    const numero = (indekso + 1).toString().padStart(3, "0");
    const bazoVojo = determiniBazanVojon();
    const bildoUrl = bazoVojo + `bildo${numero}.webp`;
    document.getElementById('rezulto').innerHTML =
        `<img src="${bildoUrl}" alt="Paĝo de vortaro">`;
}

function montriMesagxon(teksto) {
    document.getElementById('rezulto').innerHTML = teksto;
}

function montriPagxonLauxNumero(teksto) {
    let numero = parseInt(teksto, 10);
    if (numero < 1) {
        numero = 1;
    } else if (numero > 504) {
        numero = 504;
    }
    montriBildon(numero + 13);
}

function normaligiPorOrdo(teksto) {
    return teksto.split('').map(litero => esperantaKonverto[litero] || litero).join('');
}

function preniEnigon() {
    return document.getElementById('sercxo').value.trim().toLowerCase();
}

function sekva() {
    if (nunaIndekso >= unuajKapvortoj.length - 1) {
        montriBildon(0);
    } else {
        montriBildon(nunaIndekso + 1);
    }
}

function sercxi() {
    let teksto = preniEnigon();
    if (!teksto) return;

    ĝisdatigiURLon(teksto);

    if (estasNumero(teksto)) {
        montriPagxonLauxNumero(teksto);
    } else if (estasVorto(teksto)) {
        teksto = konvertiXsistemon(teksto).toLowerCase();
        if (neOrdigitajKapvortoj[teksto]) {
            sercxiEnNeOrdigitajKapvortoj(teksto);
        } else {
            serĉiEnUnuajKapvortoj(teksto)
        }
    } else {
        montriMesagxon('Bonvolu tajpi validan vorton kun nur esperantaj literoj (inkluzive ĉ aŭ cx, ktp) aŭ paĝnumeron.');
    }
}

function sercxiEnNeOrdigitajKapvortoj(teksto) {
    const bildoNumero = neOrdigitajKapvortoj[teksto];
    montriBildon(bildoNumero - 1);
}

function serĉiEnUnuajKapvortoj(teksto) {
    teksto = normaligiPorOrdo(teksto);

    let maldekstro = 13; // indekso de "a"
    let dekstro = 514; // indekso de "zipo"
    let trovita = -1;

    while (maldekstro <= dekstro) {
        let mezo = Math.floor((maldekstro + dekstro) / 2);
        if (unuajKapvortoj[mezo] == "") {
            mezo += (mezo == dekstro) ? -1 : +1;
        }
        let vorto = unuajKapvortoj[mezo].split("/")[0].toLowerCase();
        vorto = normaligiPorOrdo(vorto);

        if (teksto == vorto) {
            trovita = mezo;
            break;
        }

        if (teksto > vorto) {
            trovita = mezo;
            maldekstro = mezo + 1;
        } else {
            dekstro = mezo - 1;
        }
    }

    if (trovita >= 0) {
        montriBildon(trovita);
    } else {
        montriMesagxon('Neniu kongruo trovita.');
    }
}
