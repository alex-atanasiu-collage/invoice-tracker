$(document).ready(function(){
	$.get("http://localhost:3000/invoices", function(data, status){
		var invoiceList = Object.values(data);
		var app = new Vue({
  			el: '#appshow',
  			data: {
  				invoices : invoiceList,
  				currentInvoice : invoiceList[0]
  			}
		})
	});
});