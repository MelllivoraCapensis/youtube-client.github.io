const buildSearchRequest = (requestPart, requestType, requestValue, pageToken) => {
  return `https://www.googleapis.com/youtube/v3/${requestType
  }?key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y&type=video&part=${requestPart
  }&maxResults=8&q=${requestValue}&pageToken=${pageToken}`;
};
const buildVideosRequest = (idStr, requestPart) => `https://www.googleapis.com/youtube/v3/videos?key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y&id=${
  idStr}&part=${requestPart}`;
export default (requestValue, pageToken) => {
  const result = {};
  const request = buildSearchRequest('snippet', 'search', requestValue, pageToken);
  return fetch(request).then(response => response.json()).then((json) => {
    result.pageToken = json.nextPageToken;
    result.itemsArr = json.items.map(item => ({
      title: item.snippet.title,
      description: item.snippet.description,
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      id: item.id.videoId,
      imageUrl: item.snippet.thumbnails.medium.url,
    }));
    const idStr = result.itemsArr.reduce((str, item, ind) => {
      str += (ind === 0 ? '' : ',') + item.id;
      return str;
    }, '');
    const request = buildVideosRequest(idStr, 'snippet,statistics');
    return fetch(request);
  }).then(response => response.json())
    .then((json) => {
      const items = json.items;
      result.itemsArr.forEach((item, ind) => {
        item.viewCount = items[ind].statistics.viewCount;
      });
      return result;
    });
};
