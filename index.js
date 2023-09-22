const axios = require('axios');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { v4 : uuidv4} = require('uuid');
const fs = require('fs');

/**
 * category
 * 폴더명 : 검색명
 */
const category = {
    trench_coat : '트렌치코트',
    coat : '코트',
    jacket : '자켓',
    dress : '원피스',
    blouse : '블라우스',
    shirt : '남방',
    pants : '바지',
    skirt : '치마',
    jump_suite : '점프수트',
    jumper : '점퍼'
}

const crawler = async (category, path, i)=>{
    let url = `https://www.musinsa.com/search/musinsa/goods?q=${category}&list_kind=small&sortCode=pop&sub_sort=&page=${i}&display_cnt=0&saleGoods=false&includeSoldOut=false&setupGoods=false&popular=false&category1DepthCode=&category2DepthCodes=&category3DepthCodes=&selectedFilters=&category1DepthName=&category2DepthName=&brandIds=&price=&colorCodes=&contentType=&styleTypes=&includeKeywords=&excludeKeywords=&originalYn=N&tags=&campaignId=&serviceType=&eventType=&type=&season=&measure=&openFilterLayout=N&selectedOrderMeasure=&shoeSizeOption=&groupSale=false&d_cat_cd=&attribute=&plusDeliveryYn=`
    const response = await axios({
        url: url,
        method: 'GET',
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
        }
    })
    // console.log(response)
    const $ = cheerio.load(response.data);
    $('.lazyload').each(async (k,v)=>{
        // if($(v).length === 0) return isover = true;
        const img_url = $(v).data('original');
        const uuid = uuidv4();
        const imgResult = await axios.get(img_url, {
            responseType: 'arraybuffer'
        });
        // console.log(imgResult);
        fs.writeFileSync(`${path}/${uuid}.jpg`, imgResult.data);
    })
    return;
}

for(const val in category)
{
    // console.log(val)
    let isover = false;
    // 경로 없으면 생성 
    fs.readdir('img', (err)=>{
        if(err) {
            console.log(`img 폴더 생성`)
            fs.mkdirSync('img').then((result) => {
                fs.readdir('img/' + val, (err)=>{
                    if(err) {
                        console.log(`${val} 폴더 생성`)
                        fs.mkdirSync('img/' + val)
                    }
                })    
            })
        }
        else {
            fs.readdir('img/' + val, (err)=>{
                if(err) {
                    console.log(`${val} 폴더 생성`)
                    fs.mkdirSync('img/' + val)
                }
            })
        }
    });    
}
for (const val in category)
{
    let i = 1
    setInterval(async ()=>{await crawler(category[val], `img/${val}`, i++)}, 5000)
}




/**
 * 
 * 256*256
 * model
 * function some_model($a,$b,$c ..... $256256 )
 * {
 *  return 1.1*$a + 1.1*$b + 2*$c  0.000001*$256256 + 1.23324;
 * }
 * 
 * 
 * 
 * 
 * 
 */


// for (let i = 0 ; ; i++)
// {
//     crawler(category[val], i)  
//     if(isover) continue;
// }