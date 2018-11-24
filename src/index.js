import './css/style.css';
import makeSearchBox from './searchBox';
import ItemsBoxObj from './itemsBox';

makeSearchBox();
const searchField = document.getElementById('searchField');
const searchButton = document.getElementById('searchButton');
const sliderContainer = document.createElement('div');
document.body.appendChild(sliderContainer);
searchButton.onclick = () => {
  sliderContainer.innerHTML = '';
  const itemsBox = new ItemsBoxObj(searchField.value);
  sliderContainer.appendChild(itemsBox.itemsBoxDom);
  itemsBox.makeRequest();
};

