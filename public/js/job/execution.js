var Execution = function(urlSocketConnection){
	
	this.socket = io.connect(urlSocketConnection);
	
	/**
	 * @TODO do not use constant string inline, prefer shared same constant
	 */
	this.socket.on("job_execution_report_socket", function(data){
		var data = JSON.parse(data); //console.log(data);
		data.forEach(function(item, index){
			this.addElement(item);
		}.bind(this));
		
	}.bind(this));
	
	this.addElement = function (data) {
		
		var cssClass = 'JOB_EXECUTION_' + data.code;
		
		var container = $('<div/>', {
			'class':'input-group ' + cssClass
		});
		
		var label = $('<div/>', {
			'class':'input-group-addon code ' + cssClass 
		}).text(data.code);
		
		var label2 = $('<div/>', {
			'class':'input-group-addon identifier ' + cssClass 
		}).text(data.identifier);
				
		var label3 = $('<div/>', {
			'class':'input-group-addon messages ' + cssClass 
		}).text(data.messages);
		
		container.append(label);
		container.append(label2);
		container.append(label3);
		container.prependTo($('#general'));
	}
}