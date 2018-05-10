function search() {
  data = document.getElementById("searchQuery").value;

  var request = new XMLHttpRequest();
  request.open('POST', '/search', true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send(data);
};
