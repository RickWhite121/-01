const jsonData = [];
let countyData = [];
let townData = [];

const elemLoadingPage = document.querySelector('#LoadingPage');
const elemCountySelector = document.querySelector('#CountySelector');
const elemTownSelector = document.querySelector('#TownSelector');
const elemContent = document.querySelector('#Content');

const dataUrl = 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx';

const optionTemp = (item) => `<option value="${item}">${item}</option>`;
const contentTemp = (item) => `
      <section class="grid__item">
              <figure class="res">
                <img 
                  class="res__img" 
                  src="${item.PicURL}"
                  alt="${getAlt(item.PicURL)}" 
                  width="400" 
                  height="267">
                <p class="res__flag">${item.City}</p>
                <figcaption class="res__text">
                  <p class="res__desc res__desc--italic">${item.Town}</p>
                  <h2 class="res__title">${item.Name}</h2>
                  <hr>
                  <p class="res__desc">${item.FoodFeature}</p>
                </figcaption>
              </figure>
            </section>`;

(async () => {
  const result = await fetchData();
  setJsonData(result);
  elemCountySelector.innerHTML += strMaker(optionTemp, setCateData(jsonData, 'City'))
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

function setJsonData(result) {
  result.forEach((item) => {
    jsonData.push(item);
  });
};

function getAlt(img) {
  return img.substring(img.lastIndexOf('/') + 1, img.lastIndexOf('.'));
};

function setCateData(data, mode, arr = []) {
  switch (mode) {
    case 'City':
      data.map((item) => {
        arr.push(item.City);
      });
      return arrayFilter(arr);
    case 'Town':
      data.map((item) => {
        arr.push(item.Town);
      });
      return arrayFilter(arr);
    default:
      break;
  };
};

function arrayFilter(data, filterArr = []) {
  return filterArr = [...new Set(data)];
};

function strMaker(temp, data, str = '') {
  data.map((item, i) => {
    str += temp(item, i);
  });
  return str;
};

function setArray(iniArray, showArray, selectValue, mode) {
  switch (mode) {
    case 'City':
      iniArray.map(item => {
        if (selectValue === item.City) {
          showArray.push(item)
        } else if (selectValue === '') {
          showArray = iniArray;
        };
      });
      break;
    case 'Town':
      iniArray.map(item => {
        if (selectValue === item.Town) {
          showArray.push(item)
        } else if (selectValue === '') {
          showArray = iniArray;
        };
      });
      break;
    default:
      break;
  };
};

function selectCountyEvent(e) {
  const self = e.target;
  const selectValue = self.value;
  countyData = [];
  setArray(jsonData, countyData, selectValue, 'City');
  elemTownSelector.innerHTML = `<option value="" disabled selected>請選擇鄉鎮區...</option>;`;
  elemTownSelector.innerHTML += strMaker(optionTemp, setCateData(countyData, 'Town'));
  elemContent.innerHTML = strMaker(contentTemp, countyData);
};

function selectTownEvent(e) {
  const self = e.target;
  const selectValue = self.value;
  townData = [];
  setArray(countyData, townData, selectValue, 'Town');
  elemContent.innerHTML = strMaker(contentTemp, townData);
};