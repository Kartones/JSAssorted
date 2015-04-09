/* http://madivachallenge.appspot.com */
(function firstChallenge() {
	var isBlack = function(node) {
		// Solution for webkit only
		return document.defaultView.getComputedStyle(node, null).getPropertyValue("color") == "rgb(0, 0, 0)";
	};
	var total = 0;
	var number_nodes = [];
	var i, len, number, nodes;

	nodes = document.querySelectorAll("span");
	for (i = 0, len = nodes.length; i < len; i++) {
		if (nodes[i].childNodes.length > 1) {
			number = null;
			if (nodes[i].childNodes[0].childNodes.length > 0 && isBlack(nodes[i].childNodes[0])) {
				number = parseInt(nodes[i].childNodes[0].innerHTML.trim(), 10);
			} else {
				if (nodes[i].childNodes[1].childNodes.length > 0 && isBlack(nodes[i].childNodes[1])) {
					number = parseInt(nodes[i].childNodes[1].innerHTML.trim(), 10);
				}
			}
			if (number !== null && number % 2 === 1)
			{
				number_nodes.push(number);
			}
		}
	}

	return number_nodes.reduce(function(prev, current, index, items) {
	  return (prev + current);
	}, 0);
})();