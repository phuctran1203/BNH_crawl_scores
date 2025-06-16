const { JSDOM } = require("jsdom");
const { default: extractRanked } = require("./extract_rank");
const fs = require("fs").promises;

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
}

async function crawl_data(sbd) {
  url = `https://namdinh.edu.vn/?module=Content.Listing&moduleId=1014&cmd=redraw&site=19012&url_mode=rewrite&submitFormId=1014&moduleId=1014&page=&site=19012`;
  var formdata = new FormData();
  formdata.append("keyword", sbd);
  formdata.append("itemId", "684b8f42847791bccc064e44");
  formdata.append("layout", "Decl.DataSet.Detail.default");
  formdata.append("service", "Content.Decl.DataSet.Grouping.select");

  var requestOptions = {
    method: "POST",
    // headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };
  try {
    const res = await fetch(url, requestOptions);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status} ${res.statusText}`);
    }
    const data = await res.text();
    return data;
  } catch (error) {
    console.error("Fetch request failed:", error.message);
    return null;
  }
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const data_crawled = [];
  const start = 610001;
  const end = 610001 + 417 - 1;

  for (let i = start; i <= end; i++) {
    const sbd = i;
    console.log("Crawl for sbd: ", sbd);
    const htmlString = await crawl_data(sbd);
    if (!htmlString) {
      console.log("sbd khong co data");
      continue;
    }
    extracted = extractTableDataBySBD(htmlString);
    data_crawled.push(extracted);

    await delay(10);
  }

  //   lưu lại
  try {
    await fs.writeFile(`data.json`, JSON.stringify(data_crawled, null, 2));
    console.log("Đã lưu dữ liệu vào data.json");
  } catch (error) {
    console.error("Lỗi khi lưu file JSON:", error.message);
  }
}

main();
