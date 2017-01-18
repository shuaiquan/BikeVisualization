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

public class getHeatMapByDay extends HttpServlet{
	protected void doGet(HttpServletRequest request,HttpServletResponse response) throws ServletException,IOException{
		doPost(request,response);
	}
	
	protected void doPost(HttpServletRequest request,HttpServletResponse response) throws ServletException,IOException{
		String date = request.getParameter("date");
		String dataFrom = request.getParameter("dataFrom");
		
		try{
			ConnDB conn = new ConnDB();
			Connection link = conn.getConnect();
			
			Statement stat = link.createStatement();
			Statement stat2 = link.createStatement();
			String sql = "";			
			ResultSet rs;
			ResultSet rs2;
			if(dataFrom.equals("1")){
				sql = "select leasestation,sum(bikenum) from b_leaseinfohis_sum_byday where leasedate='"+date+"' group by leasestation";
			}else if(dataFrom.equals("2")){
				sql = "select returnstation,sum(bikenum) from b_returninfohis_sum_byday where returndate='"+date+"' group by returnstation";
			}
					
			rs = stat.executeQuery(sql);
			JSONArray datas = new JSONArray();
			while(rs.next()){
				sql = "select baidu_x,baidu_y from b_stationinfo_brief where stationid='"+rs.getString(1)+"'";
				int num = rs.getInt(2);
				rs2 = stat2.executeQuery(sql);
				if(rs2.next()){
					JSONObject data = new JSONObject();
					data.put("lng", rs2.getString(1));
					data.put("lat", rs2.getString(2));
					data.put("num", num);
					datas.put(data);
				}
			}
			
			response.setContentType("text/json;charset=utf-8");
			PrintWriter out  = response.getWriter();
			out.write(datas.toString());
			
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}
