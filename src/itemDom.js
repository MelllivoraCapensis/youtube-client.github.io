export default (item) => {
  const itemDom = document.createElement('div');
  itemDom.classList.add('itemDom');
  const titleLink = document.createElement('a');
  titleLink.href = `https://youtube.com/watch?v=${item.id}`;
  titleLink.innerHTML = item.title;
  titleLink.target = '_blank';
  titleLink.classList.add('itemTitle');
  itemDom.appendChild(titleLink);
  const image = document.createElement('img');
  image.src = item.imageUrl;
  image.classList.add('itemImage');
  itemDom.appendChild(image);
  const channel = document.createElement('div');
  channel.classList.add('itemChannel');
  channel.innerHTML = 'Канал: ' + item.channelTitle;
  itemDom.appendChild(channel);
  const description = document.createElement('p');
  description.innerHTML = item.description.slice(0, 160);
  description.classList.add('itemDescription');
  itemDom.appendChild(description);
  const viewCount = document.createElement('div');
  viewCount.classList.add('itemViewCount');
  const formatter = new Intl.NumberFormat('ru');
  viewCount.innerHTML = formatter.format(item.viewCount);
  itemDom.appendChild(viewCount);
  const link = document.createElement('a');
  link.classList.add('itemButton');
  link.innerHTML = 'Перейти';
  link.href = `https://youtube.com/watch?v=${item.id}`;
  link.target = '_blank';
  itemDom.appendChild(link);
  return itemDom;
};
