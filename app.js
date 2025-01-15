// app.js
const addItemButton = document.getElementById('addItem');
const inventoryTable = document.getElementById('inventoryTable');

// Handle adding items to the inventory
addItemButton.addEventListener('click', () => {
  const room = document.getElementById('room').value;
  const item = document.getElementById('item').value;
  const fileUpload = document.getElementById('fileUpload');
  const fileName = fileUpload.files[0]?.name || 'No file uploaded';

  if (!item) {
    alert('Please enter an item name!');
    return;
  }

  // Remove placeholder if exists
  const placeholderRow = document.querySelector('.placeholder');
  if (placeholderRow) {
    placeholderRow.remove();
  }

  // Create new row
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${capitalize(room)}</td>
    <td>${item}</td>
    <td>${fileName}</td>
    <td>
      <button class="btn btn-sm btn-danger delete-item">Delete</button>
    </td>
  `;

  inventoryTable.appendChild(newRow);

  // Reset form
  document.getElementById('claimForm').reset();

  // Add delete functionality
  newRow.querySelector('.delete-item').addEventListener('click', () => {
    newRow.remove();
    if (!inventoryTable.querySelector('tr')) {
      addPlaceholder();
    }
  });
});

// Add placeholder if inventory is empty
function addPlaceholder() {
  const placeholderRow = document.createElement('tr');
  placeholderRow.classList.add('placeholder');
  placeholderRow.innerHTML = `
    <td colspan="4" class="text-center text-muted">No items added yet.</td>
  `;
  inventoryTable.appendChild(placeholderRow);
}

// Capitalize first letter of text
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
