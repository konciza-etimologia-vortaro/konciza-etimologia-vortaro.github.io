let neOrdigitajKapvortoj = [];
let nunaBildo = 1;
let unuajKapvortoj = [];

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
    .then(([kapvortoj, neordigitaj]) => {
        unuajKapvortoj = Object.entries(kapvortoj).map(([kapvorto, bildo]) => ({
            kapvorto,
            bildo
        }));
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
        // Movi la fokuson for post premado de Enter, kvazaŭ oni klakus ekstere
        this.blur();
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
    } else if (event.key === 'F2') {
        event.preventDefault();
        document.getElementById('sercxo').focus();
    }
});

window.addEventListener('hashchange', legiVortonElURL);

function antauxa() {
    if (nunaBildo <= 1) {
        montriBildon(518);
    } else {
        montriBildon(nunaBildo - 1);
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
    return /^[abcĉdefgĝhĥijĵklmnoprsŝtuŭvz]+$/.test(teksto);
}

function ĝisdatigiURLon(teksto) {
    const url = window.location.pathname + '#' + encodeURIComponent(teksto);
    window.history.replaceState(null, '', url);
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
    if (window.location.href.endsWith("#")) {
        montriMesagxon("");
        history.replaceState(null, '', window.location.pathname);
        location.reload();
    }

    const hash = window.location.hash.slice(1).trim();
    if (hash) {
        document.getElementById('sercxo').value = decodeURIComponent(hash);
        sercxi();
    } else {
    }
}


function montriBildon(bildo) {
    nunaBildo = bildo;
    const numero = bildo.toString().padStart(3, "0");
    const bazoVojo = determiniBazanVojon();
    const url = bazoVojo + `bildo${numero}.webp`;
    document.getElementById('rezulto').innerHTML =
        `<img src="${url}" alt="Paĝo de vortaro">`;
}

function montriMesagxon(teksto) {
    document.getElementById('rezulto').innerHTML = teksto;
}

function montriPagxonLauxNumero(teksto) {
    let paĝo = parseInt(teksto, 10);
    if (paĝo < 1) {
        paĝo = 1;
    } else if (paĝo > 504) {
        paĝo = 504;
    }
    montriBildon(paĝo + 14);
}

function normaligiPorOrdo(teksto) {
    return teksto.split('').map(litero => esperantaKonverto[litero] || litero).join('');
}

function preniEnigon() {
    return document.getElementById('sercxo').value.trim().toLowerCase();
}

function sekva() {
    if (nunaBildo >= 518) {
        montriBildon(1);
    } else {
        montriBildon(nunaBildo + 1);
    }
}

function sercxi() {
    let teksto = preniEnigon();
    if (!teksto) return;

    ĝisdatigiURLon(teksto);

    if (estasNumero(teksto)) {
        montriPagxonLauxNumero(teksto);
        return;
    }

    teksto = konvertiXsistemon(teksto).toLowerCase();
    if (!estasVorto(teksto)) {
        montriMesagxon('Bonvolu tajpi validan vorton kun nur esperantaj literoj (inkluzive ĉ aŭ cx, ktp) aŭ paĝnumeron.');
        return;
    }

    if (neOrdigitajKapvortoj[teksto]) {
        sercxiEnNeOrdigitajKapvortoj(teksto);
    } else {
        serĉiEnUnuajKapvortoj(teksto)
    }
}

function sercxiEnNeOrdigitajKapvortoj(teksto) {
    const bildo = neOrdigitajKapvortoj[teksto];
    montriBildon(bildo);
}

function serĉiEnUnuajKapvortoj(teksto) {
    let normaligitaTeksto = normaligiPorOrdo(teksto);

    let maldekstro = 0;
    let dekstro = unuajKapvortoj.length - 1;
    let trovita = -1;

    while (maldekstro <= dekstro) {
        let mezo = Math.floor((maldekstro + dekstro) / 2);
        let kapvorto = unuajKapvortoj[mezo].kapvorto.split("/")[0].toLowerCase();
        let normaligitaKapvorto = normaligiPorOrdo(kapvorto);

        if (normaligitaTeksto >= normaligitaKapvorto) {
            trovita = mezo;
            maldekstro = mezo + 1;
        } else {
            dekstro = mezo - 1;
        }
    }

    if (trovita >= 0) {
        montriBildon(unuajKapvortoj[trovita].bildo);
    } else {
        montriMesagxon('Neniu kongruo trovita.');
    }
}

