module.exports = {
	findInObjArray(array, attr, value) {
		for (let i = 0; i < array.length; i += 1) {
			if (array[i][attr] === value) {
				return i
			}
		}
		return -1
	}
}
