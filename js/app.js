
// this function takes the question object returned by the StackOverflow request
// and returns new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the .viewed for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" '+
		'href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
		question.owner.display_name +
		'</a></p>' +
		'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};


// this function takes the results object from StackOverflow
// and returns the number of results and tags to be appended to DOM
var showSearchResultsQ = function(query, resultNum) {
	var results = resultNum + ' Unanswered Questions for the tag, <strong>' + query + '</strong>';
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
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = { 
		tagged: tags,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'
	};
	
	$.ajax({
		url: "https://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",//use jsonp to avoid cross origin issues
		type: "GET",
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object
		var searchResults = showSearchResultsQ(request.tagged, result.items.length);

		$('.search-results').html(searchResults);
		//$.each is a higher order function. It takes an array and a function as an argument.
		//The function is executed once for each item in the array.
		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};


$(document).ready( function() {
	$('.unanswered-getter').submit( function(e){
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);

	})

	$('.inspiration-getter').submit( function(e){
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var answerers = $(this).find("input[name='answerers']").val();
		getTopAnswerers(answerers);
	})
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

	// set the Score Property in result
	var userAccept = result.find('.user-accept');
	userAccept.text(answer.user.accept_rate);
	console.log(answer.user.accept_rate);

	return result;


};
		



// this function takes the results object from StackOverflow
// and returns the number of search results for the queried tag appends it to DOM

var showSearchResults = function(query, resultNum) {
	var results = 'Here are the top ' + resultNum + ' Answerers for the tag, <span style="color: #f27700;"><strong>' + query + '</strong></span>';
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
	var cheese = { 
		tag: answerers,
		site: 'stackoverflow',
	};
	
	var result = $.ajax({
		url:"https://api.stackexchange.com/2.2/tags/" + cheese.tag + "/top-answerers/all_time",
		data: cheese,
		dataType: "jsonp",//use jsonp to avoid cross origin issues
		type: "GET",
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object
		var searchResults = showSearchResults(cheese.tag, result.items.length);

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


