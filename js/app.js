
$(document).ready( function() {
	$('.inspiration-getter').submit( function(e){
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var answerers = $(this).find("input[name='answerers']").val();
		getTopAnswerers(answerers);
	});
});


// this function takes the question object returned by the StackOverflow request
// and returns new result to be appended to DOM
var showAnswerer = function(answer) {
	
	// clone our result template code
	var result = $('.templates .answerers').clone();
	
	// Set the user image properties in the result
	var userImage = result.find('.user-image');
	userImage.attr('src', answer.user.profile_image);

	// set the user's display name property in the result
	var userName = result.find('answer.user-link');
	userName = result.find('.user-name a');
	userName.attr('href', answer.user.link);
	userName.text(answer.user.display_name);

	// set the user's reputation property in the result
	var userReputation = result.find('.user-reputation');
	userReputation.text(answer.user.reputation);

	// set the Post Count property in result
	var userPostCount = result.find('.user-postcount');
	userPostCount.text(answer.post_count);

	// set the Score Property in result
	var userScore = result.find('.user-score');
	userScore.text(answer.score);
	return result;
};
	


// this function takes the results object from StackOverflow
// and returns the number of search results for the queried tag appends it to DOM

var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query + '</strong>';
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getTopAnswerers = function(answerers) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = { 
		tag: answerers,
		site: 'stackoverflow',
	};
	
	var result = $.ajax({
		url:"http://api.stackexchange.com/2.2/tags/" + request.tag + "/top-answerers/all_time",
		data: request,
		dataType: "jsonp",//use jsonp to avoid cross origin issues
		type: "GET",
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object
		var searchResults = showSearchResults(request.tag, result.items.length);
		console.log(answerers);

		$('.search-results').html(searchResults);
		//$.each is a higher order function. It takes an array and a function as an argument.
		//The function is executed once for each item in the array.
		$.each(result.items, function(i, item) {
			var answer = showAnswerer(item);
			$('.results').append(answer);
		});
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};


