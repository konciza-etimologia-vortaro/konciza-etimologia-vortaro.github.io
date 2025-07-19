let lastLitero = null;
let neOrdigitajKapvortoj = [];
let nunaBildo = 1;
let tuŝoKomencoX = null;
let unuajKapvortoj = [];
let unuajKapvortojObj = [];

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

const xsistemoMapo = {
    'c': 'ĉ',
    'g': 'ĝ',
    'h': 'ĥ',
    'j': 'ĵ',
    's': 'ŝ',
    'u': 'ŭ'
};

Promise.all([
    fetch('pagxaj-unuaj-kapvortoj.json').then(r => r.json()),
    fetch('ne-ordigitaj-kapvortoj.json').then(r => r.json())
])
    .then(([kapvortoj, neordigitaj]) => {
        unuajKapvortoj = kapvortoj;
        unuajKapvortojObj = Object.entries(kapvortoj).map(([kapvorto, bildo]) => ({
            kapvorto,
            bildo
        }));
        neOrdigitajKapvortoj = neordigitaj;
        sersxiHash();
    })
    .catch(eraro => {
        document.getElementById('rezulto').innerText = 'Eraro dum ŝarĝado de la datumoj.';
        console.error(eraro);
    });

document.addEventListener('click', function (event) {
    const elemento = event.target.closest('.ligilo-pagxo');
    if (elemento) {
        const paĝo = parseInt(elemento.dataset.pagxo, 10);
        if (!isNaN(paĝo)) {
            montriBildon(paĝo);
        }
    }
});

window.addEventListener('hashchange', sersxiHash);

document.getElementById('sercxo').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sercxiEnigon();
        // Movi la fokuson for post premado de Enter, kvazaŭ oni klakus ekstere
        this.blur();
    }
});

function aktualigiRetposxton() {
    const uzanto = "mcorne";
    const domajno = "yahoo.com";
    const adreso = uzanto + "@" + domajno;
    const ligilo = "mailto:" + adreso;
    const celloko = document.getElementById("retposxto");
    if (celloko) {
        celloko.innerHTML = 'Retpoŝto: <a href="' + ligilo + '">' + adreso + '</a>';
    }
}

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

document.addEventListener('keydown', function (event) {
    const sercxo = document.getElementById('sercxo');

    // Ignori klavkombinojn kun Ctrl, Alt, aŭ Meta
    if (event.ctrlKey || event.altKey || event.metaKey) return;

    if (document.activeElement !== sercxo) {
        const litero = event.key.toLowerCase();

        // Kontroli ĉu lasta litero + x estas speciala litero
        if (lastLitero && litero === 'x') {
            const kombinita = xsistemoMapo[lastLitero];
            if (kombinita && unuajKapvortoj[kombinita]) {
                montriBildon(unuajKapvortoj[kombinita]);
                event.preventDefault();
                lastLitero = null;
                return;
            }
        }

        // Normala traktado por unu litero
        if (litero.length === 1 && unuajKapvortoj[litero]) {
            montriBildon(unuajKapvortoj[litero]);
            event.preventDefault();
            lastLitero = litero; // Memoru
            return;
        }

        // Se alia klavo, nuligi lastan literon
        lastLitero = null;
    }

    switch (event.key) {
        case 'ArrowRight':
            if (document.activeElement !== sercxo) sekva();
            break;

        case 'ArrowLeft':
            if (document.activeElement !== sercxo) antauxa();
            break;

        case 'F2':
            event.preventDefault();
            if (document.activeElement === sercxo) {
                sercxo.blur();
            } else {
                sercxo.focus();
            }
            break;

        case 'End':
            if (document.activeElement !== sercxo) {
                montriBildon(518);
                event.preventDefault();
            }
            break;

        case 'Home':
            if (document.activeElement !== sercxo) {
                montriBildon(1);
                event.preventDefault();
            }
            break;
    }
});

document.addEventListener('touchstart', function (e) {
    tuŝoKomencoX = e.touches[0].clientX;
});

document.addEventListener('touchend', function (e) {
    if (tuŝoKomencoX === null) return;

    let tuŝoFinoX = e.changedTouches[0].clientX;
    let diferenco = tuŝoFinoX - tuŝoKomencoX;

    if (Math.abs(diferenco) > 50) { // sojlo por eviti falsajn gestojn
        if (diferenco < 0) {
            // Ŝovo maldekstren
            if (document.activeElement !== sercxo) sekva();
        } else {
            // Ŝovo dekstren
            if (document.activeElement !== sercxo) antauxa();
        }
    }

    tuŝoKomencoX = null;
});

