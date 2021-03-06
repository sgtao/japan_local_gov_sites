'use strict';

var prefectures;
{
  const open = document.querySelector('#open');
  const mask = document.querySelector('#mask');
  const modal = document.querySelector('#modal');
  const close = document.querySelector('#close');
  // const siteSelect  = document.querySelector('#siteSelect');
  var acc_site = "wiki";
  var modal_msg_wiki = modal.querySelector('p').textContent;
  var modal_init_msg = modal_msg_wiki;
  //
  // clickイベントの設定
  open.addEventListener('click', () => {
    // console.log('open clicked');
    const modal_text = document.querySelector('#modal > p');
    modal_text.textContent = modal_init_msg;
    // Google検索のときは追加キーワードも表示する
    let add_keyword = get_add_keyword();
    console.log('add keyword : ' + add_keyword);
    if (add_keyword !== "") {
      if (acc_site === "google") {
        modal_text.textContent += "（検索ワード：「市区町村名」" + add_keyword + "）"
      } else if (acc_site === "site_google") {
        modal_text.textContent += "（検索ワード：「市区町村名」URL" + add_keyword + "）"
      }
    }
    modal.classList.remove('hidden');
    mask.classList.remove('hidden');
  });
  close.addEventListener('click', () => {
    // console.log('close clicked');
    modal.classList.add('hidden');
    mask.classList.add('hidden');
  });
  mask.addEventListener('click', () => {
    // console.log('mask clicked');
    // modal.classList.add('hidden');
    // mask.classList.add('hidden');
    // ↓　2度書きを避けるため、close要素のclickメソッドを読み出す
    close.click();
  });
  // 
  // fetch prefecture json
  async function load_prefectures(path) {
    const response = await fetch(path);
    // var prefectures = await response.json();
    prefectures = await response.json();
    await console.dir(prefectures);
  }
  load_prefectures('assets/00_prefecture.json');
}
// google検索のワード追加
function get_add_keyword() {
  let add_keyword = "";
  let google_keyword = document.querySelector("#googleKeyword").value;
  if (google_keyword !== '') {
    let keyword_lists = google_keyword.split(/,|\s/);
    keyword_lists.forEach(keyword => {
      add_keyword += "+" + keyword;
    });
  }
  return add_keyword;
}

