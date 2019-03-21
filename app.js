function addItem() {
	const input = document.getElementById('newItem').value;
	const inputText = document.createTextNode(input);

	const item = document.createElement('a');
	item.href = '#';
	item.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
	item.appendChild(inputText);

	const del = document.createElement('span');
	del.className = 'fa fa-remove text-danger';
	item.appendChild(del);

	const todoList = document.getElementById('todo');
	todoList.insertBefore(item, todoList.firstChild);
	document.getElementById('newItem').value = '';
}

function moveItem(old) {
	const value = old.innerText;
	const text = document.createTextNode(value);

	const item = document.createElement('a');
	item.href = '#';
	item.appendChild(text);

	const del = document.createElement('span');
	del.className = 'fa fa-remove text-danger';
	item.appendChild(del);

	const list = old.parentNode.id;

	if (list === 'todo') {
		const compList = document.getElementById('completed');
		item.className = 'list-group-item list-group-item-action list-group-item-success d-flex justify-content-between align-items-center';
		compList.insertBefore(item, compList.firstChild);
	} else {
		const todoList = document.getElementById('todo');
		item.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
		todoList.insertBefore(item, todoList.firstChild);
	}

	old.parentNode.removeChild(old);
}
