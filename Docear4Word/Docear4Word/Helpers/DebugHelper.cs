using System;
using System.IO;

namespace Docear4Word
{
	public static class DebugHelper
	{
/*
		public static EventListener AttachToAllEvents(object target)
		{
			if (target == null) throw new ArgumentNullException("target");

			return new EventListener(target);
		}
*/
        public static void Log(object msg)
        {
            var str = "--------------------   " + DateTime.Now.ToLongTimeString() + "   --------------------\r\n" + msg.ToString() + "\r\n";
            File.AppendAllText(FolderHelper.DocearErrorLogFilename, str);
        }
	}

/*
	public class EventListener
	{
		object target;

		internal EventListener(object target)
		{
			this.target = target;
		}

		public void Attach()
		{
			target.GetType().GetEvents();

			foreach (var @event in target.GetType().GetEvents())
			{
				var eventHandlerType = @event.EventHandlerType;
				Type.
			}
		}
	}
*/
}