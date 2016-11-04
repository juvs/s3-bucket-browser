var bucket = null;

function listMoreObjects(marker, prefix, countFiles, countFolders) {
	$('#overlay').show();
	$('#status').html('<div id="statusimg"></div>Loading...');
	bucket.listObjects({MaxKeys: AWS_MaxKeys, Marker: marker, Prefix : prefix, Delimiter : '/' },function (err, data) {
		if (err) {
			$('#status').html('<img src="img/exclamation-red.png"> Could not load objects from S3');
		} else {
			var truncated = data.IsTruncated;
			var nextMarker = data.NextMarker;
			$('#moreobjects').remove();
			renderObjects(data.Contents, countFolders, countFiles, prefix, truncated, nextMarker);
		}
		$('#overlay').hide();
	});
};

function listObjects(prefix) {
	$('#overlay').show();
	$('#status').html('<div id="statusimg"></div>Loading...');
	$('#objects').empty();

	bucket.listObjects({MaxKeys: AWS_MaxKeys, Prefix : prefix, Delimiter : '/' },function (err, data) {
		if (err) {
			$('#status').html('<img src="img/exclamation-red.png"> Could not load objects from S3');
		} else {
			//Load folders...
			//Set breadcrumbs..
			var truncated = data.IsTruncated;
			var nextMarker = data.NextMarker;
			var currentFolder = '<a href="javascript:listObjects(\'\')"><span class="path">root</span></a>';
			var icon = '';
			if  (prefix !== '') {
				currentFolder += '/';
				var folders = prefix.split('/');
				var parent = '';
				var slash = '';
				var topFolder = '';
				for (var i = 0; i < folders.length - 1; i++) {
					if (folders[i] !== '') {
						var path = '';
						parent += slash + folders[i];
						if ( i > 0 ) {
							path = parent;
						} else {
							path = folders[i];
						}
						if ( i !== (folders.length - 2)) { 
							topFolder = path;
						}
						currentFolder += slash + '<a href="javascript:listObjects(\'' + path + '/\')"><span class="path">' + folders[i] + '</span></a>';
						slash = '/';
					}
				}
			}

			if (typeof topFolder != 'undefined') {
				if (topFolder !== '') {
					topFolder += '/';
				}
				icon = '<img src="img/arrow-090.png"/>'
				$('#objects').append('<li><a href="javascript:listObjects(\'' + topFolder + '\')">' + icon + '<span>...</span></a></li>');
			}
			$('#breadcrumb').html('Current folder is : ' + currentFolder);
			//Set folders...
			var countFolders = 0;
			for (var i = 0; i < data.CommonPrefixes.length; i++) {
				var currentPrefix = data.CommonPrefixes[i].Prefix;
				var name = (currentPrefix.replace(prefix, '')).replace('/','');
				icon = '<img src="img/folder-horizontal.png"/>'
				if (prefix !== currentPrefix) {
					countFolders++;
					$('#objects').append('<li><a href="javascript:listObjects(\'' + currentPrefix + '\')">' + icon + '<span>' + name + '</span></a></li>');
				}
			}
			
			renderObjects(data.Contents, countFolders, 0, prefix, truncated, nextMarker);
		}
		$('#overlay').hide();
	});
};

function renderObjects(contents, countFolders, currentCountFiles, prefix, truncated, nextMarker) {
	//Load files...
	var countFiles = currentCountFiles;
	for (var i = 0; i < contents.length; i++) {
		var key = contents[i].Key;
		var size = Math.ceil(contents[i].Size / 1024);
		var fileName = key.replace(prefix, '');
		icon = '<img src="img/document.png"/>'
		if (prefix !== key) {
			countFiles++;
			var params = {Bucket: 'bucket', Key: 'key'};
			$('#objects').append('<li><a href="javascript:getObject(\'' + key + '\')">' + icon + '<span>' + fileName + '</span><span class="size">' + size + 'K</span></a></li>');
		}
	}
	if (truncated) {
		$('#status').html('Loaded : ' + countFolders + ' folder(s), showing ' + countFiles + ' item(s) from S3, <a href="javascript:scrollToBottomListObjects()"><img src="img/arrow-270.png">Go to the bottom of the list to load more items.</a>');
		icon = '<img src="img/plus-circle.png"/>'
		$('#objects').append('<li id="moreobjects"><a href="javascript:listMoreObjects(\'' + nextMarker + '\',\'' + prefix + '\',' + countFiles + ',' + countFolders + ')">' + icon + '<span>Get more items...</span></a></li>');
	} else {
		$('#status').html('Loaded : ' + countFolders + ' folder(s), ' + countFiles + ' item(s) from S3');
	}			
}

function getObject(key) {
	var params = {Bucket: AWS_BucketName, Key: key, Expires: AWS_SignedUrl_Expires};
	var url = bucket.getSignedUrl('getObject', params);
	window.open(url, url);
}

function scrollToBottomListObjects() {
	$('#contents').scrollTop($('#contents').prop("scrollHeight"));
}

function init() {
	$('#headertitle').html(TITLE);
}

function runS3Browser() {
	AWS.config.region = AWS_Region;
	AWS.config.update({accessKeyId: AWS_AccessKeyId, secretAccessKey: AWS_SecretAccessKey});
	bucket = new AWS.S3({params: {Bucket: AWS_BucketName}});
	listObjects(AWS_Prefix);
}

function showLoginForm() {
	$('#overlay').hide();
	$("body").append(
		'<div id="loginForm">' +
		'<h2>AWS Credentials</h2><br />' +
		'<label for="AccessKeyId">AccessKeyId:</label> <input id="AccessKeyId" type="password" name="AccessKeyId" maxlength="21"><br />' +
		'<label for="SecretAccessKey">SecretAccessKey:</label> <input id="SecretAccessKey" type="password" name="SecretAccessKey" maxlength="41"><br /><br />' +
		'<input type="button" value="      Login      " onclick="login()">' +
		'</div>'
	);
}

function login() {
	// validation
	var AccessKeyId = $('input[name=AccessKeyId]').val();
	var SecretAccessKey = $('input[name=SecretAccessKey]').val();

	if (AccessKeyId === "" || SecretAccessKey === "") {
		return alert('AccessKeyId and SecretAccessKey are required');
	}

	// update config data
	AWS_AccessKeyId = AccessKeyId;
	AWS_SecretAccessKey = SecretAccessKey;

	$('#loginForm').remove();

	$('#overlay').show();
	runS3Browser()
}

$(document).ready(function() {
	init();

	// if keys are not available from config then ask user to provide those
	if (!AWS_SecretAccessKey) {
		showLoginForm();
	} else {
		runS3Browser();
	}
});
