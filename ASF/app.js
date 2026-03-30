// Global holat
let umumiySavdoUSD = 0;
let umumiyNasiyaUSD = 0;
let joriyKurs = 12850; // Zaxira kurs
let tarixList = [];

// 1. Dastur yonganda kursni olish
async function kursniYuklash() {
    try {
        const response = await fetch(
            "https://cbu.uz/uz/arkhiv-kursov-valyut/json/",
        );
        const data = await response.json();
        const usdData = data.find((item) => item.Ccy === "USD");
        joriyKurs = parseFloat(usdData.Rate);
        document.getElementById("kurs-korsatgich").innerText =
            `Bugungi Kurs: 1$ = ${joriyKurs} so'm`;
    } catch (error) {
        document.getElementById("kurs-korsatgich").innerText =
            `Internet yo'q. Eski kurs: 1$ = ${joriyKurs} so'm`;
    }
}
kursniYuklash();

// 2. Oynalarni almashtirish (Asosiy / Tarix)
function oynaniUzgartirish(oyna) {
    if (oyna === "asosiy") {
        document.getElementById("asosiy-oyna").classList.remove("hidden");
        document.getElementById("tarix-oyna").classList.add("hidden");
    } else {
        document.getElementById("asosiy-oyna").classList.add("hidden");
        document.getElementById("tarix-oyna").classList.remove("hidden");
        tarixniChizish(); // Oynaga o'tganda jadvalni chizadi
    }
}

// 3. Sotuvni amalga oshirish funksiyasi
async function sotuvniQushish() {
    // Inputlarni olish
    const turi = document.getElementById("tovar-turi").value;
    const metr = document.getElementById("tovar-metri").value;
    const qalinlik = document.getElementById("tovar-qalinligi").value;
    const ism = document.getElementById("mijoz-ismi").value || "Noma'lum";
    const soni = parseFloat(document.getElementById("tovar-soni").value);
    const narxi = parseFloat(document.getElementById("tovar-narxi").value);
    const valyuta = document.getElementById("valyuta-turi").value;
    const tolov = document.getElementById("tolov-turi").value;

    // Xatolikni tekshirish
    if (!soni || !narxi) {
        alert("Iltimos, tovar soni va narxini to'g'ri kiriting!");
        return;
    }

    // Kursni ishonch uchun yana bir bor yangilaymiz
    await kursniYuklash();

    // Dollarga o'girish mantiqi
    let bittaDollarNarxi = 0;
    let jamiDollarNarxi = 0;

    if (valyuta === "UZS") {
        bittaDollarNarxi = narxi / joriyKurs;
    } else {
        bittaDollarNarxi = narxi;
    }

    jamiDollarNarxi = bittaDollarNarxi * soni;

    // Savdo yoki Nasiyaga qo'shish
    if (tolov === "Naqd") {
        umumiySavdoUSD += jamiDollarNarxi;
    } else {
        umumiyNasiyaUSD += jamiDollarNarxi;
    }

    // Ekranni yangilash
    document.getElementById("bugungi-savdo").innerText =
        umumiySavdoUSD.toFixed(2) + " $";
    document.getElementById("umumiy-nasiya").innerText =
        umumiyNasiyaUSD.toFixed(2) + " $";

    // Tarixga saqlash (Asil narxi bilan)
    let asilNarxMatni =
        valyuta === "UZS"
            ? `${narxi.toLocaleString()} so'm`
            : `$${narxi.toFixed(2)}`;

    tarixList.push({
        vaqt: new Date().toLocaleTimeString(),
        ism: ism,
        tovar: `${turi} | ${metr} | ${qalinlik}`,
        soni: soni,
        asilNarx: asilNarxMatni,
        jamiJoriyDollar: jamiDollarNarxi.toFixed(2),
        holati: tolov,
    });

    // Formalarni tozalash
    document.getElementById("mijoz-ismi").value = "";
    document.getElementById("tovar-soni").value = "";
    document.getElementById("tovar-narxi").value = "";

    alert("Sotuv muvaffaqiyatli saqlandi!");
}

