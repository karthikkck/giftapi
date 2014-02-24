var myapp = (function(myapp) {
	myapp.settings = {
		//global settings
		//these are used as search and filter terms
		apiKeywords: {
			women: ['Clothing', 'Shoes', 'Accessories', 'Eyewear', 'Bags', 'Watches', 'Sporting Goods', 'Beauty', 'Jewelry', 'Electronics'],
			men: ['Clothing', 'Shoes', 'Accessories', 'Eyewear', 'Bags', 'Watches', 'Sporting Goods', 'Beauty', 'Jewelry', 'Electronics'],
			kids: ['Clothing', 'Shoes', 'Baby Shop', 'Housewares', 'Accessories', 'Eyewear', 'Bags', 'Watches', 'Sporting Goods', 'Beauty', 'Jewelry', 'Electronics'],
		},

		//zappos apikey
		apiKey: 'a73121520492f88dc3d33daf2103d7574f1a3166',
		searchApiUrl: 'http://api.zappos.com/Search',
		//represents the percentage threshold (lower 10% and upper 10%) on users budget
		budgetVariation: "10",
		//currency display type, can be set from backend when application loads
		currency: { country: 'United States', symbol: '$', name: 'dollars' },
	};

	//global library functions used in the application
	myapp.library = {
		//generates an array of numbers in a range 0 - arrLength
		//returns the array in randomly sorted order
		//used to get random products from list without repetition
		randomizedArray: function(arrLength) {
			var arr = [], i;
			for (i = 0; i < arrLength; i++) {
				arr[i] = i;
			}

			//sort the array in random order
			arr.sort(function () {
				return Math.random() - 0.5;
			});
			return arr;
		}
	};
	return myapp;

}({}));
