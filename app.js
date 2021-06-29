// Storage Controller
const StorageCtrl = (function() {
    // Public methods
    return {
        storeItem: function(item) {
            let items;

            // Check if any item in LS
            if (localStorage.getItem('items') === null) {
                let items = [];
                // Push new item
                items.push(item);

                // Set LS
                localStorage.setItem('items', JSON.stringify(items))
            } else {
                // Get  what is in LS
                items = JSON.parse(localStorage.getItem('items'))

                // Push new item
                items.push(item);

                // Re-Set LS
                localStorage.setItem('items', JSON.stringify(items))
            }
        },
        getItemsFromStorage: function() {
            let items;
            // Check if any item in LS
            if (localStorage.getItem('items') === null) {
                items = [];

            } else {
                // Get  what is in LS
                items = JSON.parse(localStorage.getItem('items'))
            }
            return items;

        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            // Re-Set LS
            localStorage.setItem('items', JSON.stringify(items))
        },
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });
            // Re-Set LS
            localStorage.setItem('items', JSON.stringify(items))
        },
        clearItemsFromStorage: function() {
            localStorage.removeItem('items');
        }
    }
})();




// Item Controller
const ItemCtrl = (function() {
    //Item constructor
    const Item = function(id, name, cost) {
        this.id = id;
        this.name = name;
        this.cost = cost;
    }

    //Data structure / State
    const data = {
        // items: [
        //     // { id: 0, name: 'Office Chair', cost: 150 },
        //     // { id: 0, name: 'Tennis Shoes', cost: 72 },
        //     // { id: 0, name: 'Dennys Dinner', cost: 32 }
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        amountDue: 0
    }

    //Public methods
    return {

        getItems: function() {
            return data.items
        },
        addItem: function(name, cost) {
            let ID;
            // Create ID's
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0;
            }

            // Cost to number
            cost = parseInt(cost);

            // Crete new item
            newItem = new Item(ID, name, cost)

            // Add to items array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function(id) {
            let found = null;
            data.items.forEach(item => {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, cost) {
            //Cost to number
            cost = parseInt(cost);

            let found = null;

            data.items.forEach(item => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.cost = cost;
                    found = item;
                }
            });
            return found
        },
        deleteItem: function(id) {
            // Get ids
            const ids = data.items.map(function(item) {
                return item.id;
            });

            //Get index
            const index = ids.indexOf(id);

            //Remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function() {
            data.items = [];
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getAmountDue: function() {
            let amount = 0;

            // Loop througth items and add costs to 
            data.items.forEach(item => {
                amount += item.cost;
            });


            // Set total amout in the data structure
            data.amountDue = amount;

            // Return total
            return data.amountDue;
        },
        logData: function() {
            return data;
        }
    }

})();





// UI Controller
const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCostInput: '#item-cost',
        amountDue: '.amount-due'
    }

    //Public methods
    return {
        populateItemList(items) {
            let html = '';

            items.forEach(item => {
                html += `
                <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong><em>$${item.cost}</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fas fa-pencil-alt"></i>
                </a>
            </li>`
            });

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                cost: document.querySelector(UISelectors.itemCostInput).value
            };
        },

        addListItem: function(item) {
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add className
            li.className = 'collection-item';
            // Add iD
            li.id = `item-${item.id}`;

            //Add HTML
            li.innerHTML =
                `<strong>${item.name}: </strong><em>$ ${item.cost}</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fas fa-pencil-alt"></i>
            </a>`

            //Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(listItem => {
                const itemID = listItem.getAttribute('id');

                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong><em>$ ${item.cost}</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fas fa-pencil-alt"></i>
                    </a>`
                }

            });
        },
        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCostInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCostInput).value = ItemCtrl.getCurrentItem().cost;
            UICtrl.showEditState();
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node List into array
            listItems = Array.from(listItems);

            listItems.forEach(item => {
                item.remove();
            });
        },
        showAmountDue: function(amountDue) {
            document.querySelector(UISelectors.amountDue).textContent = `$${amountDue}`;
        },
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function() {
            return UISelectors;
        },
    }
})();





// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
    // Load event listeners
    const loadEventListeners = function() {
        // Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on 'enter' key button
        document.addEventListener('keypress', function(e) {
            if (e.KeyCode === 13 || e.which === 13) {

                e.preventDefault();
                return false;
            }
        })

        // Edit icon click event (item)
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Back button
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }


    // Add item submit
    const itemAddSubmit = function(e) {
        // get form input from ui controller
        const input = UICtrl.getItemInput();

        // Check for name and cost input (Both filled properly)
        if (input.name !== '' & input.cost !== '') {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.cost);
        }
        // Add item to UI list
        UICtrl.addListItem(newItem);

        // Get amount due
        const amountDue = ItemCtrl.getAmountDue();
        // Add amount due to UI
        UICtrl.showAmountDue(amountDue);

        // Store in local storage
        StorageCtrl.storeItem(newItem);

        // Clear Fields
        UICtrl.clearInput();

        e.preventDefault();
    }

    // Click edit item submit
    const itemEditClick = function(e) {
        if (e.target.classList.contains('edit-item')) {
            // Get current item id
            const listId = e.target.parentNode.parentNode.id;

            // Break into an array
            const listIdArr = listId.split('-');

            // Get actual id
            const id = parseInt(listIdArr[1]);

            // Get item
            itemToEdit = ItemCtrl.getItemById(id);

            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form
            UICtrl.addItemToForm();

        }

        e.preventDefault();
    }

    // Update item submit
    const itemUpdateSubmit = function(e) {
        // Get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.cost);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get amount due
        const amountDue = ItemCtrl.getAmountDue();
        // Add amount due to UI
        UICtrl.showAmountDue(amountDue);

        // Update LS
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Delete button submit
    const itemDeleteSubmit = function(e) {
        // Get current item 
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get amount due
        const amountDue = ItemCtrl.getAmountDue();
        // Add amount due to UI
        UICtrl.showAmountDue(amountDue);

        // Delete from LS
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Clear items event

    const clearAllItemsClick = function() {
        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        // Get amount due
        const amountDue = ItemCtrl.getAmountDue();
        // Add amount due to UI
        UICtrl.showAmountDue(amountDue);

        // Remove all items from UI
        UICtrl.removeItems();

        // Clear from LS
        StorageCtrl.clearItemsFromStorage();

        UICtrl.clearEditState();

        // Hide UL
        UICtrl.hideList()
    }


    // Public methods
    return {
        init: function() {
            // Set initial state
            UICtrl.clearEditState();

            // Fetch items from data structure
            let items = ItemCtrl.getItems()

            //Check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate list with items
                UICtrl.populateItemList(items);
            }

            // Get amount due
            const amountDue = ItemCtrl.getAmountDue();

            // Add amount due to UI
            UICtrl.showAmountDue(amountDue);

            //Load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();