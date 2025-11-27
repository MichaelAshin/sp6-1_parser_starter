// @todo: напишите здесь код парсера

function getCurrency(data)
// Функция для парсинга валюты
{
    let currencies = {
        '₽': 'RUB',
    };
    for (elem in currencies) {
        if (currencies.hasOwnProperty(elem)) {
            if (data.trim().includes(elem)) {
                return currencies[elem];
            }
        }
    };
    return null
}

function parsePage() {

    // Парсинг общей информации
    const head = document.head;

    // Парсинг продукта
    const product = document.querySelector('.product');

    // Расчет цен и скидок
    const allPrices = product.querySelector(
        '.price'
    ).textContent.trim().split('\n ');
    const price = Number(allPrices[0].trim().replace(/\D/g, ''));
    const oldPrice = Number(allPrices[1].trim().replace(/\D/g, ''));
    const discount = oldPrice - price;
    const discountPercent = (discount / oldPrice * 100).toFixed(2);

    // Определяем валюту
    let currencies = {
        '₽': 'RUB',
    };
    let currency
    currency = getCurrency(allPrices[0])

    // Парсинг свойств
    let properties = product.querySelectorAll('.properties li')
    let propertiesObj = {}
    for (property of properties) {
        propertiesObj[property.firstElementChild.textContent] = (
            property.lastElementChild.textContent
        )
    }

    // Парсинг кнопок
    let buttons = product.querySelectorAll('nav > button > img')
    let images = []
    for (button of buttons) {
        images.push({
            'preview': button.getAttribute('src'),
            'full': button.dataset.src,
            'alt': button.getAttribute('alt'),
        })
    }

    // Парсинг рекомендаций
    const suggested = document.querySelectorAll('.suggested > .container > .items > article')
    suggestedArr = []
    for (item of suggested) {
        suggestedArr.push(
            {
                "name": item.querySelector('h3').textContent.trim(),
                "description": item.querySelector('p').textContent.trim(),
                "image": item.querySelector('img').getAttribute('src'),
                "price": item.querySelector('b').textContent.trim().replace(/\D/g, ''),
                "currency": getCurrency(item.querySelector('b').textContent.trim()),
            }
        )
    }

    // Парсинг обзоров
    const reviews = document.querySelectorAll('.reviews > .container > .items > article')
    reviewsArr = []
    for (review of reviews) {
        reviewsArr.push(
            {
                "rating": review.querySelectorAll('.filled').length,
                "author": {
                    "avatar": review.querySelector('.author > img').getAttribute('src'),
                    "name": review.querySelector('.author > span').textContent
                },
            "title": review.querySelector('h3').textContent,
            "description": review.querySelector('p').textContent,
            "date": review.querySelector('.author > i').textContent.split('/').join('.')
        })
    }
    return {
        meta: {
            "title": document.querySelector('title').textContent.trim().split('—')[0].trim(),
            "description": head.querySelector('meta[name="description"]').content.trim(),
            "keywords": head.querySelector('meta[name="keywords"]').content.split(', '),
            "language": document.documentElement.lang,
            "opengraph": {
                "title": head.querySelector('meta[property="og:title"]').content.trim().split('—')[0].trim(),
                "image": head.querySelector('meta[property="og:image"]').content.trim(),
                "type": head.querySelector('meta[property="og:type"]').content.trim()
    }
        },
        product: {
            "id": product.dataset.id,
            "name": product.querySelector('h1').textContent.trim(),
            "isLiked": product.querySelector('.like + .active') !== null,
            "tags": {
                "category": [
                    product.querySelector('.green').textContent.trim()
                ],
                "discount": [
                    product.querySelector('.red').textContent.trim()
                ],
                "label": [
                    product.querySelector('.blue').textContent.trim()
                ]
            },
            "price": price,
            "oldPrice": oldPrice,
            "discount": discount,
            "discountPercent": `${discountPercent}%`,
            "currency": currency,
            "properties": propertiesObj,
            "description": product.querySelector('.description').innerHTML.replace(/\s*\S+=".+"\s*/, '').trim(),
            "images": images,
        },
        suggested: suggestedArr,
        reviews: reviewsArr,
    }
}

window.parsePage = parsePage;
