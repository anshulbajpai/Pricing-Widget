package pricewidget;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import javax.servlet.http.*;

@SuppressWarnings("serial")
public class WidgetServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		
		StringBuilder builder = new StringBuilder();
		URL url = new URL(req.getParameter("url"));
		
		// Use this code when market is up
		try {			
			BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream()));
			String line;			
			while ((line = reader.readLine()) != null) {
				builder.append(line).append("\n");
			}
			reader.close();
		} catch (MalformedURLException e) {
			// ...
		} catch (IOException e) {
			
		}
		catch(Exception e){
			
		}
		
		// Use this code when market is down
//		try {
//			Thread.sleep(2000);
//		} catch (InterruptedException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		if(req.getParameter("url").contains("orderBookId"))
//			builder.append("1|2|USD|10@100;20@150|20@75;15@50");
//		else
//			builder.append("1|Opened|USD|10@100|20@75|25");
		resp.setContentType("text/plain");
		resp.getWriter().println(builder.toString());
	}
}
