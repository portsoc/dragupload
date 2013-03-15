<?php
header("Content-Type: application/json");
$response['request'] = $_REQUEST;
$response["files"] = $_FILES;

//if (is_uploaded_file($_FILES['file']['tmp_name'])) {
	$response["filename"] = $_FILES['file']['tmp_name'];
	$response["md5"] =  md5_file( $_FILES['file']['tmp_name'] );
// } else {
// 	$response['fail'] = "Failed to upload file '".$_FILES['file']['tmp_name'];
// }
echo json_encode($response);
?>
