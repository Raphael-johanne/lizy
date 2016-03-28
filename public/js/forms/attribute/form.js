var AttributeForm = function(){
	
	var lastIndex = null;
	
	if ($('#attribute-add-value').length > 0) {
		$('#attribute-add-value').click(function(event){
			event.preventDefault();
			this.addElement();
		}.bind(this));
	}
	
	this.addElement = function (code, value, index) {
		
		if (typeof index === 'undefined') {
			lastIndex = lastIndex+1;
			index = lastIndex;
		} else {
			lastIndex = parseInt(index);
		}
		
		var container = $('<div/>', {
			'class':'input-group'
		});
		
		var label = $('<div/>', {
			'class':'input-group-addon'
		}).text("Code");
		
		var input = $('<input/>', {
			'class':'form-control', 
			'placeholder' : "Code", 
			'value' : code,
			'name' : 'values['+index+'][code]'
		});
		
		var label2 = $('<div/>', {
			'class':'input-group-addon'
		}).text("Value");
		
		var input2 = $('<input/>', {
			'class':'form-control', 
			'placeholder' : "Value", 
			'value' : value,
			'name' : 'values['+index+'][value]'
		});
		
		var link = $('<a/>', {
			'href':'#', 
			'class' : 'attribute-remove-value',
		}).text("Remove");
		
		
		link.click(function(event){
			event.preventDefault();
			$(this).parent().parent().remove();
		});
		
		
		var div = $('<div/>', {
			'class':'input-group-addon'
		});
		
		div.append(link);
		
		container.append(label);
		container.append(input);
		container.append(label2);
		container.append(input2);
		container.append(div);
		container.prependTo($('#attribute-values'));
	}
}
