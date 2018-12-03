// 3.1 map
// 3.2 filter
// 3.3 find
// 3.4 findIndex
// 3.5 bValue
// 3.6 bmatch (object, match, bmatch)
// 3.7 some, every만들기

const map = (list, mapper) => {
  const newList = [];
  for (let item of list) {
    newList.push(mppaer(item));
  }
  return newList;
};

const filter = (list, predicate) => {
  const newList = [];
  for (let item of list) {
    if (predicate(item)) newList.push(item);
  }
  return newList;
};
