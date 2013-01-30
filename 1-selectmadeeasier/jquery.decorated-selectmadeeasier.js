/*
 * jQuery decorated plugin : selectmadeeasier
 *
 * version 1.2 (12/4/2008)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

/**
 * The selectmadeeasier() method transforms a multiple select box into a new component which make the selection easier.
 *
 * This method has to be executed on the label referencing the select box.
 * There is 2 ways to write a form input :
 *	- input inside the label :
 *		<label>
 *			<span>My label</span>
 *			<select />
 *		</label>
 *	- input outside the label :
 *		<label for="myId">My label</label>
 *		<select id="myId" />
 *
 * Configuration parameters are :
 * - size : (default -1)
 * 		if value is greater than 0, than it will be the size of the select box. If it's -1, the size define in html will be use
 * - enableSearch : (default true)
 *		true or false, to know if we display the text box to make selection in non-selected element easier
 * - textContainerMarkup (default span)
 * 		when working with implicit label, the real label is wrap with a special markup
 * 		if you have this code for example : <label><strong>My input</strong><input /></label>, you have to change this param to strong.
 * - navByDblClick : (default true)
 *		true or false, to know if we bind the (un)select action with double click element
 *		! it seems that it isn't working on safari
 * - navByArrows : (default true)
 *		true or false, to know if we bind the (un)select action with arrow navigation (right or left) on element
 *		! future feature ... not yet implemented
 * - navByButtons : (default true)
 *		true or false, to know if we display and bind the (un)select action with buttons
 * - caseSensitiveSearch : (default false)
 * 		true or false, to know if search is case sensitive or not
 * - lblCurrentElement : (default value of contained label)
 *		Label for selected elements select box
 * - lblSearch : (default "State a name or choose from list")
 *		Label for unselected elements filter
 * - createGo2Left : [function]
 *		build the "selected elements go to left" widget
 * - createGo2Right : [function]
 *		build the "selected elements go to right" widget
 * - createAllGo2Left : [function]
 *		build the "all elements go to left" widget
 * - createAllGo2Right : [function]
 *		build the "all elements go to right" widget
 * - blockFooter : [function]
 *		add-on elements created at the container's bottom, useful to place a "clear:both" elements
 * - textContainerMarkup (default span)
 * 		when working with implicit label, the real label is wrap with a special markup
 * 		if you have this code for example : <label><strong>My input</strong><input /></label>, you have to change this param to strong.
 * - delay : (default 250)
 *		delay for search input in milliseconds
 * - clickAction : [function]
 * - dblclickAction : [function]
 * - searchAction : [function]
 * - moveItems : [function]
 * - updateOptions : [function]
 * - reset : [function]
 *
 * @name selectmadeeasier
 * @type jQuery
 * @return jQuery
 * @author Romain Gonord (romain.gonord.opensource@neteyes.org)
 */
