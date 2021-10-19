document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:5000/getAll')
        .then(res => res.json())
        .then(data => loadHtmlTable(data["data"]))
});

document.querySelector("table tbody").addEventListener('click', e => {
    if (e.target.className == "delete-row-btn") {
        deleteRowById(e.target.dataset.id)
    }
    if (e.target.className == "edit-row-btn") {
        handleEditRow(e.target.dataset.id)
    }
});

const deleteRowById = (id) => {
    fetch('http://localhost:5000/delete/' + id, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        })

}

const updateBtn = document.querySelector("#update-row-btn")
const searchBtn = document.querySelector("#search-btn")

searchBtn.addEventListener('click', ()=>{
    const searchValue = document.querySelector("#search-input").value

    fetch('http://localhost:5000/search/'+searchValue)
    .then(res => res.json())
    .then(data => loadHtmlTable(data["data"]))

});

const handleEditRow = (id) => {
    document.querySelector("#update-row").hidden = false
    document.querySelector("#update-row-btn").dataset.id = id


}
updateBtn.addEventListener('click', (e) => {
    const updateNameInput = document.querySelector('#update-name-input')

    fetch('http://localhost:5000/update', {
            method: "PATCH",
            headers: { 'Content-type': 'application/json'},
            body: JSON.stringify({
                id: e.target.dataset.id,
                name: updateNameInput.value
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        })
});


const addBtn = document.querySelector("#add-name-btn")

addBtn.addEventListener('click', () => {
    const nameInput = document.querySelector('#name-input')
    const name = nameInput.value
    nameInput.value = ""

    fetch("http://localhost:5000/insert", {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                name
            })
        })
        .then(res => res.json())
        .then(data => insertRowIntoTable(data['data']))
});

const insertRowIntoTable = (data) => {
    console.log(data, 123)
    const table = document.querySelector('table tbody')
    const isTableData = table.querySelector(".no-data")

    let tableHtml = `<tr>`

    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const element = data[key];
            if (key === "dateAdded") {
                data[key] = new Date(data[key].toLocaleString())
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }
    tableHtml += `<td><button class="delete-row-btn" data-id="${data.id}">Delete</button></td>`
    tableHtml += `<td><button class="edit-row-btn" data-id="${data.id}">Edit</button></td>`
    tableHtml += `</tr>`

    if (isTableData) {
        table.innerHTML = tableHtml
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}


function loadHtmlTable(data) {
    const table = document.querySelector('table tbody')

    console.log(data)

    if (data.length == 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></td></tr>"
        return
    }
    let tableHtml = "";

    data.forEach(({
        id,
        name,
        date_added
    }) => {
        tableHtml += "<tr>"
        tableHtml += `<td>${id}</td>`
        tableHtml += `<td>${name}</td>`
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`
        tableHtml += `<td><button class="delete-row-btn" data-id="${id}">Delete</button></td>`
        tableHtml += `<td><button class="edit-row-btn" data-id="${id}">Edit</button></td>`
        tableHtml += `</tr>`
    })
    table.innerHTML = tableHtml
}