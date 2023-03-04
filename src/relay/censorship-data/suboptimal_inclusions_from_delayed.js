const fs = require("fs");
const ndjson = require("ndjson");

const transactions = [];

fs.createReadStream("./src/relay/censorship-data/delayed_30d.ndjson")
  .pipe(ndjson.parse())
  .on("data", function (obj) {
    if (obj.reason === "lowbasefee") return;
    if (obj.reason === "congested") return;
    if (obj.reason === "unknown" && Math.random() > 0.05) return;
    if (obj.reason === "lowtip") return;
    transactions.push(obj);
  })
  .on("end", () => {
    // Sort transactions in ascending order.
    transactions.sort(
      (a, b) => new Date(a.mined).getTime() - new Date(b.mined).getTime(),
    );
    const day7Transactions = transactions.filter(
      (tx) => tx.block_number >= 16699807,
    );
    fs.writeFileSync(
      "./src/relay/censorship-data/suboptimal_inclusions_7d.json",
      JSON.stringify(day7Transactions, null, 2),
    );
    fs.writeFileSync(
      "./src/relay/censorship-data/suboptimal_inclusions_30d.json",
      JSON.stringify(transactions, null, 2),
    );
  });
