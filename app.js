function handle(e) {
	const t = e.target;
	if (t.tagName === 'A') moveItem(t);
	else deleteItem(t);
}

function deleteItem(item) {
	const parent = item.parentNode;
	parent.parentNode.removeChild(parent);
}

function moveItem(oldItem) {
	const newItem = document.createElement('a');
	newItem.href = '#';
	newItem.addEventListener('click', (e) => { handle(e); }, false);

	const text = oldItem.innerText;
	const textNode = document.createTextNode(text);
	newItem.appendChild(textNode);

	const deleteIcon = document.createElement('span');
	deleteIcon.className = 'fa fa-remove text-danger';
	newItem.appendChild(deleteIcon);

	const oldList = oldItem.parentNode.id;

	if (oldList === 'todo') {
		const newList = document.getElementById('completed');
		newItem.className = 'list-group-item list-group-item-action list-group-item-success d-flex justify-content-between align-items-center';
		newList.insertBefore(newItem, newList.firstChild);
	} else {
		const newList = document.getElementById('todo');
		newItem.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
		newList.insertBefore(newItem, newList.firstChild);
	}

	oldItem.parentNode.removeChild(oldItem);
}

function addItem() {
	const text = document.getElementById('newItem').value;

	if (text === '')
		document.getElementById('error').innerText = 'This field cannot be empty';
	else {
		document.getElementById('error').innerText = '';

		const newItem = document.createElement('a');
		newItem.href = '#';
		newItem.addEventListener('click', (e) => { handle(e); }, false);
		newItem.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';

		const textNode = document.createTextNode(text);
		newItem.appendChild(textNode);

		const deleteIcon = document.createElement('span');
		deleteIcon.className = 'fa fa-remove text-danger';
		newItem.appendChild(deleteIcon);

		const todoList = document.getElementById('todo');
		todoList.insertBefore(newItem, todoList.firstChild);
		document.getElementById('newItem').value = '';
	}
}

const addButton = document.getElementById('add');
addButton.addEventListener('click', () => { addItem(); }, false);
