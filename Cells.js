/**
 * @author Anthony Altieri on 12/21/16.
 */

/**
 * Creates a matrix of cells that represent your data
 *
 * @param dataList {object[]} a list of objects containing the data you would
 * like to display
 * @param defaults {object} an object whose keys correspond to the column
 * titles that you are to display, the value of those keys are the default
 * value for that column
 * @param order {string[] | (`a, `a) => `a list} either a function
 * that will be used with the Array.prototype.sort() function to sort the
 * column titles or an array of column titles that are less than or equal to
 * the amount of columns displayed if it is less that the ordering given will
 * be used until it is satiated then it will be the order of the default keys
 * if it is the same length it will use the order provided in order
 */
export function Cells(dataList, defaults, order) {
  // Make sure the type of order is not string
  if (typeof order === 'string') {
    throw new Error('order can\'t be of type `string`');
  }
  // Helper function that determines if an element is in a list
  const notInList = (list, element) => !list.filter(e => e === element)[0];
  // Helper function that returns the elements in a refList not in a list
  const elementsNotInRefList = (list, refList) => refList.reduce((a, c) => (
    notInList(list, c) ? [...a, c] : a
  ), []);
  const defaultKeys = Object.keys(defaults);
  let sortedDefaultKeys = [...defaultKeys];
  // If there is an order of columns use it, otherwise
  // just use the order of defaultKeys
  if (typeof order !== 'undefined') {
    // If a function was passed in to do ordering, apply it to
    // defaultKeys, otherwise use the list of keys to order
    if (typeof order === 'function') {
      sortedDefaultKeys = defaultKeys.sort(order);
    } else {
      let keysSorted = [];
      order.forEach((columnTitle) => {
        // If the column title in the ordering is not in the
        // defaults throw an error
        if (notInList(defaultKeys, columnTitle)) {
          throw new Error(`column title ${columnTitle}`
            + ' is not in defaults'
          );
        }
        sortedDefaultKeys = [...sortedDefaultKeys, columnTitle];
        keysSorted = [...keysSorted, columnTitle];
      });
      // If there are less column titles in order then there are
      // keys in default, just use defaultKeys to fill in the
      // rest of the order
      if (keysSorted.length < defaultKeys.length) {
        defaultKeys.forEach((key) => {
          if (notInList(keysSorted, key)) {
            keysSorted = [...keysSorted, key];
          }
        })
      }
      sortedDefaultKeys = keysSorted;
    }
  }
  // Create a header array
  const header = sortedDefaultKeys.map((k) => ({
    title: k,
    defaultValue: defaults[k],
  }));
  // Start the matrix creation by adding in the header first
  let matrix = [header];
  // Go through each data object and add it to the matrix
  dataList.forEach((data) => {
    // Determine which fields data does not contain values for
    const dataKeys = Object.keys(data);
    if (dataKeys.length > sortedDefaultKeys.length) {
      const extraKeys = elementsNotInRefList(sortedDefaultKeys, dataKeys);
      throw new Error('You have extra keys: ' + extraKeys
        + ' in your data that are not in your defaults'
      );
    }
    const defaultsNotInData = elementsNotInRefList(
      dataKeys,
      sortedDefaultKeys
    );
    // Fills in those default values
    defaultsNotInData.forEach((key) => {
      data = {...data, [key]: defaults[key]};
    });
    // If There is a value with null, make sure that the default for that
    // key is supposed to be null, if it isn't put in the default
    dataKeys.forEach((key) => {
      const value = data[key];
      if (value === null && defaults[key] !== null) {
        data[key] = defaults[key];
      }
    });
    const row = sortedDefaultKeys.reduce((a, k) => ([
      ...a,
      data[k],
    ]), []);
    matrix = [...matrix, row];
  });
  return matrix;
}

/**
 * Sort a column with a sorting function
 *
 * @param cellsMatrix {object[]} a matrix created with the Cells function
 * @param colIndex {number} the index number you want to sort in reference to
 * @param funct {(`a, `a) => number} a function that takes two elements as
 * parameters (lhs, rhs) of the same type; returns -1 if lhs is before rhs in
 * the list, returns 1 if rhs is before lhs in the list, and returns 0 if they
 * are the same
 * @returns {*[]}
 */
export function sortColumn(cellsMatrix, colIndex, funct) {
  // Throw an error if funct is not a function
  if (typeof funct !== 'function') {
    throw new Error('parameter `funct` must be a function');
  }
  // Extract the header from the cellsMatrix
  const header = cellsMatrix.slice(0, 1);
  // Throw an error if the column index is out of bounds
  if (colIndex > header.length - 1) {
    throw new Error('The index of the column you want to sort should '
      + 'not be longer then the amount of columns you have');
  }
  // Extract the content (ie. cellsMatrix without header)
  const content = cellsMatrix.slice(1);
  // Sort the content using the passed in function
  const sortedContent = content
    .slice(0)
    .sort((lhs, rhs) => {
      const lhsVal = lhs[colIndex];
      const rhsVal = rhs[colIndex];
      const sorted = [lhsVal, rhsVal].sort(funct);
      if (sorted[0] === lhsVal) {
        return -1;
      }
      if (sorted[0] === rhsVal) {
        return 1;
      }
      return 0;
    });
  return [header, ...sortedContent];
}

/**
 * Returns a list of the titles to the matrix columns
 *
 * @param cellsMatrix {object[]} a matrix created by the Cells function
 * @returns {string[]}
 */
export function getColumnTitles(cellsMatrix) {
  return cellsMatrix
    .slice(0, 1)[0]
    .map((headerObject) => headerObject.title);
}

/**
 * Returns a list of all of the data objects passed in to create the matrix
 *
 * @param cellsMatrix {object[]} a matrix created by the Cells function
 * @returns {*}
 */
export function getData(cellsMatrix) {
  return cellsMatrix
    .slice(1, cellsMatrix.length);
}

/**
 * Changes the order of the columns on a cellsMatrix
 *
 * @param cellsMatrix {object[]} a matrix created by the Cells function
 * @param order {string[] | (`a, `a) => `a list} either a function
 * that will be used with the Array.prototype.sort() function to sort the
 * column titles or an array of column titles that are less than or equal to
 * the amount of columns displayed if it is less that the ordering given will
 * be used until it is satiated then it will be the order of the default keys
 * if it is the same length it will use the order provided in order
 * @returns {object[]} a new matrix with the applied ordering
 */
export function changeColumnOrdering(cellsMatrix, order) {
  const defaults = cellsMatrix
    .slice(0, 1)[0]
    .reduce((a, c) => ({...a, [c.title]: c.defaultValue }), {});
  return Cells(getData(cellsMatrix), defaults, order);
}





