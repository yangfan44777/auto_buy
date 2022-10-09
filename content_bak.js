const SKU_SELECTOR = '#J_isku dl';
const LOOP_SPEED = 100;
const KWS = [{
    label: /机.*色/,
    value: /紫/
}, /128G/];

class Platform {

    isDetailPage() {
        throw new Error('method not implement');
    }

    isSubmitPage() {
        throw new Error('method not implement');
    }

    travelAllSpecs(callback) {
        throw new Error('method not implement');
    }

    selectSpec(label, validSpecs, kw) {
        throw new Error('method not implement');
    }

    selectSpecByIndex(index) {
        throw new Error('method not implement');
    }

    isReady() {
        throw new Error('method not implement');
    }

    getValidSpecs() {
        throw new Error('method not implement');
    }

    getSpecLabel() {
        throw new Error('method not implement');
    }

    clearAllSpecs() {
        throw new Error('method not implement');
    }

    clickBuy() {
        throw new Error('method not implement');
    }

    isBuyBtnDisabled() {
        throw new Error('method not implement');
    }
}

class Web extends Platform {
    SKU_SELECTOR = '#J_isku dl';

    isDetailPage() {
        return /item\.taobao\.com\/item\.htm/.test(document.URL);
    }

    isSubmitPage() {
        return /buy\.taobao\.com/.test(document.URL);
    }

    travelAllSpecs(callback) {
        $(this.SKU_SELECTOR).each((_, element) => {
            callback(element);
        });
    }

    selectSpec(label, validSpecs, kw) {
        for (let item of validSpecs) {
            const text = $(item).find('a').text();
            if (kw instanceof RegExp) {
                if (kw.test(text)) {
                    $(item).find('a').get(0).click();
                    return true;
                }
            } else {
                if (kw.label.test(label) && kw.value.test(text)) {
                    $(item).find('a').get(0).click();
                    return true;
                }
            }
        }
    
        return false;
    }

    selectSpecByIndex(element, index) {
        if ($(element).find('a').get(index)) {
            $(element).find('a').get(index).click();
        }
    }

    isReady() {
        return $('#J_Stock > a.tb-reduce.J_Reduce.tb-iconfont.tb-disable-reduce').get(0);
    }

    getValidSpecs(element) {
        const validSpecs = [];
        console.log('specs', validSpecs);
        $(element).find('li').each((index, item) => {
            if ($(item).hasClass('tb-out-of-stock')) {
                return;
            }
            validSpecs.push(item);
        });
        return validSpecs;
    }

    getSpecLabel(element) {
        return $(element).find('dt').text();
    }

    clearAllSpecs() {
        this.travelAllSpecs((item) => {
            if ($(item).find('li.tb-selected').get(0)) {
                $(item).find('li.tb-selected a').get(0).click();
            }
        });
    }

    clickBuy() {
        $('.tb-btn-buy a').get(0).click();
    }

    isBuyBtnDisabled() {
        // return $('').get(0);   
        return false;
    }
}


class Mobile extends Platform {
    SKU_SELECTOR = 'div.dialog  div.sku-info > div';

    isDetailPage() {
        return /new\.m\.taobao\.com\/detail\.htm/.test(document.URL);
    }

    isSubmitPage() {
        return /buy\.taobao\.com/.test(document.URL);
    }

    travelAllSpecs(callback) {
        $(this.SKU_SELECTOR).each((_, element) => {
            if (
                $(element).hasClass('quantity-info')
                || $(element).hasClass('installment')
            ) {
                return;
            }
            callback(element);
        });
    }

    selectSpec(label, validSpecs, kw) {
        for (let item of validSpecs) {
            const text = $(item).text();
            if (kw instanceof RegExp) {
                if (kw.test(text)) {
                    $(item).get(0).click();
                    return true;
                }
            } else {
                if (kw.label.test(label) && kw.value.test(text)) {
                    $(item).get(0).click();
                    return true;
                }
            }
        }
    
        return false;
    }

    selectSpecByIndex(element, index) {
        if ($(element).find('li').get(index)) {
            $(element).find('li').get(index).click();
        }
    }

    isReady() {
        // return $('#J_Stock > a.tb-reduce.J_Reduce.tb-iconfont.tb-disable-reduce').get(0);
        if ($('.actionRight').get(0)) {
            $('.actionRight').get(0).click();
            return true;
        }
        return false;
    }