function estasNumero(teksto) {
    return /^\d+$/.test(teksto);
}

function estasVorto(teksto) {
    return /^[abcĉdefgĝhĥijĵklmnoprsŝtuŭvz]+$/.test(teksto);
}

function forigiHashon() {
    history.pushState(null, '', window.location.pathname);
    document.getElementById('sercxo').value = '';
    montriMesagxon('');
}

function ĝisdatigiURLon(teksto) {
    // Aldoni la serĉon al la retumila historio
    const url = window.location.pathname + '#' + encodeURIComponent(teksto);
    window.history.pushState(null, '', url);
    raportiSercxonAlGoatCounter();
}

function konvertiXsistemon(teksto) {
    return teksto.replace(/([cghjsu])x/g, function (_, litero) {
        return xsistemoMapo[litero] || litero + 'x';
    });
}

function montriBildon(bildo) {
    nunaBildo = bildo;
    const numero = bildo.toString().padStart(3, "0");
    const bazoVojo = determiniBazanVojon();
    const url = bazoVojo + `bildo${numero}.webp`;
    const rezulto = document.getElementById('rezulto');
    rezulto.classList.remove('informo');
    rezulto.innerHTML = `<img src="${url}" alt="Paĝo de vortaro">`;
}

function montriInformon() {
    fetch('informoj.html')
        .then(response => {
            if (!response.ok) throw new Error('Ne eblis ŝargi la informon.');
            return response.text();
        })
        .then(html => {
            const rezulto = document.getElementById('rezulto');
            rezulto.classList.add('informo');
            rezulto.innerHTML = html;
            aktualigiRetposxton();
        })
        .catch(error => {
            const rezulto = document.getElementById('rezulto');
            rezulto.classList.remove('informo');
            rezulto.innerText = 'Eraro dum ŝarĝado de la informoj.';
            console.error(error);
        });
}

function montriMesagxon(teksto) {
    const rezulto = document.getElementById('rezulto');
    rezulto.classList.remove('informo');
    rezulto.textContent = teksto;
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

function raportiSercxonAlGoatCounter() {
    if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({
            path: location.pathname + location.search + location.hash
        });
    }
}

function sekva() {
    if (nunaBildo >= 518) {
        montriBildon(1);
    } else {
        montriBildon(nunaBildo + 1);
    }
}

function sercxiEnigon() {
    let teksto = document.getElementById('sercxo').value.trim().toLowerCase();
    if (teksto) {
        ĝisdatigiURLon(teksto);
        sercxiTekston(teksto);
    }
}

function sersxiHash() {
    let hash = window.location.hash.slice(1).trim();

    if (hash) {
        hash = decodeURIComponent(hash);
        document.getElementById('sercxo').value = hash;
        sercxiTekston(hash);
    } else {
        montriMesagxon("");
    }
}

function sercxiNeOrdigitajKapvortoj(teksto) {
    const bildo = neOrdigitajKapvortoj[teksto];
    montriBildon(bildo);
}

function sercxiTekston(teksto) {
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
        sercxiNeOrdigitajKapvortoj(teksto);
    } else {
        serĉiUnuajKapvortoj(teksto)
    }
}

function serĉiUnuajKapvortoj(teksto) {
    let normaligitaTeksto = normaligiPorOrdo(teksto);

    let maldekstro = 0;
    let dekstro = unuajKapvortojObj.length - 1;
    let trovita = -1;

    while (maldekstro <= dekstro) {
        let mezo = Math.floor((maldekstro + dekstro) / 2);
        let kapvorto = unuajKapvortojObj[mezo].kapvorto.toLowerCase();
        let normaligitaKapvorto = normaligiPorOrdo(kapvorto);

        if (normaligitaTeksto >= normaligitaKapvorto) {
            trovita = mezo;
            maldekstro = mezo + 1;
        } else {
            dekstro = mezo - 1;
        }
    }

    if (trovita >= 0) {
        montriBildon(unuajKapvortojObj[trovita].bildo);
    } else {
        montriMesagxon('Neniu kongruaĵo trovita.');
    }
}