// 4. Tarixni jadvalga chizish
function tarixniChizish() {
    const tbody = document.getElementById("tarix-jadvali");
    tbody.innerHTML = ""; // Tozalash

    if (tarixList.length === 0) {
        tbody.innerHTML =
            '<tr><td colspan="7" style="text-align:center;">Hali savdo qilinmadi</td></tr>';
        return;
    }

    // Eng oxirgi savdo birinchi ko'rinishi uchun reverse() qildik
    [...tarixList].reverse().forEach((item) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.vaqt}</td>
            <td><b>${item.ism}</b></td>
            <td>${item.tovar}</td>
            <td>${item.soni} ta</td>
            <td>${item.asilNarx}</td>
            <td style="color: green; font-weight: bold;">$${item.jamiJoriyDollar}</td>
            <td><span class="status-badge">${item.holati}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// let umumiySavdoUSD = 0;
// let umumiyNasiyaUSD = 0;
// let joriyKurs = 12850;
// let tarixList = JSON.parse(localStorage.getItem('savdo_tarixi')) || []; // LocalStorage'dan olish

// 1. Dastur yonganda ma'lumotlarni tiklash
window.onload = () => {
    kursniYuklash();
    hisoblarniYangilash();
};

async function kursniYuklash() {
    try {
        const response = await fetch(
            "https://cbu.uz/uz/arkhiv-kursov-valyut/json/",
        );
        const data = await response.json();
        const usdData = data.find((item) => item.Ccy === "USD");
        joriyKurs = parseFloat(usdData.Rate);
        document.getElementById("kurs-korsatgich").innerText =
            `Bugungi Kurs: 1$ = ${joriyKurs} so'm`;
    } catch (error) {
        document.getElementById("kurs-korsatgich").innerText =
            `Kurs: 1$ = ${joriyKurs} so'm`;
    }
}

// 2. Sotuvni qo'shish
function sotuvniQushish() {
    const turi = document.getElementById("tovar-turi").value;
    const metr = document.getElementById("tovar-metri").value;
    const qalinlik = document.getElementById("tovar-qalinligi").value;
    const ism = document.getElementById("mijoz-ismi").value || "Noma'lum";
    const soni = parseFloat(document.getElementById("tovar-soni").value);
    const narxi = parseFloat(document.getElementById("tovar-narxi").value);
    const valyuta = document.getElementById("valyuta-turi").value;
    const tolov = document.getElementById("tolov-turi").value;

    if (!soni || !narxi) {
        alert("Ma'lumotlarni to'liq kiriting!");
        return;
    }

    let bittaDollarNarxi = valyuta === "UZS" ? narxi / joriyKurs : narxi;
    let jamiDollar = bittaDollarNarxi * soni;

    const yangiSotuv = {
        id: Date.now(), // O'chirish va tahrirlash uchun noyob ID
        sana: new Date().toISOString().split("T")[0], // YYYY-MM-DD formatida
        vaqt: new Date().toLocaleTimeString(),
        ism: ism,
        tovar: `${turi} | ${metr} | ${qalinlik}`,
        soni: soni,
        asilNarx:
            valyuta === "UZS"
                ? `${narxi.toLocaleString()} so'm`
                : `$${narxi.toFixed(2)}`,
        jamiUSD: jamiDollar,
        holati: tolov, // "Naqd" yoki "Nasiya"
    };

    tarixList.push(yangiSotuv);
    saqlashVaYangilash();

    // Tozalash
    document.getElementById("mijoz-ismi").value = "";
    document.getElementById("tovar-soni").value = "";
    document.getElementById("tovar-narxi").value = "";
    alert("Saqlandi!");
}

// 3. Hisoblarni qayta hisoblash (Savdo va Nasiya)
function hisoblarniYangilash() {
    umumiySavdoUSD = 0;
    umumiyNasiyaUSD = 0;

    tarixList.forEach((item) => {
        if (item.holati === "Naqd" || item.holati === "To'landi") {
            umumiySavdoUSD += item.jamiUSD;
        } else {
            umumiyNasiyaUSD += item.jamiUSD;
        }
    });

    document.getElementById("bugungi-savdo").innerText =
        umumiySavdoUSD.toFixed(2) + " $";
    document.getElementById("umumiy-nasiya").innerText =
        umumiyNasiyaUSD.toFixed(2) + " $";
}

// 4. Tarixni jadvalga chizish (Filter bilan)
function tarixniChizish() {
    const tbody = document.getElementById("tarix-jadvali");
    const qidiruvSanasi = document.getElementById("qidiruv-sanasi").value;
    tbody.innerHTML = "";

    let filterlanganList = tarixList;
    if (qidiruvSanasi) {
        filterlanganList = tarixList.filter(
            (item) => item.sana === qidiruvSanasi,
        );
    }

    [...filterlanganList].reverse().forEach((item) => {
        const tr = document.createElement("tr");
        const holatRangi =
            item.holati === "Nasiya" ? "color: red;" : "color: green;";

        tr.innerHTML = `
            <td>${item.sana} <br> <small>${item.vaqt}</small></td>
            <td><b>${item.ism}</b></td>
            <td>${item.tovar}</td>
            <td>${item.soni} ta</td>
            <td>${item.asilNarx}</td>
            <td><b>$${item.jamiUSD.toFixed(2)}</b></td>
            <td style="${holatRangi} font-weight: bold;">${item.holati}</td>
            <td>
                ${item.holati === "Nasiya" ? `<button onclick="tolandiQilish(${item.id})" style="background: #2ecc71; color: white; border: none; border-radius: 3px; cursor: pointer;">To'landi</button>` : ""}
                <button onclick="sotuvniOchirish(${item.id})" style="background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer; margin-left: 5px;">X</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 5. Nasiyani to'langan qilish
function tolandiQilish(id) {
    const index = tarixList.findIndex((item) => item.id === id);
    if (index !== -1) {
        tarixList[index].holati = "To'landi";
        saqlashVaYangilash();
    }
}

// 6. Sotuvni o'chirish
function sotuvniOchirish(id) {
    if (confirm("Ushbu savdoni o'chirishni xohlaysizmi?")) {
        tarixList = tarixList.filter((item) => item.id !== id);
        saqlashVaYangilash();
    }
}

// 7. Ma'lumotlarni saqlash
function saqlashVaYangilash() {
    localStorage.setItem("savdo_tarixi", JSON.stringify(tarixList));
    hisoblarniYangilash();
    tarixniChizish();
}

function tarixniTozalash() {
    document.getElementById("qidiruv-sanasi").value = "";
    tarixniChizish();
}

function oynaniUzgartirish(oyna) {
    if (oyna === "asosiy") {
        document.getElementById("asosiy-oyna").classList.remove("hidden");
        document.getElementById("tarix-oyna").classList.add("hidden");
    } else {
        document.getElementById("asosiy-oyna").classList.add("hidden");
        document.getElementById("tarix-oyna").classList.remove("hidden");
        tarixniChizish();
    }
}
