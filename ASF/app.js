let sales = JSON.parse(localStorage.getItem("dekorSales")) || [];

// Oynani almashtirish funksiyasi
function showPage(pageId) {
    const mainPage = document.getElementById("page-main");
    const historyPage = document.getElementById("page-history");
    const btnMain = document.getElementById("btn-main");
    const btnHistory = document.getElementById("btn-history");

    if (pageId === "main") {
        mainPage.style.display = "block";
        historyPage.style.display = "none";
        btnMain.classList.add("active-nav");
        btnHistory.classList.remove("active-nav");
    } else {
        mainPage.style.display = "none";
        historyPage.style.display = "block";
        btnMain.classList.remove("active-nav");
        btnHistory.classList.add("active-nav");
    }
    renderData();
}

function renderData(filteredData = null) {
    const salesBody = document.getElementById("sales-body");
    const today = new Date().toISOString().split("T")[0];
    salesBody.innerHTML = "";

    let tSales = 0,
        tProfit = 0,
        tItems = 0,
        tDebt = 0;

    // Statistika hisoblash (Faqat bugun uchun)
    sales.forEach((s) => {
        const itemProfit = s.sellPrice - s.buyPrice;
        if (s.date === today) {
            if (s.status === "paid") {
                tSales += s.sellPrice;
                tProfit += itemProfit;
            }
            tItems += parseFloat(s.quantity);
        }
        if (s.status === "debt") {
            tDebt += s.sellPrice;
        }
    });

    // Jadvalga chiqarish (Tarix oynasi uchun)
    const dataToDisplay = filteredData || [...sales].reverse();
    dataToDisplay.forEach((s, revIndex) => {
        const index = filteredData
            ? sales.indexOf(s)
            : sales.length - 1 - revIndex;
        const itemProfit = s.sellPrice - s.buyPrice;

        const row = `
            <tr>
                <td>${s.date}</td>
                <td>${s.customer}</td>
                <td>${s.product}</td>
                <td><b>${s.quantity}</b></td>
                <td>${s.sellPrice.toLocaleString()}</td>
                <td>${itemProfit.toLocaleString()}</td>
                <td style="color: ${s.status === "debt" ? "red" : "green"}">
                    ${s.status === "debt" ? "Nasiya" : "To'landi"}
                </td>
                <td>
                    ${s.status === "debt" ? `<button class="btn-paid" onclick="payDebt(${index})">Puli keldi</button>` : ""}
                    <button class="btn-del" onclick="deleteSale(${index})">🗑️</button>
                </td>
            </tr>
        `;
        salesBody.innerHTML += row;
    });

    // Ekranni yangilash
    document.getElementById("total-sales").innerText = tSales.toLocaleString();
    document.getElementById("total-profit").innerText =
        tProfit.toLocaleString();
    document.getElementById("total-items").innerText = tItems;
    document.getElementById("total-debt").innerText = tDebt.toLocaleString();
}

document.getElementById("sale-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const qty = parseFloat(document.getElementById("product-qty").value);
    const bPrice = parseFloat(document.getElementById("buy-price").value);
    const sPrice = parseFloat(document.getElementById("sell-price").value);

    const newSale = {
        customer: document.getElementById("customer-name").value,
        product: document.getElementById("product-type").value,
        quantity: qty,
        buyPrice: bPrice * qty,
        sellPrice: sPrice * qty,
        status: document.getElementById("payment-status").value,
        date: new Date().toISOString().split("T")[0],
    };

    sales.push(newSale);
    localStorage.setItem("dekorSales", JSON.stringify(sales));
    this.reset();
    alert("Sotuv saqlandi!");
    renderData();
});

function payDebt(index) {
    sales[index].status = "paid";
    localStorage.setItem("dekorSales", JSON.stringify(sales));
    renderData();
}

function deleteSale(index) {
    if (confirm("O'chirilsinmi?")) {
        sales.splice(index, 1);
        localStorage.setItem("dekorSales", JSON.stringify(sales));
        renderData();
    }
}

function filterByDate() {
    const date = document.getElementById("filter-date").value;
    if (date) {
        const filtered = sales.filter((s) => s.date === date);
        renderData(filtered.reverse());
    } else {
        renderData();
    }
}

// Boshlang'ich yuklash
renderData();

// 1. Markaziy Bank API orqali real kursni olish funksiyasi
async function getDollarRate() {
    try {
        const response = await fetch(
            "https://cbu.uz/uz/arkhiv-kursov-valyut/json/",
        );
        const data = await response.json();
        // Dollarning so'mdagi qiymatini topamiz (USD kodi: 840)
        const usdData = data.find((item) => item.Ccy === "USD");
        return parseFloat(usdData.Rate);
    } catch (error) {
        console.error("Kursni olishda xatolik:", error);
        return 12800; // API ishlamasa, oxirgi ma'lum bo'lgan kurs
    }
}

// 2. Narxni hisoblash funksiyasi
async function calculatePrice(amount, currency) {
    if (currency.toUpperCase() === "UZS") {
        return amount; // So'mda bo'lsa o'zini qaytaramiz
    }

    if (currency.toUpperCase() === "USD") {
        const currentRate = await getDollarRate();
        const totalInSum = amount * currentRate;
        return totalInSum;
    }
}

// --- ISHLATIB KO'RAMIZ ---
async function main() {
    const tovar1_narxi = 100; // 100 dollar
    const tovar2_narxi = 500000; // 500,000 so'm

    const natija1 = await calculatePrice(tovar1_narxi, "USD");
    const natija2 = await calculatePrice(tovar2_narxi, "UZS");

    console.log(
        `100 dollarlik tovar: ${natija1.toLocaleString()} so'm bo'ldi.`,
    );
    console.log(`So'mdagi tovar: ${natija2.toLocaleString()} so'm.`);
}

main();

const rate = await getDollarRate();
const hisobot = tovarlar.map((t) =>
    t.valyuta === "USD" ? t.narx * rate : t.narx,
);
