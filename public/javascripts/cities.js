// = io.connect('http://localhost:3000');
//console.log(socket);
//socket.on('news', function (data) {
///	console.log(data);
//	
//});

$(document).ready(function() {

	var opts = {
		lines: 15, // The number of lines to draw
		length: 0, // The length of each line
		width: 3, // The line thickness
		radius: 4, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		color: '#fff', // #rgb or #rrggbb
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: '2px', // Top position relative to parent in px
		left: '0px', // Left position relative to parent in px
		paddingRight: '10px'
	};
	
	$('#new-game').on('click', function() {
		if ($.socketGet() == null && !$(this).hasClass('disabled')) {
			$(this).addClass('disabled').children('i').hide();
			$(this).prepend(
				$('<span>')
				.attr('id', 'new-game-spin')
				);
			$('#new-game-spin').spin(opts);
			startGameMsg('Connecting to server');
			$.socketConnect('http://localhost:3000', function(data) {
				socket = data;
				startGameMsg('Creating Game');
				
				// socket listeners
				socket.on('game created', function(data) {
					console.log(data);
					startGameMsg('Game Created!');
				});

				socket.emit('new game');
			});
		}
	});

	function startGameMsg(s) {
		$('#new-game-modal .modal-body p').text(s);
	}
});

(function($) {
	var socket = null;

	$.socketGet = function() {
		return socket;
	}

	$.socketConnect = function(server, callback) {
		socket = io.connect(server);
		console.log(socket);
		callback(socket);
	}

	$.socketCreateRoom = function(callback) {

	}
})(jQuery);