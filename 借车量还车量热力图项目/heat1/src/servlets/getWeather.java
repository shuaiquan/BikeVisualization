package servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import java.sql.*;

import org.json.*;

import dao.ConnDB;

public class getWeather extends HttpServlet{
	protected void doGet(HttpServletRequest request,HttpServletResponse response) throws ServletException,IOException{
		doPost(request,response);
	}
	
	protected void doPost(HttpServletRequest request,HttpServletResponse response) throws ServletException,IOException{
		String date = request.getParameter("date");
		
		try{
			ConnDB conn = new ConnDB();
			Connection link = conn.getConnect();
			
			Statement stat = link.createStatement();
			String sql = "select maxtemp,mintemp,weatherstatus,windstatus from weather where wday='"+date+"'";
			ResultSet rs = stat.executeQuery(sql);
			JSONObject data = new JSONObject();
			if(rs.next()){
				data.put("maxtemp", rs.getInt("maxtemp"));
				data.put("mintemp", rs.getInt("mintemp"));
				data.put("weather", rs.getString("weatherstatus"));
				data.put("wind", rs.getString("windstatus"));
			}
			
			JSONArray datas = new JSONArray();
			datas.put(data);
			
			response.setContentType("text/json;charset=utf-8");
			PrintWriter out  = response.getWriter();
			out.write(datas.toString());
			
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}
