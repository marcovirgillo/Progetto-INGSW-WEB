<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport"
		content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
	<title>CryptoView - Admin Login</title>
	<link rel="stylesheet"
		href="../../admin_assets/css/login.css">
</head>

<body>
	<div class="container">
		<div class="screen">
			<div class="screen__content">
				<form class="login" method="POST" action="doLogin">
					<div class="login__field">
						<i class="login__icon fas fa-user"></i>
						<input name="username" type="text" class="login__input" placeholder="Username">
					</div>
					<div class="login__field">
						<i class="login__icon fas fa-lock"></i>
						<input name="password" type="password" class="login__input" placeholder="Password">
					</div>
					<button class="button login__submit">
						<span id="login-btn" class="button__text">Log In Now</span>
						<i class="button__icon fas fa-chevron-right"></i>
					</button>				
				</form>
			</div>
			<div class="screen__background">
				<span class="screen__background__shape screen__background__shape4"></span>
				<span class="screen__background__shape screen__background__shape3"></span>		
				<span class="screen__background__shape screen__background__shape2"></span>
				<span class="screen__background__shape screen__background__shape1"></span>
			</div>		
		</div>
	</div>
</body>

</html>