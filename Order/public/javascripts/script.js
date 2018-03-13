var date = new Date();

var json = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'javascripts/package.json',
        'dataType': 'json',
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();

var bon = [];


for ( var i = 0; i < json.menus.length; i++ ){
    var categories = document.getElementById('categories');
    var category = document.createElement('div');
    var naam = document.createElement('h1');
    naam.appendChild(document.createTextNode(json.menus[i].naam));
    category.setAttribute("id", i);
    category.classList.add("category");
    category.appendChild(naam);
    category.addEventListener("click", function () {
        getMenu(this.id);
    });
    categories.appendChild(category);
}

function getMenu(id){
    $('#items').empty();
    for ( var i = 0; i < json.menus[id].content.length; i++ ) {
        var items = document.getElementById('items');
        var item = document.createElement('div');
        var naam = document.createElement('h1');
        var price = document.createElement('p');
        price.appendChild(document.createTextNode(json.menus[id].content[i].prijs));
        naam.appendChild(document.createTextNode(json.menus[id].content[i].naam));
        item.classList.add("item");
        item.appendChild(naam);
        item.appendChild(price);
        item.dataset.naam = json.menus[id].content[i].naam;
        item.dataset.prijs = json.menus[id].content[i].prijs;
        item.addEventListener("click", function () {
            addToOrder(this);
        });
        items.appendChild(item);
    }
}

function addToOrder(content){
    var item = {naam:content.dataset.naam,prijs:content.dataset.prijs,amount: 1,dag:date.getDate(),maand:date.getMonth()+1,tijd:date.toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric"})};
    if (bon.length > 0){ //kijk of de bon leeg is.
        for (var i = 0; i < bon.length; i++){ //loop door de bon array heen
            if (bon[i].naam == item.naam){ //kijk of de geclickde item al in de array staat
                // hier de amount neerzetten aan de hand van de informatie van de item die al in de bon staat
                item.amount = bon[i].amount + 1;
                bon.splice(i,1);

            } else {
                console.log("niet gevonden");
            }
        }   // staat de zelfde item niet in de bon gewoon door gaan met de bon
        item.totalprice = item.prijs * item.amount;
        bon.push(item);// hier de item met de goeie amount pushen.

    } else { // als de bon leeg is item pushen
        item.amount = 1;
        item.totalprice = item.prijs * item.amount;
        bon.push(item);
    }
    showBon();
}

function showBon(){
    var totalPrice = 0;
    $('#orders').empty();
    for ( var i = 0; i < bon.length; i++ ) {
        var orders = document.getElementById("orders");
        var item = document.createElement('div');
        item.classList.add("orderItem");
        var naam = document.createElement('p');
        naam.classList.add("orderName");
        naam.appendChild(document.createTextNode(bon[i].amount+" X "+bon[i].naam));
        var price = document.createElement('p');
        price.classList.add("orderPrice");
        price.appendChild(document.createTextNode(bon[i].amount * bon[i].prijs));
        item.appendChild(naam);
        item.appendChild(price);
        orders.appendChild(item);
        totalPrice = totalPrice + (bon[i].amount * bon[i].prijs);
    }
    var totalPriceTag = document.createElement('div');
    var totalPriceT = document.createElement('p');
    totalPriceT.classList.add("orderName");
    totalPriceT.appendChild(document.createTextNode("total: "));
    var totalPriceP = document.createElement('p');
    totalPriceP.classList.add("orderPrice");
    totalPriceP.appendChild(document.createTextNode(totalPrice));
    totalPriceTag.classList.add("totalItem");
    totalPriceTag.appendChild(totalPriceT);
    totalPriceTag.appendChild(totalPriceP);
    orders.appendChild(totalPriceTag);

    var bonJson = JSON.stringify(bon);
    var price = JSON.stringify([totalPrice]);

    document.getElementById('bon').setAttribute("value", bonJson);
    document.getElementById('bonPrice').setAttribute("value", price);

    var send = document.createElement('INPUT');
    send.setAttribute("type", "submit");
    send.setAttribute("value", "Send Request");
    send.classList.add("orderItem");
    orders.appendChild(send);

}




