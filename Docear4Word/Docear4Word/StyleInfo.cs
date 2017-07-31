using System;
using System.IO;
using System.Runtime.InteropServices;
using System.Xml;

namespace Docear4Word
{
	[ComVisible(false)]
	public class StyleInfo
    {
        const string ParentXPath = "//x:style/x:info/x:link[@rel=\"independent-parent\"]";

		public FileInfo FileInfo { get; set; }
		public string Title { get; set; }
		public string Summary { get; set; }

		public string GetXml()
		{
            var doc = new XmlDocument();
            var xmlNamespaceManager = new XmlNamespaceManager(doc.NameTable);
            xmlNamespaceManager.AddNamespace("x", StyleHelper.StyleXmlNamespace);
            doc.Load(FileInfo.FullName);

            var node = doc.SelectSingleNode(ParentXPath, xmlNamespaceManager);
            if (node != null)
            {
                var url = node.Attributes["href"].Value;
                StyleHelper.LoadFromWebOrCache(doc, url);
            }
            return doc.OuterXml;
		}

		public override string ToString()
		{
			return Title;
		}
	}
}