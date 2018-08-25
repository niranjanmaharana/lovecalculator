<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
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
.content table{margin: 0px auto; text-align: center;}
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
		<div>${meessage}</div>
		<div class='header'>
			<div class='title'>
				<span class='love-result'>${crush.result}</span>
			</div>
		</div>
		<div class='content'>
			<table>
				<tr><th>Your Name:</th><td>${crush.userName}</td></tr>
				<tr><th>Your Crush Name:</th><td>${crush.crushName}</td></tr>
				<tr><th>Result:</th><td>${crush.percentage} %</td></tr>
				<tr>
					<td colspan="2"><a href="${pageContext.request.contextPath}/crush/lovecalCulator">Find your compatibility</a></td>
				</tr>
			</table>
		</div>
	</div>
	<div class='footer'>Designed and developed by @niranjan</div>
</body>
</html>