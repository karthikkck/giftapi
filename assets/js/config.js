var myapp = (function(myapp) {
	myapp.settings = {
		//global settings
		apiKeywords: {
			//women: ['Clothing', 'Shoes', 'Boots', 'Sneakers', 'Athletic Shoes', 'Dresses'],
			women: ['Clothing', 'Shoes', 'Accessories', 'Eyewear', 'Bags', 'Watches', 'Sporting Goods', 'Beauty', 'Jewelry', 'Electronics'],
			//men: ['Clothing', 'Shoes', 'Sneakers', 'Athletic Shoes', 'Boots', 'Jeans'],
			men: ['Clothing', 'Shoes', 'Accessories', 'Eyewear', 'Bags', 'Watches', 'Sporting Goods', 'Beauty', 'Jewelry', 'Electronics'],
			//kids: ['Girls', 'Clothing Boys', 'Clothing Girls', 'Shoes Boys', 'Shoes'],
			kids: ['Clothing', 'Shoes', 'Baby Shop', 'Housewares', 'Accessories', 'Eyewear', 'Bags', 'Watches', 'Sporting Goods', 'Beauty', 'Jewelry', 'Electronics'],
			special: ['Fashion', 'Shop', 'Golf', 'Outdoor', 'Rideshop', 'Running', 'Shop By', 'Wedding', 'Western']
		},
		apiKey: 'a73121520492f88dc3d33daf2103d7574f1a3166',
		searchApiUrl: 'http://api.zappos.com/Search',
		budgetVariation: "10",
		currency: { country: 'United States', symbol: '$', name: 'dollars' },
	};

	myapp.library = {
		randomizedArray: function(arrLength) {
			var arr = [], i;
			for (i = 0; i < arrLength; i++) {
				arr[i] = i;
			}

			arr.sort(function () {
				return Math.random() - 0.5;
			});
			return arr;
		}
	};
	return myapp;

}({}));
