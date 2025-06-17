/* 

Hàm này cào data, có thể itemId sẽ thay đổi
Tìm itemId trong các thẻ li tương ứng với các năm trên web https://namdinh.edu.vn/tra-cuu/bang-diem
itemId hiện tại của 2025 là: 68510e8e951e2d9cf4011b34 (có thể bị thay đổi tùy ông admin)

*/

async function crawl_data(sbd) {
  url = `https://namdinh.edu.vn/?module=Content.Listing&moduleId=1014&cmd=redraw&site=19012&url_mode=rewrite&submitFormId=1014&moduleId=1014&page=&site=19012`;
  var formdata = new FormData();
  formdata.append("keyword", sbd);
  formdata.append("itemId", "68510e8e951e2d9cf4011b34");
  formdata.append("layout", "Decl.DataSet.Detail.default");
  formdata.append("service", "Content.Decl.DataSet.Grouping.select");

  var requestOptions = {
    method: "POST",
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
    throw new Error(`Fetch request failed: ${error.message}`);
  }
}

module.exports = { crawl_data };
