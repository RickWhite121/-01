const jsonData = [];
let currentCityData = '';
let currentTownData = '';

const elemLoadingPage = document.querySelector('#LoadingPage');
const elemCountySelector = document.querySelector('#CountySelector');
const elemTownSelector = document.querySelector('#TownSelector');
const elemContent = document.querySelector('#Content');

const dataUrl = 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx';
const limitWordLen = 49;

const optionTemp = (item) => `<option value="${item}">${item}</option>`;
const contentTemp = (item) => `
      <section class="grid__item">
      ${item.Url === '' ? '' : `<a class="res__link" target="_blank" href="${item.Url}">`}
              <figure class="res">
                <img 
                  class="res__img" 
                  src="${item.PicURL}"
                  alt="${item.Name}" 
                  width="400" 
                  height="267">
                <p class="res__flag">${item.City}</p>
                <figcaption class="res__text">
                  <p class="res__desc res__desc--italic">${item.Town}</p>
                  <h2 class="res__title">${item.Name}</h2>
                  <p class="res__desc">${textLimit(item.FoodFeature)}</p>
                </figcaption>
              </figure>
              ${item.Url === '' ? '' : `</a>`}
            </section>`;

(async () => {
  setJsonData(await fetchData());
  elemCountySelector.innerHTML += strMaker(optionTemp, setCateData(jsonData, 'City'));
  elemContent.innerHTML += strMaker(contentTemp, setDataArray());
  setListener();
  elemLoadingPage.remove();
})();

function setListener() {
  elemCountySelector.addEventListener('change', selectCountyEvent);
  elemTownSelector.addEventListener('change', selectTownEvent);
};

async function fetchData() {
  try {
    const res = await fetch(dataUrl);
    return result = res.json();
  } catch (e) {
    console.log(e.message);
  };
};

function setJsonData(result) {
  result.forEach(item => {
    jsonData.push(item);
  });
};

function textLimit(str, limitStr = '') {
  if (str.length > limitWordLen) {
    limitStr = str.substring(0, limitWordLen - 1);
    return limitStr;
  };
  return str;
};

function setCateData(data, cate, arr = []) {
  arr = data.map(item => item[cate]);
  return [...new Set(arr)];
};

function strMaker(temp, data, str = '') {
  data.map((item, i) => {
    str += temp(item, i);
  });
  return str;
};

function setDataArray(arr = []) {
  if (currentCityData !== '' && currentTownData !== '') {
    arr = jsonData.filter(item =>
      item.City === currentCityData && item.Town === currentTownData);
  } else if (currentCityData !== '') {
    arr = jsonData.filter(item =>
      item.City === currentCityData);
  } else {
    arr = jsonData;
  };
  return arr;
};

function selectCountyEvent(e) {
  const self = e.target;
  currentCityData = self.value;
  currentTownData = '';
  const dataArray = setDataArray();
  elemTownSelector.innerHTML = `<option value="" disabled selected>請選擇鄉鎮區...</option>;`;
  elemTownSelector.innerHTML += strMaker(optionTemp, setCateData(dataArray, 'Town'));
  elemContent.innerHTML = strMaker(contentTemp, setDataArray());
};

function selectTownEvent(e) {
  const self = e.target;
  currentTownData = self.value;
  elemContent.innerHTML = strMaker(contentTemp, setDataArray());
};