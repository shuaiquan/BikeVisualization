package servlets;

import java.io.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import java.sql.*;

import org.json.*;

import dao.ConnDB;

public class searchStation extends HttpServlet{
	protected void doGet(HttpServletRequest request,HttpServletResponse response) throws ServletException,IOException{
		doPost(request,response);
	}
	
	protected void doPost(HttpServletRequest request,HttpServletResponse response) throws ServletException,IOException{
		try{
			ConnDB conn = new ConnDB();
			Connection link = conn.getConnect();
			
			Statement stat = link.createStatement();
			Statement stat2 = link.createStatement();
			String sql = "";
			ResultSet rs;
			ResultSet rs2;
			String[] lesta = new String[2489];
			String[] sta = new String[1732];
			int i=0,j=0;
			sql = "select leasestation from b_leaseinfohis_sum group by leasestation";
			rs = stat.executeQuery(sql);
			while(rs.next()){
				lesta[i] = rs.getString(1);
				i++;
			}
			
			sql = "select stationid from b_stationinfo_brief";
			rs2 = stat2.executeQuery(sql);
			while(rs2.next()){
				sta[j] = rs2.getString(1);
				j++;
			}
			
			JSONArray datas = new JSONArray();
			for(i=0;i<2489;i++){
				for(j=0;j<1732;j++){
					if(lesta[i].equals(sta[j])){
						break;
					}
				}
				if(j>=1732){
					JSONObject data = new JSONObject();
					data.put("id",lesta[i]);
					datas.put(data);
				}
			}
			/*for(j=0;j<1732;j++){
				for(i=0;i<2489;i++){
					if(sta[j].equals(lesta[i])){
						break;
					}
				}
				if(i>=2489){
					JSONObject data = new JSONObject();
					data.put("id",sta[j]);
					datas.put(data);
				}
			}*/

			
			File file = new File("D:\\notfindsta.json");
			FileOutputStream outFile = new FileOutputStream(file);
			outFile.write(datas.toString().getBytes("UTF-8"));
			outFile.flush();
			outFile.close();
			
			response.setContentType("text/json;charset=utf-8");
	  		PrintWriter out = response.getWriter();
	  		out.write(datas.toString());
			
			
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}
