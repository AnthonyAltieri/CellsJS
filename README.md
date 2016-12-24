# CellsJS
### A library for the creation, modification, and transformation of matrices of data.
  
  
##### When to use this library
If you have data that you need to display in a table format on your UI or use in some form in your computations. This library is perfect for representing Non-SQL based data in a table-like format for use in your UI.
  
##### How to us this library
1. First get an array of objects from whatever storage you are using
2. Determine what the column titles should be on your table and if any particular object of data does not have data for that column, determine what the default value should be
3. (optional) determine the order of your column titles

With this information in hand, the rest of the process is simple. Create an object that will represent your default values that has a key for every column title and that key's value corresponds to the default value for that column title.  
```javascript
var defaults = {
    name: 'John Doe',
    major: 'Undeclared',
    age: -1,
}
```
Next query all of the data you would like to be in the table from whatever storage you are using and store it in a variable.
```javascript
var users = [
  { 
    name: 'Anthony',
    age: 22,
    major: 'Computer Science',
  },
  {
    name: 'John',
    major: 'Political Science',
  },
  {
    age: 12,
    major: 'Biology',
  },
]
```
Now all you have to do is create a Cells Matrix using the `Cells(data, defaults, order)` function wher `order` is optional. There are a couple ways to do this: the first being to not specify an order in the third parameter of the function this will just use the order of the keys in defaults, the second way is to provide a function that takes two parameters of the same type and return a number `(T, T) => number` 1 for the first T param goes before the second param -1 if the second T param goes before the first T param and 0 if they are equal, the last way to provide an order is give an array of column titles less than or equal to the amount of column titles in defaults that will be used to provide as much ordering as possible.
```javascript
// First way to do order, none at all
var cellsMatrix = Cells(users, defaults);

// Second way to do order, this will sort by alphabetical order
var cellsMatrix = Cells(users, defaults, function(lhs, rhs) {
    if (lhs < rhs) return 1;
    if (rhs < lhs) return -1;
    return 0;
});

// Third way to do order, this will make the order: age, major, name
var cellsMatrix = Cells(users, defaults, ['age', 'major', 'name']);

// Third way to do order again, this will make sure age is first, and the last two
// column titles will be whatever order default's keys make them
var cellsMatrix = Cells(users, defaults, ['age']);
```
You can sort the columns at any time by using the `sortColumn(cellsMatrix, colIndex, funct)` function that returns a new cellsMatrix that has sorted the columns (first being at the top of the table) in the order that the sorting function `funct` provided has determined.  
  
  You can sort the order of columns on the cellMatrix by using `changeColumnOrdering(cellsMatrix, order)` which returns a new cellsMatrix that corresponds to the `order` provided as the second parameter, `order` works the same way here as it did with the `Cells` function.
