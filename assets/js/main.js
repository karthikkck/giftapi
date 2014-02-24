(function(myapp) {
	$.extend(myapp, {

		//types of packages to display
		//this is an array of keys of myapp.settings.apiKeywords object
		types: (function() {
			return Object.keys(myapp.settings.apiKeywords);
		}()),

		//show function - first function called after the form submission
		//count - represents the number of gifts that users wants
		//budget - represents the amount user wants to spend on "count" gifts
		show: function(count, budget) {
			var i, key, tmp, that = this;

			//key to store the data got from api into localstorage or an object
			key = count + "-" + budget;

			//callback function
			//this is called once every type of data is fetched from api
			function showCallback(types) {
				console.log(that.data);
				that.displayResult(that.data[key], count, types);
			};

			//check for the data in local object
			//if not present then check for the data in localstorage using key
			if(!this.data || !this.data[key])
				this.data = $.jStorage.get(key);

			//if it is a new call, which means no previously fetched data then
			//initiate the api calls through fetch function
			if(!this.data) {
				this.data = {};
				//fetch is called with each "type" - men, women, kids etc.
				for(i = 0; i < this.types.length; i++) {
					this.fetchData(count, budget, this.types[i], showCallback);
				}
			} else {
				//if data is present in local machine then just display it
				showCallback();
			}
		},

		//displays the data to the user - dom operation
		//data - represents the data to be displayed
		//count - represents the number of items to be displayed from each "type"
		//types - has to be an array - ["women"]
		//if types is not given, then it defaults to this.types
		displayResult: function(data, count, types) {
			var randomIndex, i, actualData, tmp,
			displayData = {}, totalPrice, html = '';

			//if types is not given, then it defaults to this.types
			types = types || this.types;

			//copy the necessary data to displayData object
			for(j=0; j<types.length; j++) {
				totalPrice = 0;
				actualData = data[types[j]];
				randomIndex = this.library.randomizedArray(actualData.currentResultCount);
				displayData.category = actualData.originalTerm;
				displayData.products = [];

				//copies the necessary number of objects
				for(i=0; i < count && i < randomIndex.length; i++) {
					tmp = actualData.results[randomIndex[i]];
					displayData.products.push(tmp);
					totalPrice = totalPrice + parseFloat(tmp.price.substring(1));
				}

				tmp = displayData.products.length;
				//if the users given number of products are not found, then display message
				if(tmp == 0) {
					displayData.message = "OOPS!! our system could not find any package for you in this category. please try changing your budget and count.";
				} else if(tmp < count) {
					displayData.message = "AFRAID!! our system could not find as many products as you want. Try playing around with your budget and count.";
				}

				//add currency symbol to the total price before display
				displayData.totalPrice = this.settings.currency.symbol + totalPrice;

				//get the html to be rendered using mustache template
				html = $.Mustache.render('Product-list-template', displayData);

				//if there is a div already for the given "type" then add the html
				//content to it
				//else create a new div with id "type" and add the content to it
				tmp = $('#Packs').find('#' + types[j]);
				if(tmp.length > 0) {
					tmp.html(html);
				} else {
					$('#Packs')
					.append('<div id="' + types[j] + '"></div>')
					.find('#' + types[j]).html(html);
				}

			}
		},

		//function that handles the api calls
		fetchData: function(count,budget, type, showCallback) {
			var i = 0, j =0, url, tmp, that = this,
				eachProductPrice = Math.ceil(budget/count);

			//getData function creates the url for the api call
			function getData(term) {
				var priceRange, tmp, priceRangeString, productTypeString,

				//creates a string with all types of product that we are looking for in api
				productTypeString = '';
				tmp = that.settings.apiKeywords[term];
				for(i=0; i < tmp.length; i++) {
					if(i != 0)
						productTypeString += ',"' + tmp[i] + '"';
					else
						productTypeString += '"' + tmp[i] + '"';
				}

				//sets a range of price for each product that we are looking for
				tmp = (eachProductPrice*that.settings.budgetVariation)/100;
				priceRange = Math.ceil(tmp/count);

				//creates a string with the product price that we are looking at
				priceRangeString = '"' + eachProductPrice + '"';
				for(i=0; i < Math.ceil(priceRange/2); i++) {
					priceRangeString += ',"' + (eachProductPrice-i-1) + '"';
					priceRangeString += ',"' + (eachProductPrice+i+1) + '"';
				}

				//returns the json data got from jsonp call - cross domain call
				return $.get(that.settings.searchApiUrl, {term:term,limit:100,filters:'{"productTypeFacet":[' + productTypeString + '], "priceSort":[' + priceRangeString + ']}',key:that.settings.apiKey}, null, 'jsonp');
			}

			//initiates api call request and a callback function once the api call is complete
			$.when(
				getData(type)
			).done(function(data){
				var key;
				console.log(data);

				//storage format data['3-150']['women']
				key = count + "-" + budget;
				that.data[key] = that.data[key] || {};
				that.data[key][data.originalTerm] = data;

				//stores the json data in local storage with a expiry time of a day
				$.jStorage.set(key, that.data, { ttl: 86400000 });

				//callback to display the data in dom
				showCallback([data.originalTerm]);
			});
		}
	});

}(myapp || {}));
