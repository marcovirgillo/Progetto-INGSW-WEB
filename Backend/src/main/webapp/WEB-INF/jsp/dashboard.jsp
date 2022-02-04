<%@ page contentType="text/html;charset=UTF-8" language="java" %> 
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
	<title>CryptoView - Admin Dashboard</title>
	<link rel="stylesheet"
		href="../../admin_assets/css/dashboard.css">
</head>

<body>  
	<div class="dashboard">
		<div class="app-bar">
			<img src="../../admin_assets/logos/CryptoViewLogo.png" width="96" height="96" />
			<p class="page-name">CryptoView Administration </p>
		</div>
		<div class="dashboard-content">
			<div class="assets-div">
				<div class="add-new-field">
					<fieldset>
						<input type="text" placeholder="Ticker" id="tickerField" />
						<input type="text" placeholder="Name" id="nameField" />
						<input type="text" placeholder="ID" id="idField" />
						<input type="text" placeholder="API ID" id="apiIdField" />
					</fieldset>
					<div class="add-new-btn">
						<img src="../../admin_assets/logos/plus.png" width="24" height="24" />
						<p>Add Asset</p>
					</div>
				</div>
				<p class="label">Supported Assets</p>
				<div class="table-wrapper">
					<table class="table table-dark">
						<thead class="thead-dark">
							<tr>
								<th scope="col">#</th>
								<th scope="col">Ticker</th>
								<th scope="col">Name</th>
								<th scope="col">ID</th>
								<th scope="col">API ID</th>
								<th scope="col"></th>
							</tr>
						</thead>
						<tbody>
							<c:forEach items="${cryptos}" var="crypto" varStatus="loop">
								<tr>
									<th scope="col">${loop.index + 1}</th>
									<th scope="row">${crypto.ticker}</th>
									<th scope="row">${crypto.name}</th>
									<th scope="row">${crypto.idApi}</th>
									<th scope="row">${crypto.idGraphic}</th>
									<th scope="row">
										<img src="../../admin_assets/logos/remove.png" width="24" height="24"/>
									</th>
								</tr>
							</c:forEach>
					</table>
				</div>
			</div>

			<div class="users-div">
				<div class="add-new-field">
					<fieldset>
						<input type="text" placeholder="Username" id="usernameField" />
						<input type="text" placeholder="Email" id="emailField" />
						<input type="text" placeholder="Password" id="passwordField" />
					</fieldset>
					<div class="add-new-btn">
						<img src="../../admin_assets/logos/plus.png" width="24" height="24" />
						<p>Add User</p>
					</div>
				</div>
				<p class="label">Registered Users</p>
				<div class="table-wrapper">
					<table class="table table-dark">
					<thead class="thead-dark">
						<tr>
							<th scope="col">#</th>
							<th scope="col">Username</th>
							<th scope="col">Email</th>
							<th scope="col"></th>
						</tr>
						</thead>
						<tbody>
						<c:forEach items="${users}" var="user" varStatus="loop">
							<tr>
								<th scope="col">${loop.index + 1}</th>
								<th scope="row">${user.username}</th>
								<th scope="row">${user.email}</th>
								<th scope="row">
									<img src="../../admin_assets/logos/remove.png" width="24" height="24"/>
								</th>
							</tr>
						</c:forEach>
					</table>
				</div>
			</div>
		</div>
	</div>
</body>

</html>