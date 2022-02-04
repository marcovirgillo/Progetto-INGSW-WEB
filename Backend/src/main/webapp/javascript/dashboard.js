const address = "localhost:8080";
const addAssetsUrl = `http://${address}/adminRest/addSupportedCripto`;
const addNewUserUrl = `http://${address}/adminRest/addNewUser`;
const removeSupportedCryptoUrl = `http://${address}/adminRest/removeSupportedCripto`;
const removeUserUrl = `http://${address}/adminRest/removeUser`;

window.onload = function() {
    addEvents();
}

//crea il popup che chiede se voglio rimuovere davver l'asset
const askAndRemoveAsset = (ticker) => {
    const popup = confirmPopup(`Remove ${ticker}`, 
            "Are you sure? The removal will be aborted if someone has this crypto in his portfolio", 
            () => {removeSupportedCrypto(ticker); popup.remove()}, 
            () => popup.remove());

    document.querySelector("html").appendChild(popup);
}

//crea il popup che chiede se voglio rimuovere davver l'asset
const askAndRemoveUser = (username) => {
    const popup = confirmPopup(`Remove ${username}`, 
            "Are you sure? Everything about this user will be removed!", 
            () => {removeUser(username); popup.remove()}, 
            () => popup.remove());

    document.querySelector("html").appendChild(popup);
}

function addEvents() {
    document.querySelector("#addAssetBtn").addEventListener('click', addNewAsset);
    document.querySelectorAll("#assetsList tr").forEach((item) => {
        item.children['5'].onclick = () => askAndRemoveAsset(item.children['1'].innerText);
    });

    document.querySelectorAll("#usersList tr").forEach((item) => {
        item.children['3'].onclick = () => askAndRemoveUser(item.children['1'].innerText);
    });
    document.querySelector("#addNewUser").addEventListener('click', addNewUser);
} 

const removeSupportedCrypto = (ticker) => {
    $.ajax({
        method: 'DELETE',
        url: removeSupportedCryptoUrl,
        headers: {
            'Content-Type': 'application/json' 
        },
        data: JSON.stringify({
            'ticker': ticker,
        }),
        success: function() {
            $("#assetsList").children('tr').each((idx, item) => {
                if(item.children['1'].innerText === ticker) {
                    item.remove();
                    alert("Rimotion successfully!");
                    return;
                }
            });
        },
        error: function(err) {
            alert(err.responseJSON.msg);
        }
    })
}

const removeUser = (user) => {
    $.ajax({
        method: 'DELETE',
        url: removeUserUrl,
        headers: {
            'Content-Type': 'application/json' 
        },
        data: JSON.stringify({
            'username': user,
        }),
        success: function() {
            $("#usersList").children('tr').each((idx, item) => {
                if(item.children['1'].innerText === user) {
                    item.remove();
                    alert("Rimotion successfully!");
                    return;
                }
            });
        },
        error: function(err) {
            alert(err.responseJSON.msg);
        }
    })
}

const appendNewAsset = (ticker, name, graphic_id, api_id) => {
    let found = false;
    const list = $("#assetsList");

    list.children("tr").each((idx, item) => {
        const text = item.children['2'].innerText;
        const lastIdx = list.children('tr').length -1;

        if(found) {
            item.children['0'].innerText = idx + 2;
        }
        
        if((name.toLowerCase() < text.toLowerCase() || idx === lastIdx) && !found) {
            var node = document.createElement('tr'); 
            const idxNode = document.createElement('td');
            idxNode.innerText = idx+1;

            const tickerNode = document.createElement('td');
            tickerNode.innerText = ticker;

            const nameNode = document.createElement('td');
            nameNode.innerText = name;

            const apiNode = document.createElement('td');
            apiNode.innerText = api_id;

            const graphicNode = document.createElement('td');
            graphicNode.innerText = graphic_id;

            const imgNode = document.createElement('td');
            imgNode.innerHTML = "<img src='../../admin_assets/logos/remove.png' width='24' height='24'/>";
            imgNode.onclick = () => askAndRemoveAsset(ticker);

            node.appendChild(idxNode);
            node.appendChild(tickerNode);
            node.appendChild(nameNode);
            node.appendChild(apiNode);
            node.appendChild(graphicNode);
            node.appendChild(imgNode);

            if(idx !== lastIdx) {
                list[0].insertBefore(node, list.children('tr')[idx]);
                item.children['0'].innerText = idx+2;
            }
            else {
                idxNode.innerText = idx+2;
                list[0].appendChild(node);
            }
            
            found = true;
        }
    })
}


