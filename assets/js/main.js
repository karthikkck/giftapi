(function(myapp) {
	$.extend(myapp, {

		types: (function() {
			return Object.keys(myapp.settings.apiKeywords);
		}()),

		show: function(count, budget) {
			var i, key, tmp, that = this;

			key = count + "-" + budget;

			function showCallback(types) {
				console.log(that.data);
				that.displayResult(that.data[key], count, types);
			};

			//fetch data from localstorage
			if(!this.data || !this.data[key])
				this.data = $.jStorage.get(key);

			if(!this.data) {
				this.data = {};
				for(i = 0; i < this.types.length; i++) {
					this.fetchData(count, budget, this.types[i], showCallback);
				}
			} else {
				showCallback();
			}
		},

		displayResult: function(data, count, types) {
			var randomIndex, i, actualData, tmp,
			displayData = {}, totalPrice, html = '';

			types = types || this.types;

			for(j=0; j<types.length; j++) {
				totalPrice = 0;
				actualData = data[types[j]];
				randomIndex = this.library.randomizedArray(actualData.currentResultCount);
				displayData.category = actualData.originalTerm;
				displayData.products = [];
				for(i=0; i < count && i < randomIndex.length; i++) {
					tmp = actualData.results[randomIndex[i]];
					displayData.products.push(tmp);
					totalPrice = totalPrice + parseFloat(tmp.price.substring(1));
				}

				tmp = displayData.products.length;
				if(tmp == 0) {
					displayData.message = "OOPS!! our system could not find any package for you in this category. please try changing your budget and count.";
				} else if(tmp < count) {
					displayData.message = "AFRAID!! our system could not find as many products as you want. Try playing around with your budget and count.";
				}

				displayData.totalPrice = this.settings.currency.symbol + totalPrice;

				html = $.Mustache.render('Product-list-template', displayData);

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

		fetchData: function(count,budget, type, showCallback) {
			var i = 0, j =0, url, tmp, that = this,
				eachProductPrice = Math.ceil(budget/count);

			function getData(term) {
				var priceRange, tmp, priceRangeString, productTypeString,

				productTypeString = '';
				tmp = that.settings.apiKeywords[term];
				for(i=0; i < tmp.length; i++) {
					if(i != 0)
						productTypeString += ',"' + tmp[i] + '"';
					else
						productTypeString += '"' + tmp[i] + '"';
				}

				tmp = (eachProductPrice*that.settings.budgetVariation)/100;
				priceRange = Math.ceil(tmp/count);

				priceRangeString = '"' + eachProductPrice + '"';
				for(i=0; i < Math.ceil(priceRange/2); i++) {
					priceRangeString += ',"' + (eachProductPrice-i-1) + '"';
					priceRangeString += ',"' + (eachProductPrice+i+1) + '"';
				}

				return $.get(that.settings.searchApiUrl, {term:term,limit:100,filters:'{"productTypeFacet":[' + productTypeString + '], "priceSort":[' + priceRangeString + ']}',key:that.settings.apiKey}, null, 'jsonp');
			}

			$.when(
				getData(type)
			).done(function(data){
				var key;
				console.log(data);
				key = count + "-" + budget;
				that.data[key] = that.data[key] || {};
				that.data[key][data.originalTerm] = data;
				$.jStorage.set(key, that.data, { ttl: 86400000 });
				showCallback([data.originalTerm]);
			});
		}
	});

}(myapp || {}));
