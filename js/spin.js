function minus_click(id){
//alert("inminus");
var actualId= id.split("__").pop();

var prev=$("#qt__"+actualId).val();
prev=parseInt(prev);
if(prev>=2)
{
$("#qt__"+actualId).val(prev-1);
changeQuantity("qt__"+actualId,(prev-1)+"");
}

}
function plus_click(id){
//alert("inplus");
var actualId= id.split("__").pop();
//alert(actualId);

var prev=$("#qt__"+actualId).val();
//alert(prev);

prev=parseInt(prev);
//alert(prev);

$("#qt__"+actualId).val((prev+1)+"");
changeQuantity("qt__"+actualId,(prev+1)+"");
}

function focus_out(id){
var actualId= id.split("__").pop();

var prev=$("#qt__"+actualId).val();
prev=parseFloat(prev)
if(isNaN(prev)){
$("#qt__"+actualId).val(1);
changeQuantity("#qt__"+actualId,"1");
}
else if(prev%1!=0){
$("#qt__"+actualId).val(1);
changeQuantity("#qt__"+actualId,"1");
}
else if(prev<=0){
$("#qt__"+actualId).val(1);
changeQuantity("#qt__"+actualId,"1");
}
}

function key_up(id)
{
//alert('in key_up');
var actualId= id.split("__").pop();
//alert(actualId);

var valu=$("#qt__"+actualId).val();
//alert(valu);

var character=valu[valu.length-1];
//alert(character);

if(valu=="")
{
//alert('in if');
return;
}
else if(isNaN(parseInt(character))) {
	//alert('in else if');
	var i=checkIfPresent(actualId);
	$("#qt__"+actualId).val(cart[i].qty);}
else{
//alert('in else');
	changeQuantity(id,valu);
}
	
}

