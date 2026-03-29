let sales = JSON.parse(localStorage.getItem("dekorSales")) || [];

// Oynalar o'rtasida almashish
function showPage(pageId) {
    document.getElementById("page-main").style.display =
        pageId === "main" ? "block" : "none";
    document.getElementById("page-history").style.display =
        pageId === "history" ? "block" : "none";

    document
        .getElementById("link-main")
        .classList.toggle("active", pageId === "main");
    document
        .getElementById("link-history")
        .classList.toggle("active", pageId === "history");

    renderData();
}

function renderData(dataToRender = sales) {
    const tbody = document.getElementById("sales-body");
    tbody.innerHTML = "";

    let tSales = 0,
        tProfit = 0,
        tDebt = 0;
    const today = new Date().toISOString().split("T")[0];

    dataToRender.forEach((item, index) => {
        const itemProfit = item.sellPrice - item.buyPrice;

        // Bugungi statistika uchun
        if (item.date === today) {
            if (item.status === "paid") {
                tSales += item.sellPrice;
                tProfit += itemProfit;
            }
        }
        // Umumiy nasiya (hamma vaqtdagi)
        if (item.status === "debt") {
            tDebt += item.sellPrice;
        }

        const row = `<tr>
            <td>${item.date}</td>
            <td>${item.customer}</td>
            <td>${item.product}</td>
            <td>${item.sellPrice.toLocaleString()}</td>
            <td>${itemProfit.toLocaleString()}</td>
            <td style="color: ${item.status === "debt" ? "red" : "green"}">${item.status === "debt" ? "Nasiya" : "To'landi"}</td>
            <td>
                ${item.status === "debt" ? `<button class="btn-pay" onclick="makePaid(${index})">Puli keldi</button>` : ""}
                <button class="btn-del" onclick="deleteSale(${index})">O'chirish</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });

    document.getElementById("total-sales").innerText = tSales.toLocaleString();
    document.getElementById("total-profit").innerText =
        tProfit.toLocaleString();
    document.getElementById("total-debt").innerText = tDebt.toLocaleString();
}

document.getElementById("sale-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const newSale = {
        customer: document.getElementById("customer-name").value,
        product: document.getElementById("product-type").value,
        buyPrice: parseFloat(document.getElementById("buy-price").value),
        sellPrice: parseFloat(document.getElementById("sell-price").value),
        status: document.getElementById("payment-status").value,
        date: new Date().toISOString().split("T")[0],
    };

    sales.push(newSale);
    localStorage.setItem("dekorSales", JSON.stringify(sales));
    this.reset();
    alert("Sotuv saqlandi!");
    renderData();
});

function makePaid(index) {
    sales[index].status = "paid";
    localStorage.setItem("dekorSales", JSON.stringify(sales));
    renderData();
}

function deleteSale(index) {
    if (confirm("Ushbu ma'lumotni o'chirasizmi?")) {
        sales.splice(index, 1);
        localStorage.setItem("dekorSales", JSON.stringify(sales));
        renderData();
    }
}

function filterByDate() {
    const date = document.getElementById("filter-date").value;
    if (!date) return;
    const filtered = sales.filter((s) => s.date === date);
    renderData(filtered);
}

function resetFilter() {
    document.getElementById("filter-date").value = "";
    renderData(sales);
}

// Birinchi marta yuklanganda
renderData();
