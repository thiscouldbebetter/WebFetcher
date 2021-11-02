
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

function buttonParse_Clicked()
{
	var d = document;

	var textareaDataFetched =
		d.getElementById("textareaDataFetched");
	var divDataParsed =
		d.getElementById("divDataParsed");

	var textToParse = textareaDataFetched.value;

	var dataParsedAsTree = TreeViewNode.fromString(textToParse);

	var dataParsedAsDomElement = dataParsedAsTree.toDomElement();

	divDataParsed.innerHTML = "";
	divDataParsed.appendChild(dataParsedAsDomElement);
}

class HtmlDocumentHelper
{
	static htmlCollectionToArray(htmlCollection)
	{
		var returnArray = [];

		for (var i = 0; i < htmlCollection.length; i++)
		{
			var element = htmlCollection[i];
			returnArray.push(element);
		}

		return returnArray;
	}
}

class TreeViewNode
{
	constructor(data, text, children)
	{
		this.data = data;
		this.text = text;
		this.children = children || [];

		this.isExpanded = false;
	}

	static fromHtmlNode(htmlNode)
	{
		var childrenAsArray =
			HtmlDocumentHelper.htmlCollectionToArray
			(
				htmlNode.children
			);

		var childrenAsTreeViewNodes = childrenAsArray.map
		(
			x => TreeViewNode.fromHtmlNode(x)
		);

		var text = htmlNode.constructor.name;

		var thisAsNode = new TreeViewNode
		(
			htmlNode,
			text,
			childrenAsTreeViewNodes
		);

		return thisAsNode;
	}

	static fromString(textToParse)
	{
		var dataParsed =
			new DOMParser().parseFromString(textToParse, "text/html");

		var returnValue = TreeViewNode.fromHtmlNode(dataParsed);

		return returnValue;
	}

	toDomElement()
	{
		var treeViewNode = this;

		var d = document;

		if (this.domElement == null)
		{
			var nodeAsLiElement = d.createElement("li");

			var attributes = this.data.attributes;
			var attributesAsUlElement = d.createElement("ul");

			var propertiesAsUlElement = d.createElement("ul");

			var attributeIdValue = null;

			if (attributes != null)
			{
				for (var i = 0; i < attributes.length; i++)
				{
					var attribute = attributes[i];
					var attributeName = attribute.name;
					var attributeValue = attribute.value;

					if (attributeName == "id")
					{
						attributeIdValue = attributeValue;
					}

					var attributeNameAndValue =
						attributeName + "='" + attributeValue + "'";
					var attributeAsDomElement = d.createElement("li");
					attributeAsDomElement.innerText = attributeNameAndValue;
					attributesAsUlElement.appendChild(attributeAsDomElement);
				}

				var attributesAsLiElement = d.createElement("li");
				attributesAsLiElement.innerHTML = "<div>Attributes:</div>";
				attributesAsLiElement.appendChild(attributesAsUlElement);
				propertiesAsUlElement.appendChild(attributesAsLiElement);
			}

			if (this.innerText != null)
			{
				var innerTextAsLiElement = d.createElement("li");
				innerTextAsLiElement.innerHTML = "<div>Inner Text:</div>";
				innerTextAsLiElement.appendChild(innerTextAsUlElement);
				propertiesAsUlElement.appendChild(innerTextAsLiElement);
			}

			if (this.children.length > 0)
			{
				var childrenAsUlElement = d.createElement("ul");

				for (var i = 0; i < this.children.length; i++)
				{
					var child = this.children[i];
					var childAsDomElement = child.toDomElement();
					childrenAsUlElement.appendChild(childAsDomElement);
				}

				var childrenAsLiElement = d.createElement("li");
				childrenAsLiElement.innerHTML = "<div>Children:</div>";
				childrenAsLiElement.appendChild(childrenAsUlElement);

				propertiesAsUlElement.appendChild(childrenAsLiElement);
			}

			var buttonExpandOrCollapse =
				d.createElement("button");

			buttonExpandOrCollapse.innerHTML = "+";
			propertiesAsUlElement.style.display = "none";

			buttonExpandOrCollapse.onclick = () =>
			{
				treeViewNode.isExpanded =
					(treeViewNode.isExpanded == false);
				buttonExpandOrCollapse.innerHTML =
					(treeViewNode.isExpanded ? "-" : "+");
				propertiesAsUlElement.style.display =
					(treeViewNode.isExpanded ? "block" : "none");
			};

			var text = this.text;
			if (attributeIdValue != null)
			{
				text += " id='" + attributeIdValue + "'";
			}
			var spanText = d.createElement("span");
			spanText.innerText = text;
			nodeAsLiElement.appendChild(spanText);

			nodeAsLiElement.appendChild(buttonExpandOrCollapse);

			nodeAsLiElement.appendChild(propertiesAsUlElement);

			this.domElement = nodeAsLiElement;
		}

		return this.domElement;
	}
}