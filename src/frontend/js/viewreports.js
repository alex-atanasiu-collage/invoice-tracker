$(document).ready(function(){
	$.get("http://localhost:3000/invoices", function(data, status){
		var invoiceList = Object.values(data); // transfrom from object to list of objects
		var app = new Vue({
  			el: '#appshow',
  			data: {
  				invoices : invoiceList,
  				currentInvoice : invoiceList[0]
  			},
  			methods : {
  				clickRemove : function(invoiceId){
  					$.get("http://localhost:3000/removeinvoice/" + invoiceId, function(data, status){});
  					location.reload();
  				}
  			}
		})
	});
});