    getValidSpecs(element) {
        const validSpecs = [];
        console.log('specs', validSpecs);
        $(element).find('li').each((index, item) => {
            // if ($(item).hasClass('tb-out-of-stock')) {
            //     return;
            // }
            validSpecs.push(item);
        });
        return validSpecs;
    }

    getSpecLabel(element) {
        return $(element).find('h2').text();
    }

    clearAllSpecs() {
        this.travelAllSpecs((item) => {
            if ($(item).find('li.sel').get(0)) {
                $(item).find('li.sel').get(0).click();
            }
        });
    }

    clickBuy() {
        $('.sku-btn.gobuy').get(0).click();
    }

    isBuyBtnDisabled() {
        // return $('').get(0);   
        return false;
    }
}

const platform = new Mobile();

// function travelAllSpecs(callback) {
//     $(SKU_SELECTOR).each((_, element) => {
//         callback(element);
//     });
// }

// function selectSpec(label, validSpecs, kw) {
//     for (let item of validSpecs) {
//         const text = $(item).find('a').text();
//         if (kw instanceof RegExp) {
//             if (kw.test(text)) {
//                 $(item).find('a').get(0).click();
//                 return true;
//             }
//         } else {
//             if (kw.label.test(label) && kw.value.test(text)) {
//                 $(item).find('a').get(0).click();
//                 return true;
//             }
//         }
//     }

//     return false;
// }

// function clearAllSpecs() {
//     travelAllSpecs((item) => {
//         if ($(item).find('li.tb-selected').get(0)) {
//             $(item).find('li.tb-selected a').get(0).click();
//         }
//     });
// }

// /**
//  * 通过点击第一个spec，看是否有响应判断
//  * 但是如果sku没有spec就会失效
//  * @returns 是否ready
//  */
// function _isReady() {
//     const target = $(SKU_SELECTOR);
//     const li = target.find('li').get(0);

//     if (!li) {
//         return false;
//     }
//     const beforeClick = $(li).hasClass('tb-selected');
//     $(li).find('a').get(0).click();
//     const afterClick = $(li).hasClass('tb-selected');
//     return afterClick !== beforeClick;
// }

// /**
//  * 页面进来后数量减号是可点击样式，样式变灰的时机认为是ready了
//  * 兼容没有spec的情况
//  * @returns 是否ready
//  */
// function isReady() {
//     return $('#J_Stock > a.tb-reduce.J_Reduce.tb-iconfont.tb-disable-reduce').get(0);
// }

function onReady(platform, callback) {
    loop((stop) => {
        if (!platform.isReady()) {
            console.log('not ready');
            return;
        }
        console.log('ready');
        stop();
        platform.clearAllSpecs();
        // // 触发页面必选项红框
        // clickBuy();
        platform.travelAllSpecs(callback);
        // callback($(SKU_SELECTOR));
    });
}

// function clickBuy() {
//     $('.tb-btn-buy a').get(0).click();
// }
/**
 * 
 * https://item.taobao.com/item.htm?spm=a230r.1.14.129.504a6fbePJwuFt&id=678579035984&ns=1&abbucket=16#detail
 */
function runBuy() {
    // 改成label,value的形式，因为有可能有多个地方需要选择颜色，这时候就需要label区分了
    return new Promise((resolve) => {
        onReady(platform, (element) => {
            console.log('element', element);
            const label = platform.getSpecLabel(element);
            const validSpecs = platform.getValidSpecs(element);

            for (const kw of KWS) {
                if (platform.selectSpec(label, validSpecs, kw)) {
                    return;
                }
            }
            
            if (validSpecs.length > 0) {
                const idx = Math.floor(Math.random() * validSpecs.length);
                platform.selectSpecByIndex(element, idx);
            }
        });
        // platform.clickBuy();
        if (platform.isBuyBtnDisabled()) {
            return window.location.reload();
        }
        // platform.clickBuy();
        resolve();
    })
}

// function isBuyBtnDisabled() {
//     // return $('').get(0);   
//     return true;
// }

function runSubmit(platform) {
    loop((stop) => {
        const btn = $('.go-btn');
        if (btn.get(0)) {
            stop();
            btn.get(0).click();
        }
    });
}

function loop(callback) {
    const timer = setInterval(() => {
        callback(() => clearInterval(timer));
    }, LOOP_SPEED);
}
let start = null;
function main() {
    start = Date.now();
    if (platform.isDetailPage()) {
        runBuy();

    } else if (platform.isSubmitPage()) {
        // runSubmit();
    }
}

main();
