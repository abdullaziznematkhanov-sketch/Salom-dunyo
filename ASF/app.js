document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("sale-form");
    const salesBody = document.getElementById("sales-body");

    let sales = JSON.parse(localStorage.getItem("dekorSales")) || [];

    function updateStats() {
        let totalSales = 0,
            totalProfit = 0,
            totalDebt = 0;

        sales.forEach((s) => {
            if (s.status === "paid") {
                totalSales += s.sellPrice;
                totalProfit += s.sellPrice - s.buyPrice;
            } else {
                totalDebt += s.sellPrice;
            }
        });

        document.getElementById("total-sales").innerText =
            totalSales.toLocaleString();
        document.getElementById("total-profit").innerText =
            totalProfit.toLocaleString();
        document.getElementById("total-debt").innerText =
            totalDebt.toLocaleString();
        document.getElementById("sales-count").innerText = sales.length;
    }

    function renderTable() {
        salesBody.innerHTML = "";
        sales.forEach((s, index) => {
            const row = `
                <tr>
                    <td>${s.date} ${s.time}</td>
                    <td>${s.customer}</td>
                    <td>${s.product}</td>
                    <td>${s.sellPrice.toLocaleString()}</td>
                    <td>${(s.sellPrice - s.buyPrice).toLocaleString()}</td>
                    <td style="color: ${s.status === "debt" ? "red" : "green"}">${s.status === "debt" ? "Nasiya" : "To'landi"}</td>
                    <td><button class="btn-delete" onclick="deleteSale(${index})">O'chirish</button></td>
                </tr>
            `;
            salesBody.innerHTML += row;
        });
        updateStats();
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const now = new Date();

        const newSale = {
            customer: document.getElementById("customer-name").value,
            product: document.getElementById("product-type").value,
            buyPrice: parseFloat(document.getElementById("buy-price").value),
            sellPrice: parseFloat(document.getElementById("sell-price").value),
            status: document.getElementById("payment-status").value,
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString().slice(0, 5),
        };

        sales.push(newSale);
        localStorage.setItem("dekorSales", JSON.stringify(sales));
        renderTable();
        form.reset();
    });

    window.deleteSale = (index) => {
        sales.splice(index, 1);
        localStorage.setItem("dekorSales", JSON.stringify(sales));
        renderTable();
    };

    renderTable();
});
