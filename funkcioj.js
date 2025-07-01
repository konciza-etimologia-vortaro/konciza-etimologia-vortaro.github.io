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

function montriBildon(indekso) {
    if (indekso < 0 || indekso >= listoDeVortoj.length) return;
    nunaIndekso = indekso;
    const numero = (indekso + 15).toString().padStart(3, "0");
    const bildoUrl = bazoVojo + `bildo${numero}.webp`;
    const vorto = listoDeVortoj[indekso];
    document.getElementById('rezulto').innerHTML =
        `<div><strong>${vorto}</strong></div>
     <img src="${bildoUrl}" alt="Paĝo de vortaro">`;
}

function sercxi() {
    const enigo = document.getElementById('sercxo').value.trim().toLowerCase();
    if (!enigo) return;
    let trovita = -1;
    for (let i = listoDeVortoj.length - 1; i >= 0; i--) {
        if (enigo >= listoDeVortoj[i].toLowerCase()) {
            trovita = i;
            break;
        }
    }
    if (trovita >= 0) {
        montriBildon(trovita);
    } else {
        document.getElementById('rezulto').innerHTML = 'Neniu kongruo trovita.';
    }
}

function antauxa() {
    if (nunaIndekso > 0) montriBildon(nunaIndekso - 1);
}

function sekva() {
    if (nunaIndekso < listoDeVortoj.length - 1) montriBildon(nunaIndekso + 1);
}
