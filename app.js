// ***** Selectors *****
const gelirInput = document.querySelector("#income-input");
const gelirEkleBtn = document.querySelector("#income-button");
const gelirFormu = document.querySelector("#gelirFormu");
const gelirTablosu = document.querySelector("#income-td");
const harcamaTablosu = document.querySelector("#total-Exp");
const kalanGelirTablosu = document.querySelector("#income-Rest");
const giderFormu = document.querySelector("#giderFormu");
const giderBtn = document.querySelector("#giderBtn");
const harcamaYer = document.querySelector("#harcamaYer");
const harcamaTarih = document.querySelector("#harcamaTarih");
const harcamaMiktar = document.querySelector("#harcamaMiktar");
const tbody = document.querySelector("#tbodyTag");
const cleanForm = document.querySelector("#cleanForm");

// ***** Variables *****
let toplamGelir = 0;
let toplamHarcama = 0;
let harcamalar = [];

// ***** Event Listeners *****
// Gelir formu submit edilince toplam gelirler ekrana ve localStorage'a yazılır
gelirFormu.addEventListener("submit", (event) => {
  event.preventDefault();
  toplamGelir += Number(gelirInput.value);
  localStorage.setItem("toplamGelir", toplamGelir);
  gelirFormu.reset();
  toplamGelirGiderYaz();
});
// Sayfa refresh edildiğinde veriler localStorage'dan okunarak global değişkenlere aktarılır.
window.addEventListener("load", () => {
  harcamaTarih.valueAsDate = new Date();
  toplamGelir = Number(localStorage.getItem("toplamGelir"));
  harcamalar = JSON.parse(localStorage.getItem("harcamalar")) || [];
  toplamGelirGiderYaz();
  harcamaTarih.valueAsDate = new Date();
  harcamalar.forEach((item) => giderTablosu(Object.values(item)));
});
// Yeni gider formu submit edilince giderEkle fonksiyonu çalıştırılır
giderFormu.addEventListener("submit", (event) => {
  event.preventDefault();
  giderEkle();
});
// Tablodan ve localStorage'den silme
tbody.addEventListener("click", (event) => {
  if (event.target.tagName == "I") {
    event.target.closest("tr").remove();
    harcamalar = harcamalar.filter((item) => item.id != event.target.id);
    localStorage.setItem("harcamalar", JSON.stringify(harcamalar));
    toplamGelirGiderYaz();
  }
});
// Form reset ediliyor.
cleanForm.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all information?")) {
    toplamGelir = 0;
    toplamHarcama = 0;
    harcamalar = [];
    localStorage.clear();
    window.location.reload(false);
  }
});

// ***** Functions *****
// Gelir ve giderlerin toplamını tabloya yazma
function toplamGelirGiderYaz() {
  gelirTablosu.innerText = `$${toplamGelir}`;
  toplamHarcama = harcamalar.reduce(
    (acc, item) => (acc += Number(item.harcamaMiktari)),
    0
  );
  harcamaTablosu.innerText = `$${toplamHarcama}`;
  kalanGelirTablosu.innerText = `$${toplamGelir - toplamHarcama}`;
}
// Yeni gideri ekleyip toplam giderleri güncelleme
function giderEkle() {
  if (harcamaMiktar.value != "") {
    harcamalar.push({
      id: new Date().getTime(),
      harcamayeri: harcamaYer.value,
      harcamaTarihi: harcamaTarih.value,
      harcamaMiktari: harcamaMiktar.value,
    });
    localStorage.setItem("harcamalar", JSON.stringify(harcamalar));
    giderFormu.reset();
    harcamaTarih.valueAsDate = new Date();
    toplamGelirGiderYaz();
    giderTablosu(Object.values(harcamalar[harcamalar.length - 1]));
  } else {
    alert("You must write the amount of expenditure!");
  }
}
// Tablo oluşturma i elementine id ve atribute atama
function giderTablosu(sonHarcamaArr) {
  const id = sonHarcamaArr[0];
  sonHarcamaArr.shift();
  const trTag = document.createElement("tr");
  for (let i of sonHarcamaArr) {
    const tdTag = document.createElement("td");
    const tdText = document.createTextNode(i);
    tdTag.appendChild(tdText);
    trTag.appendChild(tdTag);
  }
  const tdLastTag = document.createElement("td");
  const iTag = document.createElement("i");
  tdLastTag.appendChild(iTag);
  trTag.appendChild(tdLastTag);
  tbodyTag.appendChild(trTag);
  const lastiTag = tbody.lastElementChild.lastElementChild.firstElementChild;
  lastiTag.setAttribute("class", "fa-solid fa-eraser fa-lg text-danger");
  lastiTag.setAttribute("type", "button");
  lastiTag.setAttribute("id", id);
  tbody.lastElementChild.lastElementChild.setAttribute("class", "text-center");
}
