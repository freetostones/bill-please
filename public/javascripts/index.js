function search() {
  query = document.getElementById("searchQuery").value;
  sort = document.getElementById("sortType").value;

  var request = new XMLHttpRequest();
  request.open('POST', '/search', true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send(data, sort);
};
