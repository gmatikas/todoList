window.onload = () => {
	const addButton = document.getElementById('add');
	addButton.addEventListener('click', () => { addItem(); }, false);
};

function handle(e) {
	const t = e.target;

	if (t.tagName === 'A') moveItem(t);
	else deleteItem(t.parentNode);
}

function deleteItem(item) {
	item.parentNode.removeChild(item);
}

function moveItem(oldItem) {
	const text = oldItem.innerText;
	const stat = Number(oldItem.parentNode.id);

	deleteItem(oldItem);

	const newItem = { value: text, status: (stat + 1) % 2 };
	renderItem(newItem);
}

function addItem() {
	const text = document.getElementById('newItem').value;

	if (text === '')
		document.getElementById('error').innerText = 'This field cannot be empty';
	else {
		document.getElementById('error').innerText = '';
		document.getElementById('newItem').value = '';

		const newItem = { value: text, status: 0 };
		renderItem(newItem);
	}
}

function renderItem(item) {
	const text = item.value;
	const stat = item.status;

	const newItem = document.createElement('a');
	newItem.href = '#';
	newItem.addEventListener('click', (e) => { handle(e); }, false);

	const textNode = document.createTextNode(text);
	newItem.appendChild(textNode);

	const deleteIcon = document.createElement('span');
	deleteIcon.className = 'fa fa-remove text-danger';
	newItem.appendChild(deleteIcon);

	if (stat === 0)
		newItem.className = 'list-group-item list-group-item-action list-group-item-success d-flex justify-content-between align-items-center';
	else
		newItem.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';

	const list = document.getElementById(stat);

	list.insertBefore(newItem, list.firstChild);
}
