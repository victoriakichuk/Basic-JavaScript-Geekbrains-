"use strict";

//достаем из HTML файла нужные элеименты 
const countElementsCart = document.querySelector('.cartIconWrap span');
const basketTotalValue = document.querySelector('.basketTotalValue');
const basketHidden = document.querySelector('.basket');
const basketTotal = document.querySelector('.basketTotal');

//Убираем класс hidden у корзины ,чтобы при клике на иконку с корзиной, меню корзины стало видно 
const cartButton = document.querySelector('.cartIconWrap');
cartButton.addEventListener('click', () => {

    if (basketHidden.classList.contains('hidden')) {
        basketHidden.classList.remove('hidden');
    }
});

//метод, который будет хранить в себе товары, добавленные в корзину и любые изменения, связанные с ней
const productToCart = {}

const clickAddToCart = document.querySelector('.featuredImgWrap');

//Обработчик кнопки addToСart
document.querySelector('.featuredItems').addEventListener('click', event => {
    //Делаем клик возможным не толлько для элемента AddToCart, но и для его родителей
    if (!event.target.closest('.addToCart')) {
        return;
    }

    //Для ближайщего родителя с классом featuredItem, получаем все данные о продукте 
    const featuredItem = event.target.closest('.featuredItem');
    const id = +featuredItem.dataset.id;
    const name = featuredItem.dataset.name;
    const price = +featuredItem.dataset.price;

    //Добавляем в корзину продукт 
    addToCart(id, name, price);

})

//Добавление товара в корзину
function addToCart(id, name, price) {
    //Проверка, если этого продукта уже нет в корзине 
    if (!(id in productToCart)) {
        productToCart[id] = {
            id: id,
            name: name,
            price: price,
            count: 0
        };
    }

    //Добавляем 1 к количеству товара в корзине
    productToCart[id].count++;
    //Увеличиваем знаение товаров в корзине у значка в углу корзины 
    countElementsCart.textContent = getTotalBasketCount().toString();
    //Изменяем общую сумму в корзине
    basketTotalValue.textContent = getbasketTotalPrice().toFixed(2);
    //Отрисовывем продукт с id в корзине
    putProductInBasket(id);

}

//Считает и возвращает кол-во продуктов в корзине
function getTotalBasketCount() {
    return Object
        .values(productToCart)
        .reduce((acc, product) => acc + product.count, 0);
}

//Считает и возвращает общую сумму для всех одиннаковых товаров 
function getbasketTotalPrice() {
    return Object
        .values(productToCart)
        .reduce((acc, product) => acc + product.count * product.price, 0);
}

//Проверяет, существует ли такой продукт уже в корзине 
function putProductInBasket(productId) {
    const basketExistingProduct = basketHidden
        .querySelector(`.basketRow[data-id="${productId}"]`);

    if (!basketExistingProduct) {
        putNewProductInBasket(productId);
        return;
    }

    const product = productToCart[productId];

    //Меняет кол-во одного товара  в корзине
    basketExistingProduct
        .querySelector('.productCount').textContent = product.count;

    //Меняет общую цену за все одиннаковые продукты в корзине
    basketExistingProduct
        .querySelector('.productTotalRow')
        .textContent = (product.price * product.count).toFixed(2);
}

//Вставляет добавленный продукт в разметку корзины
function putNewProductInBasket(productId) {
    const productRow = `
    <div class="basketRow" data-id="${productId}">
      <div>${productToCart[productId].name}</div>
      <div>
        <span class="productCount">${productToCart[productId].count}</span> шт.
      </div>
      <div>$${productToCart[productId].price}</div>
      <div>
        $<span class="productTotalRow">${(productToCart[productId].price * productToCart[productId].count).toFixed(2)}</span>
      </div>
    </div>
    `;

    //Втавляет продукты до общей цены всей корзины
    basketTotal.insertAdjacentHTML('beforebegin', productRow);
}