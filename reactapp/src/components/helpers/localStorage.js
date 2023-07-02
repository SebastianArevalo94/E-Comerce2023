export const getLS = () => {
    let ls = JSON.parse(localStorage.getItem("shopCart"));
    if (ls === null) {
        let newShopCart = [];
        localStorage.setItem("shopCart", JSON.stringify(newShopCart));
        return newShopCart;
    } else {
        return JSON.parse(localStorage.getItem("shopCart"));
    }
};

export const cleanLS = () => {
    let ls = JSON.parse(localStorage.getItem("shopCart"));
    ls = [];
    localStorage.setItem("shopCart", JSON.stringify(ls));
};

export const addItemLS = (item) => {
    let shopCartLS = JSON.parse(localStorage.getItem("shopCart"));
    shopCartLS.push(item);
    localStorage.setItem("shopCart", JSON.stringify(shopCartLS));
};

export const editItemsLS = (items) => {
    localStorage.setItem("shopCart", JSON.stringify(items));
};

export const addCuantityLS = (i) => {
    const shopCartLS = JSON.parse(localStorage.getItem("shopCart"))
    const toUpdate = shopCartLS.find(item => item.id === i)
    toUpdate.unidades += 1
    localStorage.setItem("shopCart", JSON.stringify(shopCartLS))
}

export const substractCuantityLS = (i) => {
    const shopCartLS = JSON.parse(localStorage.getItem("shopCart"))
    const toUpdate = shopCartLS.find(item => item.id === i)
    if (toUpdate.unidades >= 2) {
        toUpdate.unidades -= 1
        localStorage.setItem("shopCart", JSON.stringify(shopCartLS))
    }

}