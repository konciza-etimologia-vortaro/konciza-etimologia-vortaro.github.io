let listoDeVortoj = [];
let nunaIndekso = -1;

fetch('indeksoj.json')
    .then(respondo => respondo.json())
    .then(datumoj => {
        listoDeVortoj = datumoj;
        legiVortonElURL();
    })
    .catch(eraro => {
        document.getElementById('rezulto').innerText = 'Eraro dum ŝargo de la indeksoj.';
        console.error(eraro);
    });

document.getElementById('sercxo').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sercxi();
        this.blur();
    }
});

document.addEventListener('keydown', function (event) {
    if (document.activeElement.tagName === 'INPUT') {
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
        montriBildon(listoDeVortoj.length - 1);
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

function ĝisdatigiURLon(enigo) {
    const novaURL = window.location.pathname + '?s=' + encodeURIComponent(enigo);
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
        const enigoElem = document.getElementById('sercxo');
        enigoElem.value = sParam;
        sercxi();
    }
}

function montriBildon(indekso) {
    if (indekso < 0 || indekso >= listoDeVortoj.length) return;
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
    montriBildon(numero + 13 - 1);
}

function preniEnigon() {
    return document.getElementById('sercxo').value.trim().toLowerCase();
}

function sekva() {
    if (nunaIndekso >= listoDeVortoj.length - 1) {
        montriBildon(0);
    } else {
        montriBildon(nunaIndekso + 1);
    }
}

function sercxi() {
    let enigo = preniEnigon();
    if (!enigo) return;

    ĝisdatigiURLon(enigo);

    if (estasNumero(enigo)) {
        montriPagxonLauxNumero(enigo);
    } else if (estasVorto(enigo)) {
        sercxiVorton(enigo);
    } else {
        montriMesagxon('Bonvolu tajpi validan vorton kun nur esperantaj literoj (inkluzive ĉ aŭ cx, ktp) aŭ paĝnumeron.');
    }
}

function sercxiVorton(teksto) {
    teksto = konvertiXsistemon(teksto).toLowerCase();
    let trovita = -1;
    for (let i = listoDeVortoj.length - 1; i >= 0; i--) {
        if (listoDeVortoj[i]) {
            const nurVorto = listoDeVortoj[i].split("/")[0].toLowerCase();
            if (teksto >= nurVorto) {
                trovita = i;
                break;
            }
        }
    }
    if (trovita >= 0) {
        montriBildon(trovita);
    } else {
        montriMesagxon('Neniu kongruo trovita.');
    }
}
