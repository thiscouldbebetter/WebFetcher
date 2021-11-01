
function buttonFetch_Clicked()
{
	var d = document;

	var inputAddressToFetchFrom =
		d.getElementById("inputAddressToFetchFrom");
	var textareaDataFetched =
		d.getElementById("textareaDataFetched");

	var addressToFetchFrom =
		inputAddressToFetchFrom.value;

	var addressToFetchFromProxied = 
		"WebFetcher.php?url=" + addressToFetchFrom;

	fetch
	(
		addressToFetchFromProxied
	).then
	(
		(response) => response.text()
	).then
	(
		(textFetched) => textareaDataFetched.value = textFetched
	);
}
