/*
 * jQuery hideandseek plugin
 *
 * version 1.0b (31/03/2009)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

/**
 * The hideandseek() method transforms a news item (title + details) by hiding the details.
 * When you click on the handle of the title, the details is shown, click again, and it disappears again.
 * It's like an accordion, same same ... but different =)
 *
 * Configuration parameters are :
 * - cssClassMore : (default hasMore)
 *		class added to set an article as shown
 * - cssClassLess : (default hasLess)
 *		class added to set an article as hidden
 * - cssClassActive : (default hasActive)
 *		class added to set an article as active, whi means shown at startup
 * - selectorTitle : (default div.hasTitle)
 *		selector to get title container
 * - selectorItem : (default div.hasDetails)
 *		selector to get detail container
 *
 * Triggers :
 * - hide.hideandseek :
 * 		event that hide details
 * - show.hideandseek :
 * 		event that show details
 * - hideDone.hideandseek :
 * 		event triggered when hide event is finished
 * - showDone.hideandseek :
 * 		event triggered when show event is finished
 * - click.hideandseek :
 * 		click event on handle
 * 
 * @name hideandseek
 * @type jQuery
 * @return jQuery
 * @author Romain Gonord (romain.gonord.opensource@neteyes.org)
 */
(function($) {
	$.fn.hideandseek = function(settings) {
		var defaults = {
			cssClassMainContainers: "has",
			cssClassMore: "hasMore",
			cssClassLess: "hasLess",
			cssClassHandleMore: "hasHandleMore",
			cssClassHandleLess: "hasHandleLess",
			cssClassActive: "hasActive",
			selectorTitle: "> div.hasTitle",
			selectorItem: "> div.hasDetails",
			handleShow: "<span>+</span>",
			handleHide: "<span>-</span>"
		};
		var triggers = {
			hide: "hide.hideandseek",
			show: "show.hideandseek",
			hideDone: "hideDone.hideandseek",
			showDone: "showDone.hideandseek",
			click: "click.hideandseek"
		};
		$.extend(defaults, settings);

		var manageHideOrShow = function(elem, class2remove, class2add, trigger){
			$(defaults.selectorTitle + "," + defaults.selectorItem, elem).removeClass(class2remove).addClass(class2add);
			$(elem).trigger(trigger);
		};
		var hasHide = function(){
			manageHideOrShow(this, defaults.cssClassMore, defaults.cssClassLess, triggers.hideDone);
		};
		var hasShow = function(){
			manageHideOrShow(this, defaults.cssClassLess, defaults.cssClassMore, triggers.showDone);
		};
		var hasClick = function(event){
		    var $tgt = $(event.target);
		    var $this = $(this);
		    if ($tgt.is("span")) {
		    	if ($tgt.is("." + defaults.cssClassHandleLess) || $tgt.parents("." + defaults.cssClassHandleLess).length){
	    			$this.trigger(triggers.hide);
		    	} else if ($tgt.is("." + defaults.cssClassHandleMore) || $tgt.parents("." + defaults.cssClassHandleMore).length){
	    			$this.trigger(triggers.show);
		    	}
		    }
		};

		return this
			.addClass(defaults.cssClassMainContainers)
			.find(defaults.selectorTitle)
				.addClass(defaults.cssClassLess)
			.end()
			.find(defaults.selectorItem)
				.addClass(defaults.cssClassLess)
			.end()
			.filter(function(){
				return $(defaults.selectorItem, this).length > 0;
			})
				.find(defaults.selectorTitle)
					.prepend("<span class='" + defaults.cssClassHandleLess + "'>" + defaults.handleHide + "</span>")
					.prepend("<span class='" + defaults.cssClassHandleMore + "'>" + defaults.handleShow + "</span>")
				.end()
			.end()
			.bind(triggers.show, hasShow)
			.bind(triggers.hide, hasHide)
			.bind(triggers.click ,hasClick)
			.filter("." + defaults.cssClassActive)
				.trigger(triggers.show)
			.end()
		;
	};
})(jQuery);
