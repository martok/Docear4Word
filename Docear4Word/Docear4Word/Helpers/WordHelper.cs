using System;

using Word;

namespace Docear4Word
{
	public static class WordHelper
	{
		const float PointsPerCentimeter = 28.35f;

		public static float CMToPoints(float cm)
		{
			return cm * PointsPerCentimeter;
		}

		public static Range GetEndOfRange(Range range)
		{
			var result = range.Duplicate;
			result.Start = result.End;

			return result;
		}

        public static int WordVersion(Application app)
        {
            var s = app.Version.Split('.');
            int result = 0;
            if ((s.Length > 0) && Int32.TryParse(s[0], out result))
            {
                return result;
            }
            return 0;
        }

        public static void UndoBlockBegin(Application app)
        {
            if (WordVersion(app) >= 14) {
                var ur = app.GetType().InvokeMember("UndoRecord", System.Reflection.BindingFlags.GetProperty, null, app, null);
                var param = new Object[1] {"Docear4Word action"};
                ur.GetType().InvokeMember("StartCustomRecord", System.Reflection.BindingFlags.InvokeMethod, null, ur, param);
            }
        }

        public static void UndoBlockEnd(Application app)
        {
            if (WordVersion(app) >= 14)
            {
                var ur = app.GetType().InvokeMember("UndoRecord", System.Reflection.BindingFlags.GetProperty, null, app, null);
                ur.GetType().InvokeMember("EndCustomRecord", System.Reflection.BindingFlags.InvokeMethod, null, ur, null);
            }
        }
    }
}