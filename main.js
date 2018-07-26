/*jslint vars: true, plusplus: true, devel: true, regexp: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $ */

define(function (require, exports, module) {
    "use strict";

    var PREFIX = 'EasyEditNumreic';
    var COMMAND_PLUSONE_ID = PREFIX + '.numPlusOne';
    var COMMAND_MINUSONE_ID = PREFIX + '.numMinusOne';
    var COMMAND_PLUSONE_NAME = "Numreic+1";
    var COMMAND_MINUSONE_NAME = "Numreic-1";
    var COMMAND_PLUSTEN_ID = PREFIX + '.numPlusTen';
    var COMMAND_MINUSTEN_ID = PREFIX + '.numMinusTen';
    var COMMAND_PLUSTEN_NAME = "Numreic+10";
    var COMMAND_MINUSTEN_NAME = "Numreic-10";
	
	
	

    var PreferencesManager                  = brackets.getModule("preferences/PreferencesManager"),
        ExtensionUtils                      = brackets.getModule("utils/ExtensionUtils"), 
		EditorManager                       = brackets.getModule("editor/EditorManager"),
        DocumentManager                     = brackets.getModule("document/DocumentManager"),
        CommandManager                      = brackets.getModule("command/CommandManager"),
        Menus                               = brackets.getModule("command/Menus"),
		KeyBindingManager                   = brackets.getModule("command/KeyBindingManager"),
		AppInit                             = brackets.getModule("utils/AppInit"),
        //Dialogs                             = brackets.getModule("widgets/Dialogs"),
        Strings                             = brackets.getModule("strings");

    function plusMinus(num) {
		
		var editor = EditorManager.getCurrentFullEditor();
		var retnum,ret,retlen;
		
		if (editor) {
			var isSelection = false;
			var selectedText = editor.getSelectedText();
			var selection = editor.getSelection();

			if (selectedText.length > 0) {
				var mtch=selectedText.match(/([\-\d\.]+)([\w%]*)/);
				console.log("selectedText: ",mtch[1]," ",mtch[2]);
				isSelection = true;
				
				var decnum=isDecimal(mtch[1]);
				var numlen=mtch[1].length;
				if(decnum>0){
					retnum=parseFloat(mtch[1])+num*Math.pow(0.1,decnum);
					
					var num_obj = new Number(retnum);
					retnum=num_obj.toFixed(decnum);
				}
				else{
					retnum=parseInt(mtch[1],10)+num;
				}
				
				ret=retnum+mtch[2];
				retlen=ret.length;
			}

			var doc = DocumentManager.getCurrentDocument();

			doc.batchOperation(function () {

				if (isSelection) {
					doc.replaceRange(ret, selection.start, selection.end);
					selection.end.ch=selection.start.ch+retlen;
					editor.setSelection(selection.start, selection.end); 
				} else {
					doc.setText(ret);
				}

			});
		}        
		
		
		
		
		
    }
	
	function numPlusOne(){
		plusMinus(1);
	}
	
    function numMinusOne() {
   		plusMinus(-1);
	}
	
	function numPlusTen(){
		plusMinus(10);
	}
	
    function numMinusTen() {
   		plusMinus(-10);
	}
	
	function isDecimal(dnum) {
		var wnum=dnum.split(/\./);
		if(wnum.length<2){
			return(0);
		}
		else{
			return wnum[1].length;
		}
	}
	

    CommandManager.register(COMMAND_PLUSONE_NAME, COMMAND_PLUSONE_ID, numPlusOne);
    CommandManager.register(COMMAND_MINUSONE_NAME, COMMAND_MINUSONE_ID, numMinusOne);
    CommandManager.register(COMMAND_PLUSTEN_NAME, COMMAND_PLUSTEN_ID, numPlusTen);
    CommandManager.register(COMMAND_MINUSTEN_NAME, COMMAND_MINUSTEN_ID, numMinusTen);

	
    var fileMenu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    fileMenu.addMenuItem(COMMAND_PLUSONE_ID);
    fileMenu.addMenuItem(COMMAND_MINUSONE_ID);
    fileMenu.addMenuItem(COMMAND_PLUSTEN_ID);
    fileMenu.addMenuItem(COMMAND_MINUSTEN_ID);
	
	KeyBindingManager.addBinding(COMMAND_PLUSONE_ID, "Alt-+");
	KeyBindingManager.addBinding(COMMAND_MINUSONE_ID, "Alt--");
	KeyBindingManager.addBinding(COMMAND_PLUSTEN_ID, "Ctrl-Alt-+");
	KeyBindingManager.addBinding(COMMAND_MINUSTEN_ID, "Ctrl-Alt--");

	
	
});

