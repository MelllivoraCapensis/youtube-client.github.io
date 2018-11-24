export default function makeSearchBox() {
  const searchBox = document.createElement('div');
  searchBox.id = 'searchBox';
  const searchField = document.createElement('input');
  searchField.id = 'searchField';
  searchBox.appendChild(searchField);
  const searchButton = document.createElement('input');
  searchButton.type = 'button';
  searchButton.value = 'Искать';
  searchButton.id = 'searchButton';
  searchBox.appendChild(searchButton);
  document.body.appendChild(searchBox);
}
