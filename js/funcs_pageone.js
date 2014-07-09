function startScanner(){
	app.scan();
}


document.addEventListener("deviceready", onDeviceReady, false);




function onDeviceReady() {//alert('device is ready');
   document.addEventListener("backbutton", onBackKeyDown, false); //Listen to the User clicking on the back button
}

function onBackKeyDown(e) {
//alert('back is down');
   e.preventDefault();
   if(confirm("Are you sure?\nAll your product will lost."))
	{
		navigator.app.exitApp();
	}
   //navigator.notification.confirm("Are you sure you want to exit ?", onConfirm, "Confirmation", "Yes,No"); 
   // Prompt the user with the choice
}

function onConfirm(button) {
   if(button==2){//If User selected No, then we just do nothing
       return;
   }else{
       navigator.app.exitApp();// Otherwise we quit the app.
   }
}

function begin()
{	
	//document.getElementById('scan').
	
	if(obj.mallPrice==undefined)
			obj.mallPrice=obj.mrp;
	if(obj.url!=null)
		server_url = obj.url;
	
	var x=checkIfPresent(obj.Id);
	if(x>=0)//present
	{
      alert('This item is already present in your cart.');
      changeQtyRescan(x);																					//to change to increment instead of replace
	}
	else//not present
	{
		//take quantity input
		//var tempqt=takeQuantity();
		//alert("final qty is"+tempqt);
		//if(tempqt!=-1){
			temprod=new product(obj.Name,obj.Id,parseFloat(obj.mallPrice), 1 ,parseFloat(obj.mrp),obj.discount,obj.offer,obj.Description);
			if(cart_top==0)
			{$("#wrapper").empty();
			$("#wrapper").removeClass("app");
			}
			add_object(temprod);
			
			getDetails(temprod);
		//	}
	}
}
//end

function updateAllConstantsDisplay()
{
	$("#total_price").text(total_price.toFixed(2));
	$("#total_items").text(cart_top);
}

function changeQtyRescan(pos)
{
	//cart[pos].qty = parseInt(cart[pos].qty); 
	cart[pos].qty++; 
	cart[pos].subTotal=calc_subtotal(cart[pos].mallPrice,cart[pos].qty);
	total_price+=cart[pos].mallPrice;
	
	changeQtyRescanDisplay(pos);
	updateAllConstantsDisplay();

}

function changeQtyRescanDisplay(pos){
		//alert(cart[pos].qty);
		$("#qt__" + cart[pos].pdId).val(cart[pos].qty+"");
		$("#sTotal" + cart[pos].pdId).text(cart[pos].subTotal.toFixed(2));
		$('html,body').animate({scrollTop: $("#"+cart[pos].pdId).offset().top}, 500);
}


//Server request to get product details
function getDetails(tempprod)
{
/* Handle errors if product scanned is not in server database. To do this we can use a flag attribute in product.*/
//    //alert('in get details');//to be removed
	
	if(server_url==undefined)
	{
	return;
	}
	event.preventDefault();
	
	var finurl= getQueryString(server_url,tempprod.pdId);
	
	var jqxhr= $.get( finurl, function( data ) {
	
	//alert(data);
	
	try{
	data=jQuery.parseJSON(data);
		
	var i=checkIfPresent(tempprod.pdId);
	if(i>=0){
	{
		total_price-=cart[i].subTotal;
		data.qty=cart[i].qty;
		data.subTotal=calc_subtotal(data.qty,data.mallPrice);
		cart[i] = data;
		total_price+=cart[i].subTotal;
		//alert('The mall is providing ' + data.offer + ' on ' + data.pdName + '.');	
	}
	{
		$("#name"+ cart[i].pdId).text(cart[i].pdName);
		$("#id_"+ cart[i].pdId).text("ID: "+cart[i].pdId);
		$("#img" + cart[i].pdId).attr("src",cart[i].imgURL);
		$("#qt__" + cart[i].pdId).attr("value",cart[i].qty);
		$("#sTotal" + cart[i].pdId).text(cart[i].subTotal.toFixed(2));
		if(cart[i].discount != 0)
		{
		$("#mrp" + cart[i].pdId).css({"text-decoration":"line-through"});
		$("#mrp" + cart[i].pdId).css({"font-size":"70%"});
		$("#mrp" + cart[i].pdId).css({"color":"#999999"});
		$("#mPrice" + cart[i].pdId).text("Rs. "+cart[i].mallPrice.toFixed(2));
		}
		
		$("#offer" + cart[i].pdId).text(cart[i].offer);
	}	
		updateAllConstantsDisplay();	
	}
	}
		catch(err)
	{

	}
	});
	
	jqxhr.fail(function()
		{
			alert('Sorry!\nThe additional information on '+ tempprod.pdName + ' could not be retrieved.');
		});
	//var pdImg=document.getElementById('img' + cart[i].pdId + '');
}
//end

