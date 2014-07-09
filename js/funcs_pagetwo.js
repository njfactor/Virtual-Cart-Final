
$(document).on("pagebeforeshow","#pagetwo",function(event,data)
{
	$("#billDetails").text('');
	$('<div class="ui-block-a " style="width:40%;"  ><h3 style="text-align:left;">Product</h3></div><div class="ui-block-b " style="width:10%;" ><h3 style="text-align:right; ">Qty</h3></div><div class="ui-block-c " style="width:25%;" ><h3 style="text-align:right; ">Price</h3></div><div class="ui-block-d " style="width:25%;"><h3 style="text-align:right; ">S.Total</h3></div></div>').appendTo("#billDetails");
	
	$("#grandTotalPagetwo").text(total_price.toFixed(2));
	
	for(i = 0;i<cart_top;i++)
	{
		addBillToDisplay(i);
		total_Discount+=(cart[i].mrp - cart[i].mallPrice)*cart[i].qty;
	}
	$("#totalDiscountPagetwo").text(total_Discount.toFixed(2));
});


function addBillToDisplay(index)
{
	var $bill=$('<div class="ui-block-a" id="bd" style="text-align:left;width:40%;">' + cart[index].pdName + '</div><div class="ui-block-b" id="bd" style="text-align:right;width:10%;">' + cart[index].qty + '</div><div class="ui-block-c" id="bd" style="text-align:right;width:25%;">' + cart[index].mallPrice.toFixed(2) + '</div><div class="ui-block-d" id="bd" style="text-align:right;width:25%;">' + cart[index].subTotal.toFixed(2) + '</div>').appendTo(document.getElementById('billDetails'));
}


function sendToBiller()
{
               event.preventDefault();
               
               cartForServer = new cartS(cartID,cart_top,cart,total_price);
               var finurl=server_url;
               dat= JSON.stringify(cartForServer);

	   
                $.ajax
               ({
                       type: "POST",
                       url: finurl,
                       data:dat,
                       headers: { "Accept":"application/json"},

                       success: function (data) 
                       {
                               alert('Thank you for shopping with Virtual Cart. '+data);
                       },
                       error: function ()
                       {
                               alert('Sorry! there seems to be a problem with our servers. Please try paying after some time.');
                       }        
               }); 
}

function cartS( cartID,  itemQuantity, prodarr, total)
{
	this.cartID=cartID;
	this.itemQuantity=itemQuantity;
	this.prodarr=prodarr;
	this.total=total;
}