const appendNewUser = (username, email) => {
    let found = false;
    const list = $("#usersList");

    list.children("tr").each((idx, item) => {
        const text = item.children['1'].innerText;
        const lastIdx = list.children('tr').length - 1;

        if(found) {
            item.children['0'].innerText = idx + 2;
        }
        
        if((username.toLowerCase() < text.toLowerCase() || idx === lastIdx) && !found) {
            var node = document.createElement('tr'); 
            const idxNode = document.createElement('td');
            idxNode.innerText = idx+1;

            const usernameNode = document.createElement('td');
            usernameNode.innerText = username;

            const mailNode = document.createElement('td');
            mailNode.innerText = email;

            const imgNode = document.createElement('td');
            imgNode.innerHTML = "<img src='../../admin_assets/logos/remove.png' width='24' height='24'/>";
            imgNode.onclick = () => askAndRemoveUser(username);

            node.appendChild(idxNode);
            node.appendChild(usernameNode);
            node.appendChild(mailNode);
            node.appendChild(imgNode);

            if(idx !== lastIdx) {
                list[0].insertBefore(node, list.children('tr')[idx]);
                item.children['0'].innerText = idx+2;
            }
            else {
                idxNode.innerText = idx+2;
                list[0].appendChild(node);
            }
            
            found = true;
        }
    })
}

//fa la richiesta per aggiungere una nuova cripto supportata
const addNewAsset = () => {
    const ticker = $("#tickerField")[0].value;
    const name = $("#nameField")[0].value;
    const graphic_id = $("#graphicIdField")[0].value;
    const api_id = $("#apiIdField")[0].value;
   
    $.ajax({
        method: 'POST',
        url: addAssetsUrl,
        headers: {
            'Content-Type': 'application/json' 
        },
        data: JSON.stringify({
            'ticker': ticker,
            'name': name,
            'graphic_id': graphic_id,
            'api_id': api_id
        }),
        success: function(resp) {
            appendNewAsset(ticker, name, graphic_id, api_id);
            $("#tickerField")[0].value = "";
            $("#nameField")[0].value = "";
            $("#graphicIdField")[0].value = "";
            $("#apiIdField")[0].value = "";
            alert("Success!");
        },
        error: function(err) {
            alert(err.responseJSON.msg);
        }
    })
}

//fa la richiesta per aggiungere una nuova cripto supportata
const addNewUser = () => {
    const username = $("#usernameField")[0].value;
    const email = $("#emailField")[0].value;
    const password = $("#passwordField")[0].value;
   
    $.ajax({
        method: 'POST',
        url: addNewUserUrl,
        headers: {
            'Content-Type': 'application/json' 
        },
        data: JSON.stringify({
            'username': username,
            'email': email,
            'password': password
        }),
        success: function(resp) {
            appendNewUser(username, email);
            $("#usernameField")[0].value = "";
            $("#emailField")[0].value = "";
            $("#passwordField")[0].value = "";
            alert("Success!");
        },
        error: function(err) {
            alert(err.responseJSON.msg);
        }
    })
}

//crea il nodo che conterrà il popup di conferma
const confirmPopup = (title, text, onConfirm, onCancel) => {
    const backgroundDiv = document.createElement("div");
    backgroundDiv.className = "background-blurrer";

    const popupDiv = document.createElement("div");
    popupDiv.className = "confirm-popup";

    const popupUl = document.createElement("ul");
    popupUl.className = "popup-list";

    const titleNode = document.createElement("p");
    titleNode.className = "popup-title";
    titleNode.innerText = title;

    const textNode = document.createElement("span");
    textNode.className = "popup-text";
    textNode.innerText = text;

    const confirmBtn = document.createElement("p");
    confirmBtn.className = "popup-btn popup-confirm";
    confirmBtn.innerText = "Confirm";
    confirmBtn.onclick = onConfirm;

    const cancelBtn = document.createElement("p");
    cancelBtn.className = "popup-btn popup-cancel";
    cancelBtn.innerText = "Cancel";
    cancelBtn.onclick = onCancel;

    popupUl.appendChild(titleNode);
    popupUl.appendChild(textNode);
    popupUl.appendChild(confirmBtn);
    popupUl.appendChild(cancelBtn);

    popupDiv.appendChild(popupUl);
    backgroundDiv.appendChild(popupDiv);

    return backgroundDiv;
}