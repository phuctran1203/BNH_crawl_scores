const fs = require("fs").promises;

async function extractTop10Ranked(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    // Lọc các học sinh có điểm hợp lệ
    const filtered = data.filter(
      (item) => typeof item.Tổng_không_chuyên === "number"
    );

    // Sắp xếp giảm dần theo điểm
    filtered.sort((a, b) => b.Tổng_không_chuyên - a.Tổng_không_chuyên);

    // Gán hạng có xét trùng điểm
    let currentRank = 0;
    let lastScore = null;

    for (let i = 0; i < filtered.length; i++) {
      const score = filtered[i].Tổng_không_chuyên;

      if (score !== lastScore) {
        currentRank += 1;
        lastScore = score;
      }

      filtered[i].rank = currentRank;

      if (currentRank > 10) {
        break;
      }
    }

    // Lấy ra top có rank <= 10
    const top10 = filtered.filter((item) => item.rank <= 10);

    await fs.writeFile("top10.json", JSON.stringify(top10, null, 2));
    console.log("✅ Đã lưu top 10 học sinh có xếp hạng đúng vào top10.json");
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
  }
}

extractTop10Ranked("data.json");
