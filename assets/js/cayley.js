$(document).ready(function(){
	$("#btn2").click(function(){
		document.getElementById("sup").style.backgroundColor = `rgb(${Math.floor(Math.random()*1000)%256},${Math.floor(Math.random()*1000)%256},${Math.floor(Math.random()*1000)%256}`
	});

	$("form").on("submit", function(event){
		event.preventDefault();
		let formValues = $(this).serialize()

		let output = document.getElementById("outer")

		if(output){
			output.parentElement.removeChild(output)
		}
			$.ajax({
				url:'cgi/cayley.py',
				headers:{'Content-Type': 'application/x-www-form-urlencoded'},
				type:'GET',
				data:formValues,
				success: function(result){
					$("#out").append("<div id=\"outer\"></div>")
					$("#outer").append(`<legend id=\"leg\">Cayley Table for S${document.getElementById("num").value}</legend>`)
					$("#outer").append("<div id=\"tbl\"></div>")
					$("#tbl").append(`${result}`)
					console.log("DONE")

					let tableData = document.querySelectorAll(".data")
					let tableHeads = document.querySelectorAll(".heads")
					let allCells = [...tableData, ...tableHeads]
					
					let ids = ['rgba(0, 80, 0, 0.7)','rgba(0, 80, 0, 0.2)','rgba(250, 80, 0, 0.5)']

					allCells.map(value => {
						$("#"+value.id).hover(function(){
							if(value.getAttribute("class")=="data"){
								_id_ = value.id.split("_")
								allCells.forEach(element => {
									if((element.id.split("_")[0]==_id_[0] || element.id.split("_")[1]==[_id_[1]])&&(parseInt(element.id.split("_")[0])<=_id_[0] && parseInt(element.id.split("_")[1])<=parseInt(_id_[1]))){
										element.style.backgroundColor = "rgba(250, 80, 0, 0.4)";
										element.style.boxShadow="inset .05em .05em .05em white";
										element.style.color="lime";
									}
								});
							}
						});
						$("#"+value.id).mouseout(function(){
							if(value.getAttribute("class")=="data"){
								_id_ = value.id.split("_")
								allCells.forEach(element => {
									if((element.id.split("_")[0]==_id_[0] || element.id.split("_")[1]==[_id_[1]])&&(parseInt(element.id.split("_")[0])<=_id_[0] && parseInt(element.id.split("_")[1])<=parseInt(_id_[1]))){
										element.style.color="white";
										element.style.boxShadow="inset .05em .05em .05em "+ids[2];

										if(element.getAttribute("class")=="data"){
											element.style.backgroundColor = ids[1];
										}else{
											element.style.backgroundColor = ids[0];
										}
									}
								});
							}
						});
					});
				},
				error:function(){
					console.log("Server Error")
			}
		});
	});
});

function addRowColumnSelection(){

}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

let stringToHTML = function (str) {
	let parser = new DOMParser();
	let doc = parser.parseFromString(str, 'text/html');
	return doc.innerHTML;
};