(function($) {
	$.fn.selectmadeeasier = function(settings) {
		var defaults = {
			size: -1,
			enableSearch: true,
			navByDblClick: true,
			navByArrows: true,
			navByButtons: true,
			caseSensitiveSearch: false,
			lblCurrentElement: -1,
			lblSearch: "State a name or choose from list",
			filterPredicate: function(item){return true;},
			createGo2Left: function(){
				return $("<a href='#' class='go2Left'><span>&lt;-</span></a>");
			},
			createGo2Right: function(){
				return $("<a href='#' class='go2Right'><span>-&gt;</span></a>");
			},
			createAllGo2Left: function(){
				return $("<a href='#' class='allGo2Left'><span>&lt;--</span></a>");
			},
			createAllGo2Right: function(){
				return $("<a href='#' class='allGo2Right'><span>--&gt;</span></a>");
			},
			blockFooter: function(){
				return $("<br class='breaker' />");
			},
			textContainerMarkup: "span",
			delay: 500
		};
		var defaultsAction = {
			clickAction: function(event, cache){
			    var $tgt = $(event.target);
			    var $container = $tgt.parents(".decoratedSelectBoxContainer:eq(0)");
				var $link = undefined;
				if ($tgt.is('span')) {
			    	event.preventDefault();
			    	$link = $tgt.parent(); 
				} else if ($tgt.is('a')){
			    	event.preventDefault();
					$link = $tgt; 
				}
				if ($link != undefined) {
			    	if($link.is('a.go2Left')){
				    	var options = $(".decoratedSelectBoxContainer3 option", $container);
			    		defaultsAction.moveItems(options, cache.selectedItems, cache.availableItems, cache);
				    	$container
				    		.trigger("update.selectmadeeasier")
				    		.trigger("search.selectmadeeasier")
				    	;
				    } else if ($link.is('a.go2Right')) {
				    	var options = $(".decoratedSelectBoxContainer1 option", $container);
				    	defaultsAction.moveItems(options, cache.availableItems, cache.selectedItems, cache);
				    	$container
				    		.trigger("update.selectmadeeasier")
				    	;
				    } else if ($link.is('a.allGo2Left')) {
				    	for (var i = 0 ; i < cache.items.length ; i++){
							cache.availableItems[i] = true;
							cache.selectedItems[i] = false;
				    	}
				    	$container
				    		.trigger("update.selectmadeeasier")
				    		.trigger("search.selectmadeeasier")
				    	;
				    } else if ($link.is('a.allGo2Right')) {
				    	for (var i = 0 ; i < cache.items.length ; i++){
				    		if (cache.availableItems[i]){
					    		cache.availableItems[i] = false;
					    		cache.selectedItems[i] = true;
				    		}
				    	}
				    	$container
				    		.trigger("update.selectmadeeasier")
				    	;
				    }
			    }
			},
			dblclickAction: function(event, cache){
			    var $tgt = $(event.target);
			    var $container = $tgt.parents(".decoratedSelectBoxContainer:eq(0)");
			    if ($tgt.is('option') || $tgt.is('select')) {
			    	var options;
				    if ($tgt.is('option')) {
				    	options = $("option", $tgt.parent());
				    } else {
				    	options = $("option", $tgt);
				    }
			    	if ($tgt.parents(".decoratedSelectBoxContainer1:eq(0)").length > 0){
			    		defaultsAction.moveItems(options, cache.availableItems, cache.selectedItems, cache);
			    	} else {
			    		defaultsAction.moveItems(options, cache.selectedItems, cache.availableItems, cache);
			    	}
			    	$container
			    		.trigger("update.selectmadeeasier")
			    		.trigger("search.selectmadeeasier")
			    	;
			    }
			},
			searchAction: function(event, cache, caseSensitiveSearch){
			    var $container = $(event.target);
				var searchTxt = $("input", $container).val();
				if (!caseSensitiveSearch){
					searchTxt = searchTxt.toLowerCase();
				}
				for (var i = 0 ; i < cache.items.length ; i++){
					cache.availableItems[i] = (cache.searchItems[i].indexOf(searchTxt) > -1) && !cache.selectedItems[i]
				}
				$container.trigger("update.selectmadeeasier");
			},
			filterAction: function(event, container, cache, predicate){
				for (var i = 0 ; i < cache.items.length ; i++){
					cache.availableItems[i] = predicate(cache.items[i]) && !cache.selectedItems[i]
				}
				container.trigger("update.selectmadeeasier");
			},
			moveItems: function($options, src, dst, cache){
				var indexes = [];
				$options.filter("[selected]").each(function(i){
					indexes.push($options.index(this));
				});
				if (indexes.length > 0){
					var currentLocalIndex = 0;
					var currentGlobalIndex = -1;
					for (var i = 0 ; i < cache.items.length ; i++){
						if (src[i]){
							currentGlobalIndex++;
							if (currentLocalIndex < indexes.length && indexes[currentLocalIndex] == currentGlobalIndex){
								src[i] = false;
								dst[i] = true;
								currentLocalIndex++;
							}
						}
					}
				}
			},
			updateOptions: function(event, cache){
				var $container = $(event.target);
				$("option", $container).remove();
				/* available items */
				var $selectAvailableItems = $(".decoratedSelectBoxContainer1 select", $container);
				var selectAvailableItemsWidth = $selectAvailableItems.width();
				for (var i = 0 ; i < cache.items.length ; i++){
					if (cache.availableItems[i]){
						$selectAvailableItems.append(cache.items[i].clone(true));
					}
				}
				if ($.browser.msie && $.browser.version == 7){
					$selectAvailableItems.width(selectAvailableItemsWidth + 4);
				}
				/* selected items */
				var $selectSelectedItems = $(".decoratedSelectBoxContainer3 select", $container);
				var selectSelectedItemsWidth = $selectSelectedItems.width();
				for (var i = 0 ; i < cache.items.length ; i++){
					if (cache.selectedItems[i]){
						$selectSelectedItems.append(cache.items[i].clone(true));
					}
				}
				if ($.browser.msie && $.browser.version == 7){
					$selectSelectedItems.width(selectSelectedItemsWidth + 4);
				}
				$("option", $container).removeAttr("selected");
			},
			reset: function(container, cache){
				for (var i = 0 ; i < cache.items.length ; i++){
					cache.availableItems[i] = !cache.origSelectedItems[i];
					cache.selectedItems[i] = cache.origSelectedItems[i];
				}
				container.trigger("update.selectmadeeasier");
			}
		};
		return this.each(function(i,n){
			var myDefaults = $.extend({}, defaults, defaultsAction, settings);
			if (!myDefaults.enableSearch){
				myDefaults.searchAction = function(event, cache, caseSensitiveSearch){};
			}
			/*
			 * setup
			 * - $label : the label
			 * - $selectOrig : the select input
			 * - text2Display : the text label displayed for the selected elements
			 * - size : size of the select box
			 */
	        var $label = $(this),
	        	$selectOrig,
	        	text2Display,
	        	cache = {
					items : [],
					availableItems : [],
					selectedItems : [],
					searchItems : [],
					origSelectedItems : []
	        	},
	        	size;
	        
			/* format the final select */
			var attributeFor = $label.attr("for");
			if (attributeFor != null && attributeFor != ""){
				$selectOrig = $("#" + attributeFor);
				text2Display = $label.html();
				$label
					.empty()
					.append($selectOrig)
				;
			} else {
				$selectOrig = $("select", this);
				var textContainer = $(myDefaults.textContainerMarkup, this);
				text2Display = textContainer.html();
				textContainer.remove();
			}
			var dstDisplayedLabel = myDefaults.lblCurrentElement;
			if (dstDisplayedLabel != -1){
				text2Display = dstDisplayedLabel;
			}
			$($label).prepend(
				"<" + myDefaults.textContainerMarkup + ">" +
				text2Display +
				"</" + myDefaults.textContainerMarkup + ">"
			);
			if (myDefaults.size > 0){
				$selectOrig.attr("size", myDefaults.size);
			}
			size = $selectOrig.attr("size");

			/* prepare the cache */
			$selectOrig.find("> option").each(function (i,n) {
				cache.items[i] = $(this).clone(true);
				if (this.selected){
					cache.availableItems[i] = false;
					cache.selectedItems[i] = true;
					cache.origSelectedItems[i] = true;
				} else {
					cache.availableItems[i] = true;
					cache.selectedItems[i] = false;
					cache.origSelectedItems[i] = false;
				}
				cache.searchItems[i] = $(this).html();
				if (!myDefaults.caseSensitiveSearch){
					cache.searchItems[i] = cache.searchItems[i].toLowerCase();
				}
			});
			/* prepare the main container */
			var container = $label
				.before("<div class='decoratedSelectBoxContainer' />")
				.prev()
			;

			/*
			 * container1 :
			 * - searchBoxLabel : label for search's input
			 * - searchBox : input for search ability
			 * - srcSelect : select box for the unselected elements
			*/
			var container1 = $("<div class='decoratedSelectBoxContainer1' />");
			var search_timeout = undefined;
			$(container1)
				.filter(function(){
					return myDefaults.enableSearch;
				})
					.append($(
						"<label>" +
						"<" + myDefaults.textContainerMarkup + ">" +
						myDefaults.lblSearch +
						"</" + myDefaults.textContainerMarkup + ">" +
						"<input type='text'>"+
						"</label>"
					))
					.find("input[type=text]")
						.keyup(function(){
							if(search_timeout != undefined) {
								clearTimeout(search_timeout);
							}
							/* save reference to 'this' so we can use it in timeout function */
							var input = this;
							search_timeout = setTimeout(function() {
								$(input)
									.parents(".decoratedSelectBoxContainer:eq(0)")
										.trigger("search.selectmadeeasier")
									.end()
								;
							}, myDefaults.delay);
						})
					.end()
				.end()
				.append("<select multiple='multiple' size='" + size + "' />")
			;
	
			/*
			 * container2 :
			 * - Elements for widget navigation : defined by createGo2Left, createGo2Right, createAllGo2Left, createAllGo2Right
			*/
			var container2;
			if (myDefaults.navByButtons){
				container2 = $("<div class='decoratedSelectBoxContainer2' />")
					.append(myDefaults.createAllGo2Left())
					.append(myDefaults.createGo2Left())
					.append(myDefaults.createGo2Right())
					.append(myDefaults.createAllGo2Right())
				;
			}
	
			/*
			 * container3 :
			 * - the original label
			*/
			var container3 = $("<div class='decoratedSelectBoxContainer3' />")
				.append($label)
			;
	
			/* link to document */
			container
				.append(container1)
				.append(container2)
				.append(container3)
				.append(myDefaults.blockFooter())
				.click(function(event){
					myDefaults.clickAction(event, cache);
				})
				.dblclick(function(event){
					myDefaults.dblclickAction(event, cache);
				})
				.bind("search.selectmadeeasier", function(event){
					myDefaults.searchAction(event, cache, myDefaults.caseSensitiveSearch);
				})
				.bind("filter.selectmadeeasier", function(event){
					myDefaults.filterAction(event, container, cache, myDefaults.filterPredicate);
				})
				.bind("update.selectmadeeasier", function(event){
					myDefaults.updateOptions(event, cache);
				})
				.trigger("update.selectmadeeasier")
			;
			$($selectOrig[0].form)
				.submit(function(){
					$(".decoratedSelectBoxContainer3 option", container).attr("selected", "selected");
					return true;
				})
				.find("input[type = reset]")
					.click(function(){
						myDefaults.reset(container, cache);
					})
				.end()
			;
		});
	};
})(jQuery);
