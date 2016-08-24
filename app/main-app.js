if (document.location.protocol == "file:") {
	$(document).ready(function() {
		$("#fatalError .error-title").html("Application loading failed");
		$("#fatalError .error-msg").html("The application has to be accessed through a web server. Consult user guide for detail.");
		$("#fatalError").show();
	});
}
else {
	var i18n = null;
	define.amd.jQuery = true;
	
	require([
			"dojo/i18n!./resources/tpl/viewer/nls/template.js?v=" + app.version, 
			"esri/urlUtils", 
			"dojo/dom",
			"esri/dijit/Search",
			"esri/layers/FeatureLayer",
			"esri/InfoTemplate",
			"dojo/topic",
			"dojo/domReady!",
			"dojo/ready"
		], function(
			i18nViewer, 
			urlUtils,
			dom,
			Search,
			FeatureLayer,
			InfoTemplate,
			topic
		){

			i18n = i18nViewer;

			// When a section is being loaded (don't wait for the Main Stage media to be loaded)
			topic.subscribe("story-load-section", function(index){
				console.log("The section", index, "is being loaded");
			});

			// After a map is loaded (when the map starts to render)
			topic.subscribe("story-loaded-map", function(result){

				console.log("The map", result.id, "has been loaded from the section", result.index);
					var currmap=app.maps[result.id].response.map;
				console.log(app.maps[result.id].response.map);

					var search = new Search({
						enableButtonMode: true, //this enables the search widget to display as a single button
						enableLabel: false,
						enableInfoWindow: true,
						showInfoWindowOnSelect: true,
						addLayersFromMap:true,
						map: currmap,
						ZoomScale:10,
						enableHighlight:false
					}, "search");



				//*********CONFIGURE LAYER LIST FOR SEARCH
				//var layer= new FeatureLayer("http://services2.arcgis.com/Dw9pj3jJ00evBfqo/arcgis/rest/services/service_d3edafa4a1ed417cb9a99d60810fae8c/FeatureServer/0");
                //
				//var sources = search.get("sources");
                //
				////Push the sources used to search, by default the ArcGIS Online World geocoder is included. In addition there is a feature layer of US congressional districts. The districts search is set up to find the "DISTRICTID". Also, a feature layer of senator information is set up to find based on the senator name.
                //
				//sources.push({
				//	featureLayer: layer,
				//	searchFields: ["Gname"],
				//	//displayField: "DISTRICTID",
				//	exactMatch: false,
				//	outFields: ["*"],
				//	name: "Dumping Points ",
				//	placeholder: "3708",
				//	maxResults: 6,
				//	maxSuggestions: 6
                //
				//	//Create an InfoTemplate and include three fields
				//	//infoTemplate: new InfoTemplate("Dumping Point", "Name: ${Gname}"),
				//	//enableSuggestions: true,
				//	//minCharacters: 0
				//});
                //
                //
				////Set the sources above to the search widget
				//search.set("sources", sources);

				search.startup();


			});


		 	require([
					"storymaps/common/Core", 
					"storymaps/tpl/core/MainView"
				], function(
					Core, 
					MainView
				){
		 			if (app.isInBuilder) {
						require([
								"storymaps/common/builder/Builder", 
								"storymaps/tpl/builder/BuilderView" ,
								"dojo/i18n!./resources/tpl/builder/nls/template.js?v=" + app.version,
								"dojo/i18n!commonResources/nls/core.js?v=" + app.version,
								"dojo/i18n!commonResources/nls/media.js?v=" + app.version,
								"dojo/i18n!commonResources/nls/webmap.js?v=" + app.version,
								"dojo/i18n!commonResources/nls/mapcontrols.js?v=" + app.version,
								"dojo/_base/lang"
							], function(
								Builder, 
								BuilderView,
								i18nBuilder,
								i18nCommonBuilder,
								i18nCommonMedia,
								i18nCommonWebmap,
								i18nCommonMapControls,
								lang
							){
								lang.mixin(i18n, i18nBuilder);
								lang.mixin(i18n, i18nCommonBuilder);
								lang.mixin(i18n, i18nCommonMedia);
								lang.mixin(i18n, i18nCommonWebmap);
								lang.mixin(i18n, i18nCommonMapControls);
								
								var builderView = new BuilderView(Core),
								mainView = new MainView(builderView);
								
								Core.init(mainView, Builder);
								Builder.init(Core, builderView);
							}
						);
					}
					else {
						Core.init(new MainView());
					}
		 		}
			);
		}
	);
}