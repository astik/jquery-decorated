/*
 * jQuery confirmchange plugin - confirmchange
 *
 * version 1.2 (12/4/2008)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

/**
 * The confirmchange() method displays a confirm dialog box if user submit a modified form.
 * Handy if you want to make list of delete box for example ...
 *
 * Configuration parameters are :
 * - selector : (default ":input")
 * 		selector of current form's input to protect from changes
 * - confirmMsg : (default "Are you sure you want to submit the modification ?")
 * 		message to display in the confirm box
 * - displayDialog : [function]
 * 		function that display the dialog box. if you don't like the basic javascript confirm dialog, you can override this function to display a much nicer dialog box than the confirm one.
 *
 * @name confirmchange
 * @type jQuery
 * @return jQuery
 * @author Romain Gonord (romain.gonord.opensource@neteyes.org)
 */
(function($) {
	$.fn.confirmchange = function(settings) {
		var defaults =  {
			selector: ":input",
			confirmMsg: "Are you sure you want to submit the modification ?",
			displayDialog: function(){
				return confirm(defaults.confirmMsg);
			}
		};
		$.extend(defaults, settings);
		return this.submit(function(){
			var inputs = $(defaults.selector, this);
			changed = false
				|| inputs.filter("input[type='text'], textarea").filter(function(){ return this.value != this.defaultValue; }).length > 0
				|| inputs.filter("[type='checkbox'], [type='radio']").filter(function(){ return this.checked != this.defaultChecked; }).length > 0
				|| inputs.filter("select").find("option").filter(function(){ return this.selected != this.defaultSelected; }).length > 0
			;
			if (changed){
					return defaults.displayDialog();
			}
			return true;
		});
	};
})(jQuery);
