let db;

// Initialization

window.onload = () => {
	const form = document.getElementById('form');
	form.addEventListener('submit', () => { addItem(); }, false);

	initDbIDB();
};

// IndexedDB Implementation

function initDbIDB() {
	const request = window.indexedDB.open('ToDo', 1);

	request.onsuccess = () => {
		db = request.result;
		displayDataIDB();
	};

	request.onupgradeneeded = (e) => {
		db = e.target.result;
		constructDbIDB();
	};

	request.onerror = () => {
		throw new Error('Database failed to open');
	};
}

function constructDbIDB() {
	const objectStore = db.createObjectStore('items', {
		keyPath: 'id',
		autoIncrement: true,
	});

	objectStore.createIndex('value', 'value', { unique: false });
	objectStore.createIndex('status', 'status', { unique: false });
}

function displayDataIDB() {
	const transaction = db.transaction(['items'], 'readonly');
	const objectStore = transaction.objectStore('items');

	const request = objectStore.openCursor();

	request.onsuccess = (e) => {
		const cursor = e.target.result;

		if (cursor) {
			renderItem(cursor.value);
			cursor.continue();
		}
	};

	transaction.onerror = () => {
		throw new Error('Database transaction failed');
	};
}

function addDataIDB(text) {
	const transaction = db.transaction(['items'], 'readwrite');
	const objectStore = transaction.objectStore('items');

	const item = {
		value: text,
		status: false,
	};

	const request = objectStore.add(item);

	request.onsuccess = (e) => {
		item.id = e.target.result;
		renderItem(item);
	};

	transaction.onerror = () => {
		throw new Error('Database transaction failed');
	};
}

function toggleDataIDB(id) {
	const transaction = db.transaction(['items'], 'readwrite');
	const objectStore = transaction.objectStore('items');

	const request = objectStore.get(id);

	request.onsuccess = () => {
		const item = request.result;

		item.status = !item.status;

		objectStore.put(item);

		renderItem(item);
	};

	transaction.onerror = () => {
		throw new Error('Database transaction failed');
	};
}

function deleteDataIDB(id) {
	const transaction = db.transaction(['items'], 'readwrite');
	const objectStore = transaction.objectStore('items');

	objectStore.delete(id);

	transaction.onerror = () => {
		throw new Error('Database transaction failed');
	};
}

// Main Functionality

function addItem() {
	const itemValue = document.getElementById('newItemText').value;

	if (IsEmpty(itemValue)) {
		document.getElementById('errorMsg').innerText = 'This field cannot be empty';
		return;
	}

	document.getElementById('newItemText').value = '';
	document.getElementById('errorMsg').innerText = '';

	addDataIDB(itemValue);
}

function deleteNode(item) {
	item.parentNode.removeChild(item);
}

function toggleItem(item) {
	const id = Number(item.getAttribute('item-id'));
	toggleDataIDB(id);
	deleteNode(item);
}

function deleteItem(item) {
	const id = Number(item.getAttribute('item-id'));
	deleteDataIDB(id);
	deleteNode(item);
}

// Rendering Functions

function handle(e) {
	const t = e.target;

	if (t.tagName === 'A') toggleItem(t);
	else deleteItem(t.parentNode);
}

function renderItem(item) {
	const itemId = item.id;
	const itemText = item.value;
	const itemStatus = item.status;

	const newItem = document.createElement('a');
	newItem.href = '#';
	newItem.setAttribute('item-id', itemId);
	newItem.addEventListener('click', (e) => {
		handle(e);
	}, false);

	const textNode = document.createTextNode(itemText);
	newItem.appendChild(textNode);

	const deleteIcon = document.createElement('span');
	deleteIcon.className = 'fa fa-remove text-danger';
	newItem.appendChild(deleteIcon);

	let list;

	if (IsCompleted(itemStatus)) {
		newItem.className = 'list-group-item list-group-item-action list-group-item-success d-flex justify-content-between align-items-center';
		list = document.getElementById('completed');
	} else {
		newItem.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
		list = document.getElementById('todo');
	}

	list.insertBefore(newItem, list.firstChild);
}

// Helpful Functions

function IsEmpty(string) {
	return !(string.trim());
}

function IsCompleted(status) {
	return status;
}
