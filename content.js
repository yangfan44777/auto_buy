const SKU_SELECTOR = '#J_isku dl';
const LOOP_SPEED = 100;
const KWS = [{
    label: /机.*色/,
    value: /紫/
}, /99.*?256/];

function travelAllSpecs(callback) {
    $(SKU_SELECTOR).each((_, element) => {
        callback(element);
    });
}

function selectSpec(label, validSpecs, kw) {
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

function clearAllSpecs() {
    travelAllSpecs((item) => {
        if ($(item).find('li.tb-selected').get(0)) {
            $(item).find('li.tb-selected a').get(0).click();
        }
    });
}

/**
 * 通过点击第一个spec，看是否有响应判断
 * 但是如果sku没有spec就会失效
 * @returns 是否ready
 */
function _isReady() {
    const target = $(SKU_SELECTOR);
    const li = target.find('li').get(0);

    if (!li) {
        return false;
    }
    const beforeClick = $(li).hasClass('tb-selected');
    $(li).find('a').get(0).click();
    const afterClick = $(li).hasClass('tb-selected');
    return afterClick !== beforeClick;
}

/**
 * 页面进来后数量减号是可点击样式，样式变灰的时机认为是ready了
 * 兼容没有spec的情况
 * @returns 是否ready
 */
function isReady() {
    return $('#J_Stock > a.tb-reduce.J_Reduce.tb-iconfont.tb-disable-reduce').get(0);
}

function onReady(callback) {
    loop((stop) => {
        if (!isReady()) {
            console.log('not ready');
            return;
        }
        console.log('ready');
        stop();
        clearAllSpecs();
        // // 触发页面必选项红框
        clickBuy();
        callback($(SKU_SELECTOR));
    });
}

function clickBuy() {
    $('.tb-btn-buy a').get(0).click();
}
/**
 * 
 * https://item.taobao.com/item.htm?spm=a230r.1.14.129.504a6fbePJwuFt&id=678579035984&ns=1&abbucket=16#detail
 */
function runBuy() {
    // 改成label,value的形式，因为有可能有多个地方需要选择颜色，这时候就需要label区分了
    return new Promise((resolve) => {
        onReady(($$specs) => {
            $$specs.each((_, element) => {
                const label = $(element).find('dt').text();
                const validSpecs = [];
                console.log('specs', validSpecs);
                $(element).find('li').each((index, item) => {
                    if ($(item).hasClass('tb-out-of-stock')) {
                        return;
                    }
                    validSpecs.push(item);
                });

                for (const kw of KWS) {
                    if (selectSpec(label, validSpecs, kw)) {
                        return;
                    }
                }
                // 没有找到任何关键字，默认选择第一个
                // 还需要考虑互斥选择的情况，选了某个sku就不能选择其他的
                // 当无解时，需要回退上一步选择其他spec，继续尝试
                if (validSpecs.length > 0) {
                    const idx = Math.floor(Math.random() * validSpecs.length);
                    if ($(element).find('a').get(idx)) {
                        $(element).find('a').get(idx).click();
                    }
                }
            });
            // clickBuy();
            if (isBuyBtnDisabled()) {
                return window.location.reload();
            }
            clickBuy();
            resolve();
        });
    })
}

function isBuyBtnDisabled() {
    return $('.J_LinkBuy.tb-disabled').get(0);   
}

function runSubmit() {
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
    if (/item\.taobao\.com\/item\.htm/.test(document.URL)) {
        runBuy().then(() => {

        });

    } else if (/buy\.taobao\.com/.test(document.URL)) {
        runSubmit();
    }
}

main();
