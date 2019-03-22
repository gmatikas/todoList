let db;

window.onload = () => {
	const addButton = document.getElementById('add');
	addButton.addEventListener('click', () => {
		addItem();
	}, false);

	const request = window.indexedDB.open('ToDo', 1);

	request.onerror = () => {
		throw new Error('Database failed to open');
	};

	request.onsuccess = () => {
		db = request.result;

		displayData();
	};

	request.onupgradeneeded = (e) => {
		db = e.target.result;

		const objectStore = db.createObjectStore('items', {
			keyPath: 'id',
			autoIncrement: true,
		});

		objectStore.createIndex('value', 'value', {
			unique: false,
		});
		objectStore.createIndex('status', 'status', {
			unique: false,
		});
	};
};

function displayData() {
	const transaction = db.transaction(['items'], 'readwrite');
	const objectStore = transaction.objectStore('items');

	objectStore.openCursor().onsuccess = (e) => {
		const cursor = e.target.result;

		if (cursor) {
			renderItem(cursor.value);
			cursor.continue();
		}
	};
}

function handle(e) {
	const t = e.target;

	if (t.tagName === 'A') moveItem(t);
	else {
		deleteItem(t.parentNode);
		deleteData(t.parentNode);
	}
}

function deleteData(item) {
	const id = Number(item.getAttribute('item-id'));

	const transaction = db.transaction(['items'], 'readwrite');
	const objectStore = transaction.objectStore('items');
	objectStore.delete(id);

	transaction.onerror = () => {
		throw new Error('Database transaction failed');
	};
}

function deleteItem(item) {
	item.parentNode.removeChild(item);
}

function moveData(item) {
	const id = Number(item.getAttribute('item-id'));

	const transaction = db.transaction(['items'], 'readwrite');
	const objectStore = transaction.objectStore('items');
	const request = objectStore.get(id);

	request.onsuccess = () => {
		const oldItem = request.result;

		oldItem.status = (oldItem.status + 1) % 2;

		objectStore.put(oldItem);

		renderItem(oldItem);
	};

	transaction.onerror = () => {
		throw new Error('Database transaction failed');
	};
}

function moveItem(oldItem) {
	moveData(oldItem);
	deleteItem(oldItem);
}

function addData(text) {
	const transaction = db.transaction(['items'], 'readwrite');
	const objectStore = transaction.objectStore('items');

	const tmpItem = {
		value: text,
		status: 0,
	};
	const request = objectStore.add(tmpItem);

	request.onsuccess = (e) => {
		const newItem = {
			id: e.target.result,
			value: text,
			status: 0,
		};
		renderItem(newItem);
	};

	transaction.onerror = () => {
		throw new Error('Database transaction failed');
	};
}

/**
 * Whether string has value.
 *
 * @return {bool}
 */
function IsEmpty(text) {
	return !(text.trim());
}

function addItem() {
	const text = document.getElementById('newItem').value;

	if (IsEmpty(text)) {
		document.getElementById('error').innerText = 'This field cannot be empty';
		return;
	}

	document.getElementById('error').innerText = '';
	document.getElementById('newItem').value = '';

	addData(text);
}

/**
 * Whether a task has been completed
 *
 * @param {string} status
 * @return {bool}
 */
function IsCompleted(status) {
	if (status === 0) return false;

	return true;
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

	if (IsCompleted(itemStatus)) {
		newItem.className = 'list-group-item list-group-item-action list-group-item-success d-flex justify-content-between align-items-center';
	} else {
		newItem.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
	}

	const list = document.getElementById(Number(itemStatus));

	list.insertBefore(newItem, list.firstChild);
}
