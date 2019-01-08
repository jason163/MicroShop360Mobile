let uploadFile = (url, file)=> {
	return new Promise((resolve, reject)=> {
		let xhr = new XMLHttpRequest();
		xhr.addEventListener("readystatechange", ()=> {
			if (xhr.readyState === 4 && xhr.status === 200) {
				resolve(JSON.parse(xhr.responseText));
			}
		}, false);
		xhr.addEventListener("error", ()=> {
			reject(xhr, file);
		}, false);
		let fd = new FormData();
		xhr.open("POST", url, true);
		// xhr.setRequestHeader("user-authorize", $sessionStorage.token);
		fd.append('file', file);
		xhr.send(fd);
	});
}

export default {
	uploadFile
}