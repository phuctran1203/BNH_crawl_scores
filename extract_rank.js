const fs = require("fs").promises;

async function extractRanked(filePath) {
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
    }

    await fs.writeFile("rank.json", JSON.stringify(filtered, null, 2));
    console.log("✅ Đã lưu rank");
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
  }
}

extractRanked("data.json");
