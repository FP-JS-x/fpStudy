// {
//    city: "New York"
//    growth_from_2000_to_2013: "4.8%"
//    latitude: 40.7127837
//    longitude: -74.0059413
//    population: "8405837"
//    rank: "1"
//    state: "New York"
//  }
const data = require("./data.js");
// 1. filter함수형을 통해서 city 가 B로 시작하는 함수를 만드시오
function _filter(list, predicate, regexr) {
	let newList = []
	for (i = 0, len = list.length; i < len; i++) {
		if (predicate(list[i], regexr)) newList.push(list[i]);
	}
	return newList;
}
function getName_Regexr(obj, regexr) {
	if (obj.city.match(regexr)) return obj;
	return null;
}
let filterByName = _filter(data, getName_Regexr, (/^[B]\w+/g));
// 2. fileter한 B로 시작하는 도시 데이터 중에서 pouplation 정보만 뽑아오는 filter-> map함수를 만들어 주세요
function map(list, iteratee) {
	var new_list = [];
	for (let i = 0, len = list.length; i < len; i++) {
		new_list.push(iteratee(list[i]));
	}
	return new_list;
};
_map(filter)
// 3. bValues를 이용하여 'S'로 시작하는 도시 중에 성장률만 뽑아내주세요

// 4. findIndex를 이용해서 matchData와 match되는 Idx를 구하시오
const matchData = {
	growth_from_2000_to_2013: "20.2%",
	latitude: 35.4675602
};
	// 5. 도시 데이터 중에서 중에서 B로 시작하는 도시 중에
	//growth_from_2000_to_2013 성장률이 양수인 도시들 중에 rank가 모두 20보다 큰지
	// every함수를 통해서 만들어 보시오 !