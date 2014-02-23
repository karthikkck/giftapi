(function(myapp) {
	$.extend(myapp, {

		types: ['women', 'men', 'kids'],

		show: function(count, budget) {
			var i, key, tmp;

			key = count + "-" + budget;
			this.data = $.jStorage.get(key);
			if(!this.data) {
				this.data = {};

				for(i = 0; i < this.types.length; i++) {
					this.fetchData(count, budget, this.types[i]);
				}
			} else {
				console.log(this.data);
				this.displayResult(this.data[key], count);
			}
		},

		displayResult: function(data, count) {
			var randomIndex, i, actualData, tmp,
			displayData = {}, totalPrice, html = '';

			for(j=0; j<this.types.length; j++) {
				totalPrice = 0;
				actualData = data[this.types[j]];
				randomIndex = this.library.randomizedArray(actualData.currentResultCount);
				displayData.category = actualData.originalTerm;
				displayData.products = [];
				for(i=0; i<count; i++) {
					tmp = actualData.results[randomIndex[i]];
					displayData.products.push(tmp);
					totalPrice = totalPrice + parseFloat(tmp.price.substring(1));
				}

				tmp = displayData.products.length;
				if(tmp == 0) {
					displayData.message = "OOPS!! our system could not find any package for you. please try changing your budget and count.";
				} else if(tmp < count) {
					displayData.message = "AFRAID!! our system could not find as many products as you want. Try playing around with your budget and count.";
				}

				displayData.totalPrice = this.settings.currency.symbol + totalPrice;

				html += $.Mustache.render('Product-list-template', displayData);

			}
			$('#Packs').html(html);
		},

		fetchData: function(count,budget, type) {
			var i = 0, j =0, url, tmp, that = this;

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

				tmp = (budget*that.settings.budgetVariation)/100;
				priceRange = Math.ceil(tmp/count);

				priceRangeString = '"' + budget + '"';
				for(i=0; i < Math.ceil(priceRange/2); i++) {
					priceRangeString += ',"' + (budget-i-1) + '"';
					priceRangeString += ',"' + (budget+i+1) + '"';
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
			});
		}
	});

}(myapp || {}));
