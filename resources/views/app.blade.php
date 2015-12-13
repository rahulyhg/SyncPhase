<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>SyncPhase App</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<link rel="stylesheet" href="styles/main.css">
</head>
<body>
	@foreach ($templates as $id => $template)
		<template id="{{ $id }}_template">
			{!! $template !!}
		</template>
	@endforeach

	<script data-main="scripts/main.js?x=xx" src="components/requirejs/require.js"></script>
</body>
</html>