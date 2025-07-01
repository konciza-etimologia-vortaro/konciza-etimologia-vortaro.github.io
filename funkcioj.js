let listoDeVortoj = [];
let nunaIndekso = -1;

let bazoVojo = '';
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // cd C:\Data\vscode
    // python -m http.server
    // http://localhost:8000/konciza-etimologia-vortaro.github.io/
    bazoVojo = '../kev-webp/';
} else {
    // https://konciza-etimologia-vortaro.github.io/
    bazoVojo = 'https://konciza-etimologia-vortaro.github.io/kev-webp/';
}

fetch('indeksoj.json')
    .then(respondo => respondo.json())
    .then(datumoj => {
        listoDeVortoj = datumoj;
    })
    .catch(eraro => {
        document.getElementById('rezulto').innerText = 'Eraro dum ŝargo de la indeksoj.';
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
        return;
    }
    if (event.key === 'ArrowRight') {
        sekva();
    } else if (event.key === 'ArrowLeft') {
        antauxa();
    }
});

function konvertiXsistemon(teksto) {
    return teksto
        .replace(/cx/g, "ĉ")
        .replace(/gx/g, "ĝ")
        .replace(/hx/g, "ĥ")
        .replace(/jx/g, "ĵ")
        .replace(/sx/g, "ŝ")
        .replace(/ux/g, "ŭ");
}

function montriBildon(indekso) {
    if (indekso < 0 || indekso >= listoDeVortoj.length) return;
    nunaIndekso = indekso;
    const numero = (indekso + 1).toString().padStart(3, "0");
    const bildoUrl = bazoVojo + `bildo${numero}.webp`;
    document.getElementById('rezulto').innerHTML =
        `<img src="${bildoUrl}" alt="Paĝo de vortaro">`;
}

function sercxi() {
    let enigo = document.getElementById('sercxo').value.trim().toLowerCase();
    if (!enigo) return;

    // Ĉu estas nur ciferoj?
    if (/^\d+$/.test(enigo)) {
        let numero = parseInt(enigo, 10);
        if (numero < 1) {
            numero = 1;
        } else if (numero > 504) {
            numero = 504;
        }
        montriBildon(numero + 13);
        return;
    }

    // Ĉu estas nur permesataj literoj?
    enigo = konvertiXsistemon(enigo);
    if (/^[abcĉdefgĝhĥijĵklmnoprsŝtuŭvz]+$/.test(enigo)) {
        let trovita = -1;
        for (let i = listoDeVortoj.length - 1; i >= 0; i--) {
            if (listoDeVortoj[i]) {
                const nurVorto = listoDeVortoj[i].split("/")[0].toLowerCase();
                if (enigo >= nurVorto) {
                    trovita = i;
                    break;
                }
            }
        }
        if (trovita >= 0) {
            montriBildon(trovita);
        } else {
            document.getElementById('rezulto').innerHTML = 'Neniu kongruo trovita.';
        }
    } else {
        // Se miksita aŭ enhavas nepermesatajn signojn
        document.getElementById('rezulto').innerHTML = 'Bonvolu tajpi validan vorton kun nur esperantaj literoj (inkluzive ĉ aŭ cx, ktp) aŭ paĝnumeron.';
    }
}

function antauxa() {
    if (nunaIndekso <= 0) {
        montriBildon(listoDeVortoj.length - 1);
    } else {
        montriBildon(nunaIndekso - 1);
    }
}

function sekva() {
    if (nunaIndekso >= listoDeVortoj.length - 1) {
        montriBildon(0); // ciklo al la unua
    } else {
        montriBildon(nunaIndekso + 1);
    }
}
