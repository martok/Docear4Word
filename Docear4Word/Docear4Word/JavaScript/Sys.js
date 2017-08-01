
CreateEngine = function(style) {
	var abbreviations = {
		"default": { }
	};

	var sys = new Sys(abbreviations);

	var engine = new CSL.Engine(sys, style);

	engine.setOutputFormat("markup");

	return engine;
};

// Load Sys
var Sys = function (abbreviations) {
	this.callback = window.external;
	this.abbreviations = abbreviations;
	this.abbrevsname = "default";
	if (!this.abbreviations) {
		this.abbreviations = {};
	}
};

Sys.prototype.retrieveItem = function (id) {
	return this.callback.RetrieveItemByID(id);
	//return data[id];
};

Sys.prototype.retrieveLocale = function (lang) {
	var loc = this.callback.Script_GetLocaleXML(lang);
	return loc || {};
};

Sys.prototype.getAbbreviation = function (dummy, obj, jurisdiction, vartype, key) {
//alert("in getAbbreviations");
	try {
		if (this.abbreviations[this.abbrevsname][vartype][key]) {
			obj["default"][vartype][key] = this.abbreviations[this.abbrevsname][vartype][key];
		} else {
			obj["default"][vartype][key] = "";
		}
	} catch (e) {
		// There is breakage here that needs investigating.
	}
};

Sys.prototype.setAbbreviations = function(abbrevsname) {
	this.abbrevsname = abbrevsname;
};

getSortedRegistryItems = function(engine) {
	return engine.registry.getSortedRegistryItems();
};

getCitationByIndex = function(engine) {
	return engine.registry.citationreg.citationByIndex;
};

getcitationStringByIndex = function (engine, citationIndex) {
	var citation = getCitationByIndex(engine) [citationIndex];
	return engine.process_CitationCluster(citation.sortedItems, citation.citationID);
}

getCSLProcessorVersion = function() {
	return CSL.PROCESSOR_VERSION;
}

CSL.Output.Formats.markup = {
    "text_escape": function (text) {
        if (!text) {
            text = "";
        }
        return text.replace(/&/g, "&#38;")
            .replace(/</g, "&#60;")
            .replace(/>/g, "&#62;")
            .replace("  ", "&#160; ", "g")
            .replace(CSL.SUPERSCRIPTS_REGEXP,
                     function(aChar) {
                         return "<sup>" + CSL.SUPERSCRIPTS[aChar] + "</sup>";
                     });
    },
    "bibstart": "",
    "bibend": "",
    "@font-style/italic": "<i>%%STRING%%</i>",
    "@font-style/oblique": "<em>%%STRING%%</em>",
    "@font-style/normal": CSL.Output.Formatters.passthrough,
    "@font-variant/small-caps": "<smallcaps>%%STRING%%</smallcaps>",
    "@passthrough/true": CSL.Output.Formatters.passthrough,
    "@font-variant/normal": false,
    "@font-weight/bold": "<b>%%STRING%%</b>",
    "@font-weight/normal": false,
    "@font-weight/light": false,
    "@text-decoration/none": false,
    "@text-decoration/underline": "<u>%%STRING%%</u>",
    "@vertical-align/sup": "<sup>%%STRING%%</sup>",
    "@vertical-align/sub": "<sub>%%STRING%%</sub>",
    "@vertical-align/baseline": false,
    "@strip-periods/true": CSL.Output.Formatters.passthrough,
    "@strip-periods/false": CSL.Output.Formatters.passthrough,
    "@quotes/true": function (state, str) {
        if ("undefined" === typeof str) {
            return state.getTerm("open-quote");
        }
        return state.getTerm("open-quote") + str + state.getTerm("close-quote");
    },
    "@quotes/inner": function (state, str) {
        if ("undefined" === typeof str) {
            return "\u2019";
        }
        return state.getTerm("open-inner-quote") + str + state.getTerm("close-inner-quote");
    },
    "@quotes/false": false,
    "@bibliography/entry": function (state, str) {
        if (state.sys.embedBibliographyEntry) {
        	return str + "\n" + state.sys.embedBibliographyEntry(this.item_id) + "\n"
       	}
    	  else {
        	return str + "\n";
        }
    },
    "@display/block": function (state, str) {
        return "\n\n<csl-block>" + str + "</csl-block>\n";
    },
    "@display/left-margin": function (state, str) {
        return "<csl-left-margin>" + str + "</csl-left-margin>";
    },
    "@display/right-inline": function (state, str) {
        return "<csl-right-inline>" + str + "</csl-right-inline>";
    },
    "@display/indent": function (state, str) {
        return "<csl-indent>" + str + "</csl-indent>\n  ";
    }
};