// show modal window and replace text
async function click_prefectures(data) {
  // console.log('show info. of ', data);
  const modal_text = document.querySelector('#modal > p');
  let add_keyword = get_add_keyword();
  let link_url;
  // set link_url of target prefecture
  // console.log(prefectures.result[data.code - 1]);
  let prefecture = prefectures.result[data.code - 1];
  switch (acc_site) {
    case "local_govs": {
      link_url = prefecture.cityURL;
      break;
    }
    case "site_google": {
      link_url = "https://www.google.com/search?q=" + "site::" + prefecture.cityURL + add_keyword;
      break;
    }
    case "google": {
      link_url = "https://www.google.com/search?q=" + data.name + add_keyword;
      break;
    }
    default: { // wiki
      link_url = "https://ja.wikipedia.org/wiki/" + data.name;
      break;
    }
  }
  // google検索時のワード表示
  let append_msg_google = "";
  if (acc_site === "google") {
    append_msg_google = "（検索ワード：「市区町村名」" +
      ((add_keyword !== "") ? (add_keyword + "）") : ("）"));
  } else if (acc_site === "site_google") {
    append_msg_google = "（検索ワード：「市区町村名」URL" + ((add_keyword !== "") ? (add_keyword + "）") : ("）"));
  }
  modal_text.innerHTML = modal_init_msg + '<p><a href="' + link_url + '" target="_blank">'
    + data.name + '</a>：' + append_msg_google + '</p>';
  // console.log('to ', modal_text.textContent);
  // fetch json file
  let json_file = get_json_name(data.code);
  const res = await fetch('assets/' + json_file);
  const json = await res.json();
  console.log(json);
  await append_modal_text(json);

  // modal-openを実行する
  modal.classList.remove('hidden');
  mask.classList.remove('hidden');
  async function append_modal_text(data) {
    let append_html = "(リンク数＝" + data.result.length + ')：'
    // google検索のワード追加
    await data.result.forEach(item => {
      append_html += make_link_url(acc_site, item.cityName, item.cityURL, item.wikiName, add_keyword);
    });
    modal_text.innerHTML += append_html;
  }
}
function make_link_url(acc_site, city_name, city_url, wiki_name, add_keyword) {
  let link_url = "";
  switch (acc_site) {
    case "local_govs": {
      link_url = city_url;
      break;
    }
    case "google": {
      link_url = "https://www.google.com/search?q=" + city_name + add_keyword;
      break;
    }
    case "site_google": {
      link_url = "https://www.google.com/search?q=" + "site::" + city_url + add_keyword;
      break;
    }
    default: { // wiki
      if (typeof wiki_name === 'undefined') {
        link_url = "https://ja.wikipedia.org/wiki/" + city_name;
      } else {
        link_url = "https://ja.wikipedia.org/wiki/" + wiki_name;
      }
      break;
    }
  }
  return '<a href="' + link_url + '" target="_blank">' + city_name + '</a>' + '、';
}
// get json filename
function get_json_name(data_code) {
  let json_file;
  switch (data_code) {
    case 1: json_file = '01_HOKKAIDO.json'; break;
    case 2: json_file = '02_AOMORI.json'; break;
    case 3: json_file = '03_IWATE.json'; break;
    case 4: json_file = '04_MIYAGI.json'; break;
    case 5: json_file = '05_AKITA.json'; break;
    case 6: json_file = '06_YAMAGATA.json'; break;
    case 7: json_file = '07_FUKUSHIMA.json'; break;
    case 8: json_file = '08_IBARAKI.json'; break;
    case 9: json_file = '09_TOCHIGI.json'; break;
    case 10: json_file = '10_GUNMA.json'; break;
    case 11: json_file = '11_SAITAMA.json'; break;
    case 12: json_file = '12_CHIBA.json'; break;
    case 13: json_file = '13_TOKYO.json'; break;
    case 14: json_file = '14_KANAGAWA.json'; break;
    case 15: json_file = '15_NIIGATA.json'; break;
    case 16: json_file = '16_TOYAMA.json'; break;
    case 17: json_file = '17_ISHIKAWA.json'; break;
    case 18: json_file = '18_FUKUI.json'; break;
    case 19: json_file = '19_YAMANASHI.json'; break;
    case 20: json_file = '20_NAGANO.json'; break;
    case 21: json_file = '21_GIFU.json'; break;
    case 22: json_file = '22_SHIZUOKA.json'; break;
    case 23: json_file = '23_AICHI.json'; break;
    case 24: json_file = '24_MIE.json'; break;
    case 25: json_file = '25_SHIGA.json'; break;
    case 26: json_file = '26_KYOTO.json'; break;
    case 27: json_file = '27_OSAKA.json'; break;
    case 28: json_file = '28_HYOGO.json'; break;
    case 29: json_file = '29_NARA.json'; break;
    case 30: json_file = '30_WAKAYAMA.json'; break;
    case 31: json_file = '31_TOTTORI.json'; break;
    case 32: json_file = '32_SHIMANE.json'; break;
    case 33: json_file = '33_OKAYAMA.json'; break;
    case 34: json_file = '34_HIROSHIMA.json'; break;
    case 35: json_file = '35_YAMAGUCHI.json'; break;
    case 36: json_file = '36_TOKUSHIMA.json'; break;
    case 37: json_file = '37_KAGAWA.json'; break;
    case 38: json_file = '38_EHIME.json'; break;
    case 39: json_file = '39_KOCHI.json'; break;
    case 40: json_file = '40_FUKUOKA.json'; break;
    case 41: json_file = '41_SAGA.json'; break;
    case 42: json_file = '42_NAGASAKI.json'; break;
    case 43: json_file = '43_KUMAMOTO.json'; break;
    case 44: json_file = '44_OITA.json'; break;
    case 45: json_file = '45_MIYAZAKI.json'; break;
    case 46: json_file = '46_KAGOSHIMA.json'; break;
    case 47: json_file = '47_OKINAWA.json'; break;
    default: json_file = '01_HOKKAIDO.json';
  }
  return json_file;
}
// append modal window with searched cities
async function search_city_name(city_name) {
  const modal_text = document.querySelector('#modal > p');
  let add_keyword = get_add_keyword();
  let search_word = "<p>検索ワード：" + city_name + add_keyword + "</p>";
  let append_links;
  // modal-openを実行する
  modal.classList.remove('hidden');
  mask.classList.remove('hidden');
  append_links = "";
  let results;
  if (city_name !== "") {
    for (let code = 1; code <= 47; code++) {
      let json_file = get_json_name(code);
      const res = await fetch('assets/' + json_file);
      const json = await res.json();
      // console.log(json);
      // results = json.result;
      results = json.result.filter(check_CityName);
      if (results.length > 0) {
        console.log(json_file, results);
        let append_html = "<p>in " + json_file + "(リンク数＝" + results.length + ')：'
        results.forEach(item => {
          append_html += make_link_url(acc_site, item.cityName, item.cityURL, item.wikiName, add_keyword);
        });
        append_html += "</p>";
        append_links += append_html;
      }
      // append child elements to modal text
      modal_text.innerHTML = modal_init_msg + search_word;
      modal_text.innerHTML += "<p>searching ... </p>";
      modal_text.innerHTML += append_links;
    }
  } else {
    append_links = "<p>市区町村名を入力してください。</p>"
  }
  // append child elements to modal text
  modal_text.innerHTML = modal_init_msg + search_word;
  modal_text.innerHTML += append_links;
  function check_CityName(item) {
    let cityName = item.cityName;
    // console.log(cityName);
    return (cityName.match(city_name));
  }
}
// EOF
