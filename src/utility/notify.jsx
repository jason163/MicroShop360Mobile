
let showMessage=(message)=>{
	alert(message);
};

let showError=(message)=>{
	alert(message);
};

let showAlert=(message)=>{
	alert(message);
};

let showConfirm=(message)=>{
	confirm(message);
};

export default {
	error:showError
	,message:showMessage
	,alert:showAlert
	,confirm:showConfirm
}