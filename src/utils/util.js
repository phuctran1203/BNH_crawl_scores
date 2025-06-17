const { JSDOM } = require("jsdom");

function extractTableDataBySBD(htmlString) {
  const dom = new JSDOM(htmlString);
  const doc = dom.window.document;

  const tbody = doc.querySelector("table.table-bordered.table-hover tbody");
  if (!tbody) {
    throw new Error("Table body not found in the HTML");
  }

  const row = tbody.querySelector("tr");
  if (!row) {
    throw new Error("No rows found in the table");
  }

  // Hàm tiện ích để parse số hoặc trả về null nếu chuỗi rỗng
  const parseOrNull = (value) => {
    const trimmed = value.trim().replace(",", ".");
    return trimmed === "" ? null : parseFloat(trimmed);
  };
  try {
    const data = {
      SBD: row.cells[0].textContent.trim() || null,
      Điểm_ƯT: row.cells[1].textContent.trim() || null,
      Điểm_KK: row.cells[2].textContent.trim() || null,
      Ngữ_văn: parseOrNull(row.cells[3].textContent),
      Toán: parseOrNull(row.cells[4].textContent),
      Ngoại_ngữ: parseOrNull(row.cells[5].textContent),
      Chuyên: row.cells[6].textContent.trim() || null,
      Tổng_không_chuyên: parseOrNull(row.cells[7].textContent),
      Tổng_chuyên: row.cells[8].textContent.trim() || null,
    };
    return data;
  } catch (error) {
    console.error("Không tìm được data tương ứng từ html");
    return null;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { extractTableDataBySBD, delay };
