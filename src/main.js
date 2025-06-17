const fs = require("fs").promises;
const { crawl_data } = require("./craw_data");
const { extractTableDataBySBD, delay } = require("./utils/util");

async function main(start, amount) {
  const data_crawled = [];
  let end = 610001 + amount - 1;

  for (let i = start; i <= end; i++) {
    const sbd = i;
    console.log("Crawl for SDB: ", sbd);
    let htmlString;

    try {
      htmlString = await crawl_data(sbd);
    } catch (error) {
      console.error(`Cào data lỗi trong hàm crawl_data: ${error.message}`);
      break;
    }

    extracted = extractTableDataBySBD(htmlString);
    // Nếu không phân tích được html, hãy log htmlString ra kiểm tra
    if (!extracted) {
      console.log(`SBD: ${sbd} không lấy được thông tin điểm. Bỏ qua`);
      await delay(5);
      continue;
    }

    data_crawled.push(extracted);
    // thêm delay tránh server bị dí xịt khói, chẳng may bị ban IP =]]
    await delay(5);
  }

  //   lưu lại
  const savePath = "src/data/data.json";
  try {
    await fs.writeFile(savePath, JSON.stringify(data_crawled, null, 2));
    console.log(`Đã lưu vào ${savePath}`);
  } catch (error) {
    console.error("Lỗi khi lưu file JSON:", error.message);
  }
}

// Sửa params theo yêu cầu
main(610001, 417);
