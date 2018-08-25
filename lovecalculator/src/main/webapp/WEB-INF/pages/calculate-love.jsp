<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Love Calculator</title>
<style>
body{background: url(images/love-calculator-background.jpg.png); background-color: white; color: maroon; font-size: 20px; font-family: arial;}
.wrapper{width: 90%; margin: 0px auto;}
.header{width: 100%; height: 150px;}
.header .title{text-align: center; font-size: 35px; font-weight: bold; color: red; text-shadow: 3px 3px 4px #AE009D;}
.content{width: 100%; height: 450px;}
.content table{margin: 0px auto;}
.content a{color: blue; font-size: 20px;}
.content input[type=text], select {width: 100%; padding: 12px 20px; margin: 8px 0; display: inline-block; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; color: maroon;}
.content input[type=submit] {width: 100%; background-color: red; color: white; padding: 14px 20px; margin: 8px 0; border: none; border-radius: 4px; cursor: pointer;}
.content input[type=submit]:hover {background-color: #c31616;}
.content input[type=text]:hover, select:hover {box-shadow: inset 0 1px 3px #ddd;}
.footer{width: 90%; margin: 0px auto; color: gray; text-align: center;}
</style>
</head>
<body>
	<div class='wrapper'>
		<div class='header'>
			<div class='title'>Find your compatibility</div>
		</div>
		<div class='content'>
			<img alt="" src="${pageContext.request.contextPath}/images/love-calculator-background.jpg">
			<form:form method="POST" action="${pageContext.request.contextPath}/crush/calculateLove" modelAttribute="crush">
				<form:hidden path="serialNo"/>
				<form:hidden path="percentage"/>
				<form:hidden path="result"/>
				<table>
					<tr>
						<td>
							<label for="userName">Enter your name</label>
							<input name="userName" type="text" placeholder='Your name' required/>
						</td>
					</tr>
					<tr>
						<td>
							<label for="crushName">Enter your crush name</label>
							<input name="crushName" type="text" placeholder='Your crush name' required/>
						</td>
					</tr>
					<tr>
						<td>
							<input type="submit" name="calculateLove" value="Calculate"/>
						</td>
					</tr>
				</table>
			</form:form>
		</div>
	</div>
	<div class='footer'>Designed and developed by @niranjan</div>
</body>
</html>