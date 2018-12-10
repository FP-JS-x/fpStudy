var users = [
	{ id: 1, name: "ID", age: 32 },
	{ id: 2, name: "HA", age: 25 },
	{ id: 3, name: "BJ", age: 32 },
	{ id: 4, name: "PJ", age: 28 },
	{ id: 5, name: "JE", age: 27 },
	{ id: 6, name: "JM", age: 32 },
	{ id: 7, name: "HI", age: 24 }
];
// 1-6 filter 예제
function filter(list, predicate) {
	var new_list = [];
	for (var i = 0, len = list.length; i < len; i++) {
		if (predicate(list[i])) new_list.push(list[i]);
	}
	return new_list;
};
// 1-8 map 
function map(list, iteratee) {
	var new_list = [];
	for (let i = 0, len = list.length; i < len; i++) {
		new_list.push(iteratee(list[i]));
	}
	return new_list;
};
// 1-13 bvalue
function bValue(key) {
	return function (obj) {
		return obj[key];
	}
};
// 1-23 find 
function find(list, predicate) {
	for (let i = 0, len = list.length; i < len; i++) {
		if (predicate(list[i])) return list[i];
	}
};
// 1-27 object, match, bmatch
function object(key, val) {
	let obj = {};
	obj[key] = val;
	return obj;
};
function match(obj, obj2) {
	for (let key in obj2) {
		if (obj[key] !== obj2[key]) return false;
	}
	return true;
};
function bMatch(obj2, val) {
	if (arguments.length === 2) obj2 = object(obj2, val);
	return function (obj) {
		return match(obj, obj2);
	}
}
//1-28 findIndex
function findIndex(list, predicate) {
	for (let i = 0, len = list.length; i < len; i++) {
		if (predicate(list[i])) return i;
	}
	return -1;
}
//1-31 indentity
let indentity = (v) =>  v; 
// compose
let compose = function () {
	var args = arguments;
	var start = args.length - 1;
	return function () {
		var i = start;
		var result = args[start].apply(this, arguments);
		while (i--) result = args[i].call(this, result);
		return result;
	};
};
var greet = function (name) { return "hi: " + name; };
var exclaim = function (statement) { return statement.toUpperCase() + "!"; };
var welcome = compose(greet, exclaim);
console.log( welcome("moe") );
