
//先給每個縣市加上tag分類 ＝>生成卡片時加上地區分類 ＝> 按按鈕依地區篩選
const regionAll = [
    { city: '基隆市', regionTag: '北部' },
    { city: '新北市', regionTag: '北部' },
    { city: '臺北市', regionTag: '北部' },
    { city: '桃園市', regionTag: '北部' },
    { city: '新竹市', regionTag: '北部' },
    { city: '新竹縣', regionTag: '北部' },
    { city: '苗栗縣', regionTag: '北部' },
    { city: '臺中市', regionTag: '中部' },
    { city: '南投縣', regionTag: '中部' },
    { city: '彰化縣', regionTag: '中部' },
    { city: '雲林縣', regionTag: '中部' },
    { city: '嘉義市', regionTag: '中部' },
    { city: '嘉義縣', regionTag: '中部' },
    { city: '臺南市', regionTag: '南部' },
    { city: '高雄市', regionTag: '南部' },
    { city: '屏東縣', regionTag: '南部' },
    { city: '宜蘭縣', regionTag: '東部' },
    { city: '花蓮縣', regionTag: '東部' },
    { city: '臺東縣', regionTag: '東部' },
    { city: '澎湖縣', regionTag: '離島' },
    { city: '金門縣', regionTag: '離島' },
    { city: '連江縣', regionTag: '離島' },
];

const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-E50DD1D6-F725-4068-A8B1-B1B777AE7DE7';
const btnAll = document.querySelectorAll('.btn');//利用forEach加addListener
const cardRegion = document.querySelector('.card-region');

let originalData; //存放拿到的資料
let orgData = {}; //整理後的資料
// let region = regionAll[0];
let content = '';

//取得資料
fetchData();

//=================================
function fetchData() {
    //從url取得資料
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            originalData = data;
            //處理資料
            organizationData();
            arrangeCities();
        })
}

function organizationData() {
    const locationAll = originalData.records.location;
    locationAll.forEach(location => {
        const locationName = location.locationName;
        const wEl0T0 = location.weatherElement[0].time[0];
        let startTime = wEl0T0.startTime;
        let endTime = wEl0T0.endTime;
        //天氣現象
        let Wx = wEl0T0.parameter.parameterName;
        //晴陰雨的圖
        let wxImgCode = wEl0T0.parameter.parameterValue;
        if (Number(wxImgCode) < 10) {
            wxImgCode = `0${wxImgCode}`;
        }
        //最高溫
        let maxT = location.weatherElement[4].time[0].parameter.parameterName;
        //最低溫
        let minT = location.weatherElement[2].time[0].parameter.parameterName;
        //CI:舒適度
        let CI = location.weatherElement[3].time[0].parameter.parameterName;
        //PoP:降雨機率
        let PoP = location.weatherElement[1].time[0].parameter.parameterName;

        //做完一個縣市資料，要放入組織後的資料物件(orgData)
        //key:縣市
        // orgData['台中市'] = { };
        //新增一個key為 locationName的字串 的 物件 到 orgData 
        orgData[locationName] = {
            'Wx': Wx,
            'WxCode': wxImgCode,
            'startTime': startTime,
            'maxT': maxT,
            'minT': minT,
            'CI': CI,
            'PoP': PoP,
        };
        console.log(orgData);
    })
}

function arrangeCities() {
    content = '';
    regionAll.forEach(item => {
        const city = item.city;
        const cityData = orgData[city];
        const regionTag = item.regionTag
        showCard(city, cityData, regionTag);//產生卡片
    });
    //顯示
    cardRegion.innerHTML = content;
}

function showCard(city, cityData, regionTag) {
    const weatherClass = getWeatherClass(cityData.Wx);
    content +=
        `
    <div class="card ${weatherClass}" data-region="${regionTag}">
        <p class="temperature">${cityData.maxT}ºC/${cityData.minT}ºC</p>
        <p class="startTime">${cityData.startTime.replaceAll('-', '/')}</p>
        <div class="decorative-line"></div>
        <div class="card-detail">
            <h1>${city}</h1>
            <p class="Wx">${cityData.Wx}</p>
            <p class="CI">${cityData.CI}</p>
            <p class="PoP"> ☂ ${cityData.PoP}%</p>
            <span class="icon">
                <img src="https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/${cityData.WxCode}.svg" alt="${cityData.Wx}" title="${cityData.Wx}">
            </span>
        </div>
    </div>
    `
}

//依不同天氣放不同背景 ＝> 檢查每個卡片的天氣
function getWeatherClass(Wx) {
    if (Wx.includes('雷雨')) return 'thunderstorm';
    if (Wx.includes('雨')) return 'rainy';
    if (Wx.includes('陰')) return 'overcast';
    if (Wx.includes('晴時多雲')) return 'sunny-cloudy';
    if (Wx.includes('晴')) return 'sunny';
    if (Wx.includes('多雲')) return 'cloudy';
}

//依地區篩選卡片
//按鈕地區（北中南...）＝> selectedRegion
//卡片地區 ＝> regionOfCard
//當卡片地區===按鈕地區 ＝> 顯示，反之隱藏
btnAll.forEach(btn => {
    btn.addEventListener('click', () => {
        const selectedRegion = btn.dataset.region;
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            const regionOfCard = card.dataset.region;
            if (selectedRegion === '全部' || regionOfCard === selectedRegion) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        })
    })
})