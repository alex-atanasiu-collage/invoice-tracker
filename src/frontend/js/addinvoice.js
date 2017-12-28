$(document).ready(function(){
	var app = new Vue({
  			el: '#appshow',
  			data: {
  				generatedInvoice : {
  					InvoiceNumber : "",
  					Date : "",
  					PaymentData : {
  						Currency : "RON",
  						PaymentMethod : "Cash at delivery",
  						TotalPayment : 0
  					},
  					From : {
  						CompanyName : "" ,
  						Address : "" ,
  						Phone : "" ,
  						Email : ""
  					},
  					BillTo : {
  						CompanyName : "" ,
  						Address : "" ,
  						Phone : "" ,
  						Email : ""
  					}
  				}
  			},

  			methods : {
  				clickSubmit : function(generatedInvoice){
  					generatedInvoice.Date = new Date(generatedInvoice.Date).getTime();
  					console.log(generatedInvoice);

  					$.post("http://localhost:3000/addinvoice", {invoice : generatedInvoice }, function() {
						generatedInvoice.InvoiceNumber = "";
						generatedInvoice.Date = "";	
						generatedInvoice.PaymentData.Currency = "RON";
						generatedInvoice.PaymentData.PaymentMethod = "Cash at delivery";
						generatedInvoice.PaymentData.TotalPayment = 0;
						generatedInvoice.From.CompanyName = "";
						generatedInvoice.From.Address = "";
						generatedInvoice.From.Phone = "";
						generatedInvoice.From.Email = "";
						generatedInvoice.BillTo.CompanyName = "";
						generatedInvoice.BillTo.Address = "";
						generatedInvoice.BillTo.Phone = "";
						generatedInvoice.BillTo.Email = "";

						$("#successalert").fadeIn(200);
  					});
  				}
  			}
		})



/*
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
	*/
});