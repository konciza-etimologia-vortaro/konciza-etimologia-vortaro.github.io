# Reta aplikaĵo de la *Konciza Etimologia Vortaro*

Ĉi tiu deponejo enhavas la fontkodon de la reta aplikaĵo por la
[*Konciza Etimologia Vortaro* de André Cherpillod](https://eo.wikipedia.org/wiki/Konciza_Etimologia_Vortaro).

La aplikaĵo ebligas serĉi vorton kaj vidi la taŭgan paĝon de la vortaro, kiu estis skanita el papera ekzemplero kaj konservita en:
https://github.com/konciza-etimologia-vortaro/kev-webp.

Rete uzebla versio disponeblas ĉe:
https://konciza-etimologia-vortaro.github.io/.

---

## Trajtoj

- Rapida serĉo de vortoj
- Reala bildmontro de la vortaro
- Funkcias sen servilo (nur statika HTML/JS)

---

## Prizorgo

### Dosiero *pagxaj-unuaj-kapvortoj.json*

Ĉi tiu dosiero enhavas la unuajn vortojn por ĉiu paĝo de la vortaro, kaj estas uzata de la serĉalgoritmo por trovi la paĝon de la cela vorto.

- La formato estas *"vorto": bildnumero*.
- La vorto estas kutime la unua vorto aperanta sur la paĝo.
- Se tiu vorto ne kongruas kun la ĝusta alfabeta ordo (ofte ĉe radikoj), estas elektita la unua el la sekvaj vortoj, kiu troviĝas en la ĝusta alfabeta pozicio, ekz. *aleatora* estas uzata anstataŭ *aleo* por bildnumero 29 (paĝo 15), ĉar *aleo* aperas antaŭ *aleatora*.
- Plurala vorto devas esti konvertita al singulara, ekz. *bivalvo* anstataŭ *bivalvoj* ĉe bildnumero 72 (paĝo 58).
- La **ordo de vortoj laŭ bildnumeroj neniam devas esti ŝanĝita**, por ke la serĉalgoritmo funkciu ĝuste.

### Dosiero *ne-ordigitaj-kapvortoj.json*

Ĉi tiu dosiero enhavas vortojn, kiuj ne aperas en la ĝusta alfabeta ordo en la vortaro, kaj kiuj estas unue komparataj kun la cela vorto per la serĉalgoritmo.

- La formato estas *"vorto": bildnumero*.
- La **vorto devas esti en minuskla formo**.
- Vortoj ne en ĝusta alfabeta pozicio devas esti inkluzivitaj, ekzemple:
  + Radikoj: ekz. *ado*, *adi*, *admiri* ĉe bildnumero 18 (paĝo 4).
  + Dua vorto sur la sama linio: ekz. *afiŝo* post *afido* ĉe bildnumero 20 (paĝo 6).
- Ne necesas aldoni vorton se la serĉilo jam povas trovi ĝin — tio okazas kiam ĝi troviĝas inter la unua vorto de la nuna paĝo kaj tiu de la sekva, ekz. *afero* kaj *aerostatiko* ĉe bildnumero 20 (paĝo 6).
- Ne aldonu duan kapvorton se ĝi jam ekzistas aliloke. Ekzemplo:
  + *dzeta aŭ zeta* ĉe bildnumero 122 (paĝo 108)
  + *zeta aŭ dzeta* ĉe bildnumero 514 (paĝo 500)
- Al plurala vorto devas esti aldonita la singulara, ekz. *braĥiuro* sub *braĥiuroj* ĉe bildnumero 78 (paĝo 64).
- **Ne ŝanĝu la ordon de la vortoj** en la dosiero, ĉar ĝi reflektas ilian ordon en la vortaro kaj faciligas prizorgadon.

### Retpaĝsimbolo *favicon.ico*

La retpaĝsimbolo estas kreita per:
[https://favicon.io/favicon-generator/](https://favicon.io/favicon-generator/)
uzante la tiparfamilion *Koulen*, tiparan grandecon de 90px, kaj la bluan koloron difinitan en *stiloj.css* (primary-color: #3F51B5).

---

## Testo de la retaplikaĵo

Por testi la retaplikaĵon, instalitan ekz. ĉe *C:\Data\vscode*, kun Visual Studio Code en Windows,
sekvu la jenajn paŝojn:

### Dosierstrukturo
- La aplikaĵo estas en:<br>
*C:\Data\vscode\konciza-etimologia-vortaro.github.io*
- La bildoj/paĝoj estas en:<br>
*C:\Data\vscode\kev-webp*

### Lanĉi HTTP-servilon
En Visual Studio Code aŭ en komanda linio, iru al la radika dosierujo:<br>
```bash
cd C:\Data\vscode
python -m http.server
```

### Testi en retumilo
Malfermu en retumilo la jenan adreson:<br>
http://localhost:8000/konciza-etimologia-vortaro.github.io/
