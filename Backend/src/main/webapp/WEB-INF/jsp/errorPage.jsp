<%@ page contentType="text/html;charset=UTF-8" language="java" %> 
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
	<title>Error page</title>
	<link rel="stylesheet" href="../../admin_assets/css/errorPage.css">
</head>

<body>  
	<div class="error-page">
		<img class="error-image" src="../../admin_assets/logos/403.png"/>
		<p class="error-text">${text}</p>
		
		<a href="/admin/login">
			<div id="homeButton" class="btn home-btn">
				<img src="../../admin_assets/logos/home.png" width="24" height="24" />
				<p>Login</p>
			</div>
		</a>
		
	</div>
		
</body>

</html>