//to create the query string
function getQueryString (url,pid)
{	
return  url+"?method=getProductDetails&pID="+pid;	
}
//end


//Constructor for product class
function product(pdName,pdId,mallPrice,qty,mrp,discount,offer,pdDescription,imgURL)
{
	this.pdName = pdName;
	this.pdId = pdId;
	this.mallPrice = mallPrice;
	this.qty=qty;
    this.subTotal=mallPrice*qty;
	this.mrp = mrp;
	this.discount = discount;
	this.offer = offer;
	this.pdDescription = pdDescription;
	this.imgURL = imgURL;
}


//to remove the product object from the cart array
function remove_object(id)
{
	var i=checkIfPresent(id);
	
	if(i>=0){
    total_price-=cart[i].subTotal;//update the total price 
	cart_top-=1;//update the cart index
	
	var temp_arr_start=cart.splice(0,i+1);
	temp_arr_start.pop();
	cart=temp_arr_start.concat(cart);
  
	removeFromDisplay(id);
	updateAllConstantsDisplay();
	disableEnablePayLink();
	wrapperToEmptyCartDispaly();}
	else
	{
		//alert("item not present in the cart");
	}
}
//end
function removeFromDisplay(id)
{
	$("#"+id).remove();
}

function convert(x)
{
   return parseFloat(x);
}


//to calculate the item's subtotal
function calc_subtotal(mallPrice,qty)
{
  return mallPrice*qty;
}
//end


//to check if the item is already present in the cart array. If present return the pos of product else return -1
function checkIfPresent(id)
{
  var i;
  for(i=0;i<cart_top;i++)
 {
    if(cart[i].pdId==id)
       return i;
 }
  return -1;
}
//end

function add_object(tempprod)
{
	cart.push(tempprod);
	
	cart_top++;
	total_price+=tempprod.subTotal;
	
	addToDisplay(tempprod);
	
	updateAllConstantsDisplay();
	disableEnablePayLink();
	wrapperToEmptyCartDispaly();
}

function addToDisplay(tempprod)
{
var $ele=$('<div data-role="collapsible" data-collapsed="false" id="'+tempprod.pdId+'" style="font-size: 130%;"><h3><div style="width: 100%;"><div id = "name'+tempprod.pdId+'" style="font-size: 150%;width: 85%;float:left;overflow: hidden;">'+tempprod.pdName+'</div><div style="width: 15%;float:right;"><a href="#" class="ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="remove_object(this.id)" id = "'+tempprod.pdId+'" style="float:right; border:0px;"></a></div></div></h3><div class="ui-grid-b" style="width: 100%;padding:1%;"><div class="ui-block-a"  style="width: 25%;"><img src="photo_not_available.png" class = "imagesOnPageone" id="img' + tempprod.pdId + '" /></div><div class="ui-block-b" style="width: 45%;"><div style="width:100%;"><div id = "id_'+tempprod.pdId+'" style="float:left;width:100%;">ID:'+tempprod.pdId+'</div><br/><br/><br/><br/><div style="width:100%;font-size:100%;" id="mrp' + tempprod.pdId + '">Rs. '+tempprod.mallPrice.toFixed(2)+'</div><div style="width:100%;" id="mPrice'+tempprod.pdId+'"></div></div></div><div class="ui-block-c" style="width: 30%;"><div class="myInput" id = "myInput"><button class="myInputButtonMinus" id="minus__'+tempprod.pdId+'" onclick="minus_click(this.id)" data-icon="minus">-</button><input type="number" class="myInputBox" id="qt__'+tempprod.pdId+'" onkeyup="key_up(this.id)" onfocusout="focus_out(this.id)"  value="'+tempprod.qty+'" maxlength=""><button class="myInputButtonPlus" id="plus__'+tempprod.pdId+'" onclick="plus_click(this.id)">+</button></div><div style="float: right; height: 70%;"><p style="text-align: right;"><strong><br/><br/>Rs. <span id="sTotal' + tempprod.pdId + '">'+tempprod.subTotal.toFixed(2)+'</span></strong></p></div></div></div><div id = "offer'+tempprod.pdId+'" style = "text-shadow: 0 0 15px #000000;"></div></div>').appendTo(document.getElementById('wrapper'));
$ele.collapsible();
 $('html,body').animate({scrollTop: $("#"+tempprod.pdId).offset().top}, 500);
}

