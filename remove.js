const {Rembg} = require('rembg-node')
const sharp = require('sharp');
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

// const crawler = async (category, path, i)=>{
//     let url = `https://www.musinsa.com/search/musinsa/goods?q=${category}&list_kind=small&sortCode=pop&sub_sort=&page=${i}&display_cnt=0&saleGoods=false&includeSoldOut=false&setupGoods=false&popular=false&category1DepthCode=&category2DepthCodes=&category3DepthCodes=&selectedFilters=&category1DepthName=&category2DepthName=&brandIds=&price=&colorCodes=&contentType=&styleTypes=&includeKeywords=&excludeKeywords=&originalYn=N&tags=&campaignId=&serviceType=&eventType=&type=&season=&measure=&openFilterLayout=N&selectedOrderMeasure=&shoeSizeOption=&groupSale=false&d_cat_cd=&attribute=&plusDeliveryYn=`
//     axios({
//         url: url,
//         method: 'GET',
//         headers: {
//             'User-Agent':
//                 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
//         }
//     }).then((response)=>{
//         // console.log(response)
//         const $ = cheerio.load(response.data);
//         $('.lazyload').each((k,v)=>{
//             const rembg = new Rembg()
//             // if($(v).length === 0) return isover = true;
//             const img_url = $(v).data('original');
//             const uuid = uuidv4();
//             console.log(1);
//             axios.get(img_url, {
//                 responseType: 'arraybuffer'
//             }).then((imgResult)=>{
//                 // console.log(imgResult);
//                 const image = sharp(imgResult.data);
//                 rembg.remove(image).then((removed)=>{
//                     removed = removed.toFormat('jpg').resize(256,256, {fit:'contain'}).toFile(`${path}/${uuid}.jpg`, (err, info)=>{})
//                 });
//                 // fs.writeFileSync(`${path}/${uuid}.jpg`, imgResult.data);

//             })
    
//         })
//         return;
//     })
// }

const rembg = new Rembg()
for(const val in category)
{
    // console.log(val)
    let isover = false;
    // 경로 없으면 생성 
    fs.readdir('img_removed', (err)=>{
        if(err) {
            // console.log(`img_removed 폴더 생성`)
            fs.mkdir('img_removed', ()=>{
                fs.readdir('img_removed/' + val, (err)=>{
                    if(err) {
                        console.log(`${val} 폴더 생성`)
                        fs.mkdirSync('img_removed/' + val)
                    }
                })    
            })
        }
        else {
            fs.readdir('img_removed/' + val, (err)=>{
                if(err) {
                    console.log(`${val} 폴더 생성`)
                    fs.mkdirSync('img_removed/' + val)
                }
            })
        }
    });    
}
for (const val in category)
{
    let path = `img/${val}`
    fs.readdir(path, async (err, files)=>{
        for(const file of files)
        {
            const uuid = uuidv4();
            const image = sharp(`${path}/${file}`);
            const removed = await rembg.remove(image)
            removed.toFormat('png').resize(256,256, {fit:'fill'}).toFile(`img_removed/${val}/${uuid}.png`, (err, info)=>{})
        }
    })
}
