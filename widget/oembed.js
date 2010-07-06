dojo.provide("widget.oembed");

dojo.require("dojo.io.script");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.ready(function(){
	dojo.declare("widget.oembed",
		[dijit._Widget, dijit._Templated],
		{
		// summary:
		//		A simple widget to embed oembed compatible media items.

		// yqlTableUrl:
		//		Url of yql data table definition.
		yqlTableUrl: 'http://static.uxebu.com/~nonken/sandbox/oembed/oembed.xml',

		// url:
		//		Url of media item to be displayed
		url: '',

		// yqlQuery:
		//		YQL query which gets passed url and yqlTableUrl.
		yqlQuery: 'http://query.yahooapis.com/v1/public/yql?q=use%20%22{yqlTableUrl}%22%20as%20oembed%3B%0Aselect%20*%20from%20oembed%20where%20url%3D%22{url}%22&format=json',

		// templateString:
		//		Template for component
		templateString: '<div dojoAttachPoint="domNode" class="oembedContainer"></div>',

		postMixInProperties: function(){
			// summary:
			//		Replaces values for YQL query.

			this.yqlQuery = dojo.replace(this.yqlQuery, {
				yqlTableUrl: escape(this.yqlTableUrl),
				url: escape(this.url)
			});
		},

		postCreate: function(){
			// summary:
			//		Calls YQL service and continues to render if data are available.

			dojo.io.script.get({
				url: this.yqlQuery,
				jsonp: "callback",
				load: dojo.hitch(this, function(data){
					if (data.query.count > 0 && data.query.results){
						this.render(data.query.results);
					}
				})
			})
		},

		render: function(data){
			// summary:
			//		Renders the retreived embed data.

			// If we have the html property we just embed the html
			if (data.oembed && data.oembed.html){
				this.domNode.innerHTML = data.oembed.html;
			}
		}
	});
});