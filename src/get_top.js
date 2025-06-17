const fs = require("fs").promises;

async function extractTop10Ranked() {
  // filePath: đường đẫn đến file json chứa data đã cào ở main.js
  const filePath = "src/data/data.json";
  let fileContent;

  try {
    fileContent = await fs.readFile(filePath, "utf-8");
  } catch (error) {
    console.error(`Lỗi đọc file: ${error.message}`);
    return;
  }

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
  const targetRank = 10;

  for (let i = 0; i < filtered.length; i++) {
    const score = filtered[i].Tổng_không_chuyên;

    if (score !== lastScore) {
      currentRank += 1;
      lastScore = score;
    }

    filtered[i].rank = currentRank;

    if (currentRank > targetRank) {
      break;
    }
  }

  // Lấy ra top có rank <= 10
  const top10 = filtered.filter((item) => item.rank <= 10);

  //  lưu lại
  const fileName = "src/data/top10.json";
  try {
    await fs.writeFile(fileName, JSON.stringify(top10, null, 2));
    console.log(`Đã lưu vào ${fileName}`);
  } catch (error) {
    console.error("Lỗi khi lưu file JSON:", error.message);
  }
}

extractTop10Ranked();
