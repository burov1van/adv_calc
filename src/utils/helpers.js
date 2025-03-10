// src/utils/helpers.js
export function getBusinessObjectByName(name, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].name === name) return arr[i];
      if (arr[i].options) {
        const found = getBusinessObjectByName(name, arr[i].options);
        if (found) return found;
      }
    }
    return null;
  }
  