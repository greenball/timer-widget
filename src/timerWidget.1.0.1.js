(function($, undefined) {

	/**
	 * Greenball/timerWidget published under MIT license.
	 * @package https://github.com/greenball/timerWidget
	 * 
	 * The widget an extension for the Greenball/counterWidget it's required for this widget to work.
	 * @package https://github.com/greenball/counterWidget
	 *
	 * Initialized CSS classes: .ui-timerWidgetMain
	 * 
	 * Events: create, fStart, refresh, fStop, destroy
	 *
	 * @example  $('#time-left').timerWidget({ start:0, stop:5, step: 10, text: '%counter% second left till we kill your dreams <3' });
	 * @example  $('#time-pased').timerWidget({ start:0, stop:0, step: 1000, text: 'You got a new email %counter% second ago' });
	 */
	$.widget('ui.timerWidget', {
		/**
		 * Base config.
		 *
		 * @var Object
		 */
		options: {
			// Start value count from where to where.
			start:						0,
			// Where timer stop if start and stop both 0 that means infinity.
			stop:						0,
			// Refresh rate. (can generate high cpu using optimal 10 <)
			step:						1000,
			// The %timer% will be replaced with the actual step value.
			text:						'%timer%',
			// Extend class(es) for timer.
			addClass:					'',
			// Relative postion of timer against the target element.
			position:					'left top',
			// Direct roundering, null give automatic, 0 mean to floor, rest is step.
			round:						null
		},
		
		/*
		 * Create the main and start if it allowed.
		 */
		_create:			function() {
			// Check for requirements.
			if ( ! $.ui.hasOwnProperty('counterWidget')) {
				console.error('Please install the Greenball/counterWidget you can get it @ https://github.com/greenball/counterWidget');
				return false;
			};

			// Create the main div, then prepend the content into document.
			this._timerDiv		= $('<div/>').addClass(this.widgetBaseClass+'Main '+this.options.addClass).prependTo(this.element);

			// Fit the position.
			this._timerDiv.ready($.proxy(this.position, this, false));
			
			// Fill the div for space measure.
			this._timerDiv.html(this.options.text.replace('%timer%', this.options.start));
			
			// Go for it!!!
			this._timerDiv.counterWidget({
				start:		this.options.start,
				stop:		this.options.stop,
				text:		this.options.text.replace('%timer%', '%counter%'),
				interval:	(Math.abs(this.options.start - this.options.stop) * 1000).toFixed(),
				step:		this.options.step,
				round:		this.options.round,
				create:		$.proxy(function(){ this._trigger('create', null, this) }, this),
				fStart:		$.proxy(function(){ this._trigger('fStart', null, this) }, this),
				refresh:	$.proxy(function(){ this._trigger('refresh', null, this) }, this),
				fStop:		$.proxy(function(){ this._trigger('fStop', null, this) }, this),
				destroy:	$.proxy(function(){ this.destroy(true); }, this),
			});
			
			// Fire event.
			this._trigger('create', null, this);
		},
		
		/*
		 * Start the timer.
		 *
		 * @example  $('#defuse-it-b4').timerWidget('start');
		 */
		start:				function() {
			this._timerDiv.counterWidget('start');
		},
		
		/*
		 * Stop the timer.
		 *
		 * @example  $('#defuse-it-b4').timerWidget('stop');
		 */
		stop:				function() {
			this._timerDiv.counterWidget('stop');
		},

		
		/*
		 * Set the timer position relative for target element.
		 *
		 * @example  $('#defuse-it-b4').timerWidget('position', 'top left');
		 */
		position:			function(position) {
			this._timerDiv.position({ my: position || this.options.position, at: position || this.options.position, of: this.element });
		},
		
		/*
		 * Kill the widget remove and stop the timer.
		 *
		 * @example  $('#defuse-it-b4').timerWidget('destroy');
		 */
		destroy:			function(counterCall) {
			// Kill the counter if not the counter requested the destroy.
			if ( ! counterCall) {
				this._timerDiv.counterWidget('destroy');
			};

			this._timerDiv.remove();
			
			$.Widget.prototype.destroy.call(this);
			
			// Fire event.
			this._trigger('destroy', null, this);
		}
	});
})($);