const addItemButton = document.getElementById('addItem');
const inventoryTable = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
const claimForm = document.getElementById('claimForm');

// Modal elements for showing the image
const modal = document.getElementById('imageModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');

// Load items from localStorage when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadInventory();
});

// Function to add item to inventory
addItemButton.addEventListener('click', () => {
    const item = document.getElementById('item').value;
    const itemDescription = document.getElementById('itemDescription').value;
    const itemValue = parseFloat(document.getElementById('itemValue').value);
    const fileUpload = document.getElementById('fileUpload');
    const file = fileUpload.files[0];

    if (!item || !itemDescription || isNaN(itemValue) || itemValue <= 0) {
        alert('Please fill out all fields correctly!');
        return;
    }

    let fileBase64 = '';
    if (file) {
        // Convert the file to base64 string
        const reader = new FileReader();
        reader.onloadend = function () {
            fileBase64 = reader.result;

            // Remove placeholder if it exists
            const placeholderRow = document.querySelector('.placeholder');
            if (placeholderRow) {
                placeholderRow.remove();
            }

            // Create a new row in the inventory
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${item}</td>
                <td>${itemDescription}</td>
                <td><button class="view-photo-btn">View Photo</button></td>
                <td>$${itemValue.toFixed(2)}</td>
                <td><button class="btn btn-sm btn-danger delete-item">Delete</button></td>
            `;

            // Add the image data to the view button (this is where it will be stored)
            newRow.querySelector('.view-photo-btn').dataset.image = fileBase64;

            // Add event listener for "View Photo" button
            newRow.querySelector('.view-photo-btn').addEventListener('click', () => {
                openModal(fileBase64); // Open modal with the image
            });

            inventoryTable.appendChild(newRow);

            // Save the updated inventory to localStorage (including image base64)
            saveInventory();

            // Reset the form
            claimForm.reset();

            // Add delete functionality
            newRow.querySelector('.delete-item').addEventListener('click', () => {
                newRow.remove();
                saveInventory();
            });
        };
        reader.readAsDataURL(file); // This reads the image as base64
    }
});

// Function to save inventory to localStorage
function saveInventory() {
    const inventory = [];
    const rows = inventoryTable.querySelectorAll('tr');
    rows.forEach((row, index) => {
        if (index > 0) { // Ignore the header row
            const itemName = row.cells[0].textContent;
            const itemDescription = row.cells[1].textContent;
            const itemValue = row.cells[3].textContent.replace('$', '');
            const fileBase64 = row.querySelector('.view-photo-btn').dataset.image || ''; // Get the stored image base64
            inventory.push({ itemName, itemDescription, itemValue, fileBase64 });
        }
    });
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// Function to load inventory from localStorage
function loadInventory() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    if (inventory.length > 0) {
        // Remove the placeholder row if inventory exists
        const placeholderRow = document.querySelector('.placeholder');
        if (placeholderRow) {
            placeholderRow.remove();
        }

        inventory.forEach(item => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${item.itemName}</td>
                <td>${item.itemDescription}</td>
                <td><button class="view-photo-btn">View Photo</button></td>
                <td>$${parseFloat(item.itemValue).toFixed(2)}</td>
                <td><button class="btn btn-sm btn-danger delete-item">Delete</button></td>
            `;

            // Set image base64 in the button as data attribute
            if (item.fileBase64) {
                newRow.querySelector('.view-photo-btn').dataset.image = item.fileBase64;
            }

            // Add event listener for "View Photo" button
            newRow.querySelector('.view-photo-btn').addEventListener('click', () => {
                openModal(item.fileBase64); // Open modal with the image
            });

            inventoryTable.appendChild(newRow);

            // Add delete functionality
            newRow.querySelector('.delete-item').addEventListener('click', () => {
                newRow.remove();
                saveInventory();
            });
        });
    } else {
        // Add placeholder row if no items exist
        const placeholderRow = document.createElement('tr');
        placeholderRow.classList.add('placeholder');
        placeholderRow.innerHTML = `
          <td colspan="5" class="text-center text-muted">No items added yet.</td>
        `;
        inventoryTable.appendChild(placeholderRow);
    }
}

// Function to open the image modal
function openModal(fileBase64) {
    modal.style.display = 'block';
    modalContent.innerHTML = `
        <img src="${fileBase64}" alt="Uploaded photo" class="uploaded-photo-modal" />
        <button id="closeModalBtn" class="btn btn-sm btn-secondary">Close</button>
    `;

    // Add event listener for close button in modal
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Close modal when clicking the 'X' button
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});
