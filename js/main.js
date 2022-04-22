let jsonData = [];
let countyData = [];
let townData = [];

const elemLoadingPage = document.querySelector('#LoadingPage');
const elemCountySelector = document.querySelector('#CountySelector');
const elemTownSelector = document.querySelector('#TownSelector');
const elemContent = document.querySelector('#Content');

const dataUrl = 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx';
const limitWordLen = 49;

const optionTemp = (item) => `<option value="${item}">${item}</option>`;
const contentTemp = (item) => `
      <section class="grid__item">
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
                  <hr>
                  <p class="res__desc">${textLimit(item.FoodFeature)}</p>
                </figcaption>
              </figure>
            </section>`;

(async () => {
  jsonData = await fetchData();
  elemCountySelector.innerHTML += strMaker(optionTemp, uniData(jsonData, 'City'))
  elemContent.innerHTML += strMaker(contentTemp, jsonData);
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

function textLimit(str, limitStr = '') {
  if (str.length > limitWordLen) {
    limitStr = str.substring(0, limitWordLen - 1);
    return limitStr;
  };
  return str;
};

function uniData(data, mode, arr = []) {
  data.map(item => {
    if (mode === 'City') {
      arr.push(item.City);
    } else if (mode === 'Town') {
      arr.push(item.Town);
    };
  });
  return [...new Set(arr)];
};

function strMaker(temp, data, str = '') {
  data.map((item, i) => {
    str += temp(item, i);
  });
  return str;
};

function setDataArray(iniArray, showArray, selectValue, mode) {
  iniArray.map(item => {
    if (mode === 'City') {
      if (selectValue === item.City) {
        showArray.push(item);
      };
    } else if (mode === 'Town') {
      if (selectValue === item.Town) {
        showArray.push(item);
      };
    };
  });
};

function selectCountyEvent(e) {
  const self = e.target;
  const selectValue = self.value;
  countyData = [];
  setDataArray(jsonData, countyData, selectValue, 'City');
  elemTownSelector.innerHTML = `<option value="" disabled selected>請選擇鄉鎮區...</option>;`;
  elemTownSelector.innerHTML += strMaker(optionTemp, uniData(countyData, 'Town'));
  elemContent.innerHTML = strMaker(contentTemp, countyData);
};

function selectTownEvent(e) {
  const self = e.target;
  const selectValue = self.value;
  townData = [];
  setDataArray(countyData, townData, selectValue, 'Town');
  elemContent.innerHTML = strMaker(contentTemp, townData);
};