function changeQuantity(qtId,qtValue)
{
	var actualId = qtId.split("__").pop();
	var i=checkIfPresent(actualId);
	 actualValue = parseInt(qtValue);
    
   var temp_subTotal=calc_subtotal(actualValue,cart[i].mallPrice);//calculate the subtotal for now
	
	cart[i].qty=actualValue;//replace the qty;
	total_price=total_price-(cart[i].subTotal);//decrement the existing item's subtotal
    cart[i].subTotal=temp_subTotal;//update the subtotal;
	total_price+=temp_subTotal;//update the total price
	
	$("#sTotal" + cart[i].pdId).text(cart[i].subTotal.toFixed(2));
	
	updateAllConstantsDisplay();
}

 function disableEnablePayLink()
{
       if(cart_top != 0)
       {
               $("#payButton").removeClass('ui-disabled');   
       }
       else
       {
               $("#payButton").addClass('ui-disabled');                
       }
}

function deleteAll()
{
	if(cart_top != 0){	
	if(confirm("Do you really want to delete everything."))
	{
		cart=[];//empty the cart array

		$("#wrapper").text("");//empty the display
		total_price=0;
		cart_top=0;

		updateAllConstantsDisplay();
		disableEnablePayLink();
		wrapperToEmptyCartDispaly();
	}
		}
	
}

function firstFunction()
{
//alert('firstFunction');
	cartID = parseInt(Math.random() * 1000000);
	disableEnablePayLink();
	wrapperToEmptyCartDispaly();

	updateAllConstantsDisplay();
}


//to splice the information.....called after scanner
function splitter(info)
{
	details=info.split(separator);
}
//end

function checkValidQR(tex){

	//splitter(tex);
	try{
		obj=jQuery.parseJSON(tex);
		}
	catch(err)
	{
		return false;
	}	
	if(obj.Id==undefined || obj.mrp==undefined || obj.key==undefined)
		return false;
	if(obj.key!=appUniqueKey)
		return false;
	if(obj.Id=="")
		return false;
	if(parseFloat(obj.mrp)=="NaN")
		return false;
	return true;
}

//returns the quantity input by user, returns -1 in case user doesn't wants to add item
function takeQuantity()
{
	var qty = prompt('Enter the number of prducts you wish to buy: \n',"1");
	//alert("you entered"+qty);
	if(qty==null)
	return -1;
	qty=parseFloat(qty);
	//alert("quantity after parsefloat"+qty);
	while(isNaN(qty)||(qty%1!=0)||qty<0)
		{
		alert("Please enter valid quantity");
		var qty = prompt('Enter the number of prducts you wish to buy: \n',"1");
		if(qty==null)
			return -1;
		qty=parseFloat(qty);
		}
	if(qty==0)
		return -1;
	return qty;
}


function exitApp()
{
	if(confirm("Do you really want to exit. All products will be deleted."))
		navigator.app.exitApp();
}

function wrapperToEmptyCartDispaly()
{
	if(cart_top == 0)
	{
	$("#wrapper").empty();
	//$("#wrapper").addClass("app");
	$('<a href="#" id="scanFromWrapper"><img src="emptyCart.png" onClick="startScanner()" style="width:99%;"/></a>').appendTo(document.getElementById('wrapper'));
/* 	var wrapper = document.getElementById('wrapper');
	var atemp = document.createElement('a');
	var imgtemp = document.createElement('img');
	
	imgtemp.setAttribute("src",'emptyCart.jpg');
	
	atemp.appendChild(imgtemp);
	
	atemp.id = "scan";
	atemp.setAttribute("href",'#');
	
	wrapper.appendChild(atemp); */
	//app.initialize();
	}
}