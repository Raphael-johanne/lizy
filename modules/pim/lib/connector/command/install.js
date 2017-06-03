/*!
 * Copyright(c) Raphael Colboc
 * MIT Licensed
 * 
 * @TODO when configuration functionnality will be available, put a parameter to do not authorize multiple install
 * of the pim configuration + add a command to install only one new job configuration
 *
 */

var mongoose = require('mongoose');
/*
 * @TODO Fix : no more relative path
 */
require('../../pim/models/job');
require('../../pim/models/locale');
var ItemJob		= mongoose.model('job');
var ItemLocale	= mongoose.model('locale');

function installCommand(parameters) {
	this.code = parameters.code;
}

/**
 * Install jobs configuration for export/import profiles
 */
installCommand.prototype.execute = function() {
	var jobs = [];
	ItemJob.remove({}, function(err) { 
		console.log('collection job removed'); 
	});
	
	ItemLocale.remove({}, function(err) { 
		console.log('collection locale removed'); 
	});
	
	/**
	 * import product from CSV
	 */
	jobs.push({
		  code 			: "import_product_csv",
		  name 			: "Import products from CSVs",
		  type 			: "import",
		  config : {
			  path : "modules/pim/import/products",
			  connector : {
				  reader 	: "csv/reader",
				  processor : "import/productProcessor",
				  writer 	: "mongo/writer"
			  },
			  collection : "product",
		  	  key : "sku"
		  }
	 });
	
	/**
	 * import attributes from CSV
	 */
	jobs.push({
		  code 			: "import_attribute_csv",
		  name 			: "Import attributes from CSV",
		  type 			: "import",
		  config : {
			  path : "modules/pim/import/attributes",
			  connector : {
				  reader 	: "csv/reader",
				  processor : "import/processor",
				  writer 	: "mongo/writer"
			  },
			  collection : "attribute",
		  	  key : "code"
		  }
	 });
	
	/**
	 * import attributes options from CSV
	 */
	jobs.push({
		  code 			: "import_attribute_option_csv",
		  name 			: "Import attributes options from CSV",
		  type 			: "import",
		  config : {
			  path : "modules/pim/import/attribute_options",
			  connector : {
				  reader 	: "csv/reader",
				  processor : "import/attributeValueProcessor",
				  writer 	: "mongo/writer"
			  },
			  collection : "attribute",
		  	  key : "code"
		  }
	 });
	
	/**
	 * import categories from CSV
	 */
	jobs.push({
		  code 			: "import_category_csv",
		  name 			: "Import categories from CSV",
		  type 			: "import",
		  config : {
			  path : "modules/pim/import/categories",
			  connector : {
				  reader 	: "csv/reader",
				  processor : "import/processor",
				  writer 	: "mongo/writer"
			  },
			  collection : "category",
		  	  key : "code"
		  }
	 });

	/**
	 * import families from CSV
	 */
	jobs.push({
		  code 			: "import_family_csv",
		  name 			: "Import families from CSV",
		  type 			: "import",
		  config : {
			  path : "modules/pim/import/families",
			  connector : {
				  reader 	: "csv/familyReader",
				  processor : "import/familyProcessor",
				  writer 	: "mongo/writer"
			  },
			  collection : "family",
		  	  key : "code"
		  }
	 });
	
	/**
	 * Export families in CSV
	 */
	jobs.push({
		  code 			: "export_family_csv",
		  name 			: "Export families in CSV",
		  type 			: "export",
		  config : {
			  path : "modules/pim/export/families.csv",
			  connector : {
				  reader 	: "mongo/reader",
				  processor : "export/processor",
				  writer 	: "csv/csvWriter"
			  },
			  fields 		: "code title cdate mdate",
			  collection 	: "family"	
		  }
	 });
	
	/**
	 * Export categories in CSV
	 */
	jobs.push({
		  code 			: "export_category_csv",
		  name 			: "Export categories in CSV",
		  type 			: "export",
		  config : {
			  path : "modules/pim/export/categories.csv",
			  connector : {
				  reader 	: "mongo/reader",
				  processor : "export/processor",
				  writer 	: "csv/csvWriter"
			  },
			  fields 		: "code title cdate mdate",
			  collection 	: "category"	
		  }
	 });
	
	/**
	 * Export attributes in CSV
	 */
	jobs.push({
		  code 			: "export_attribute_csv",
		  name 			: "Export attributes in CSV",
		  type 			: "export",
		  config : {
			  path : "modules/pim/export/attributes.csv",
			  connector : {
				  reader 	: "mongo/reader",
				  processor : "export/processor",
				  writer 	: "csv/csvWriter"
			  },
			  fields 		: "code title cdate mdate",
			  collection 	: "attribute"
		  }
	 });
	
	/**
	 * Export attributes options in CSV
	 */
	jobs.push({
		  code 			: "export_attribute_option_csv",
		  name 			: "Export attributes options in CSV",
		  type 			: "export",
		  config : {
			  path : "modules/pim/export/attributes_options.csv",
			  connector : {
				  reader 	: "mongo/reader",
				  processor : "export/processor",
				  writer 	: "csv/csvWriter"
			  },
			  fields 		: "code title cdate mdate",
			  collection 	: "attribute"
		  }
	 });
	
	/**
	 * Export products in CSV
	 */
	jobs.push({
		  code 			: "export_product_csv",
		  name 			: "Export products in CSV",
		  type 			: "export",
		  config : {
			  path : "modules/pim/export/products.csv",
			  connector : {
				  reader 	: "mongo/reader",
				  processor : "export/productProcessor",
				  writer 	: "csv/csvWriter"
			  },
			  fields 		: "",
			  collection 	: "product"
		  }
	 });
	
	jobs.forEach(function(job, index) {
		new ItemJob(job).save(function( err, item, count ){
			  if (err) {
				  console.log(err);
			  } else {
				  console.log('Job ' + job.code + " has been created");
			  }
		 });
	});
	
	/**
	 * create some locales
	 */
	var locales = [];
	
	locales.push({
		  code 			: "fr_FR",
		  name 			: "French",
	 });
	
	locales.push({
		  code 			: "en_EN",
		  name 			: "English",
	 });
	
	locales.forEach(function(locale, index) {
		new ItemLocale(locale).save(function( err, item, count ){
			  if (err) {
				  console.log(err);
			  } else {
				  console.log('Locale ' + locale.code + " has been created");
			  }
		 });
	});
}

module.exports = installCommand;
