package dao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;

import org.json.JSONArray;

import bean.Feature;
import bean.Freq;

public class UserFreq {
	private Connection link;	//远程数据库连接
	private Connection conn;	//本地数据库连接
	
	public UserFreq(){
		LocalDB ldb = new LocalDB();
		RemoteDB rdb = new RemoteDB();
		
		
		link = rdb.getLink();
		conn = ldb.getLink();
	}
	
	public void getHourFreq(String cardno){
		ArrayList<String> dates = getMonth(4);
		ArrayList<String> weekends = getWeekend(4);
		ArrayList<String> holidays = getHoliday(4);
		ArrayList<String> hours = getHour();
		
		int i=0;
		
		String dStr = "(";
		String wStr = "(";
		String hStr = "(";
		
		for(i=0; i<dates.size(); i++){
			if(!weekends.contains(dates.get(i)) && !holidays.contains(dates.get(i))){
				dStr += "'" + dates.get(i) + "'";
				if(i<dates.size()-1){
					dStr += ",";
				}
			}
		}
		dStr += ")";
		
		for(i=0; i<weekends.size(); i++){
			wStr += "'" + weekends.get(i) + "'";
			if(i<weekends.size()-1){
				wStr += ",";
			}
		}
		wStr += ")";
		
		for(i=0; i<holidays.size(); i++){
			hStr += "'" + holidays.get(i) + "'";
			if(i<holidays.size()-1){
				hStr += ",";
			}
		}
		hStr += ")";
		
		String sql;
		int[] dArr = new int[17];
		int[] wArr = new int[17];
		int[] hArr = new int[17];
		
		try {
			Statement stmt = link.createStatement();
			ResultSet rs = null;
						
			for(i=0; i<hours.size(); i++){
				sql = "select count(*) from b_leaseinfohis_brief where cardno='"+ cardno +"' and leasehour='"+ hours.get(i) + "' and leaseday in "+ dStr;
				rs = stmt.executeQuery(sql);
				
				if(rs.next()){
					dArr[i] = rs.getInt(1);
				}
			}
			
			for(i=0; i<hours.size(); i++){
				sql = "select count(*) from b_leaseinfohis_brief where cardno='"+ cardno +"' and leasehour='"+ hours.get(i) + "' and leaseday in "+ wStr;
				rs = stmt.executeQuery(sql);
				
				if(rs.next()){
					wArr[i] = rs.getInt(1);
				}
			}
			
			for(i=0; i<hours.size(); i++){
				sql = "select count(*) from b_leaseinfohis_brief where cardno='"+ cardno +"' and leasehour='"+ hours.get(i) + "' and leaseday in "+ hStr;
				rs = stmt.executeQuery(sql);
				
				if(rs.next()){
					hArr[i] = rs.getInt(1);
				}
			}
			
			String sql1 = "insert into userfreq values ('"+ cardno + "', "+ 1 +", ";
			String sql2 = "insert into userfreq values ('"+ cardno + "', "+ 2 +", ";
			String sql3 = "insert into userfreq values ('"+ cardno + "', "+ 3 +", ";
			
			for(i=0; i<dArr.length; i++){
				sql1 += "" + dArr[i];
				if(i<dArr.length-1){
					sql1 += ", ";
				}
			}
			sql1 += ")";
			
			for(i=0; i<wArr.length; i++){
				sql2 += "" + wArr[i];
				if(i<wArr.length-1){
					sql2 += ", ";
				}
			}
			sql2 += ")";
			
			for(i=0; i<hArr.length; i++){
				sql3 += "" + hArr[i];
				if(i<hArr.length-1){
					sql3 += ", ";
				}
			}
			sql3 += ")";
			
			Statement stmt_c = conn.createStatement();
			stmt_c.executeUpdate(sql1);
			stmt_c.executeUpdate(sql2);
			stmt_c.executeUpdate(sql3);
			
			rs.close();
			stmt.close();
			stmt_c.close();
			
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	
	public JSONArray getResult(ArrayList<ArrayList<Feature>> features){
		int i=0, j=0, k=0;
		String name;
		String sql1, sql2, sql3;
		
		JSONArray data = new JSONArray();
		
		for(; i<features.size(); i++){
			JSONArray kArr = new JSONArray();
			JSONArray dArr = new JSONArray();
			JSONArray wArr = new JSONArray();
			JSONArray hArr = new JSONArray();
			
			int[] dH = new int[17];
			int[] wH = new int[17];
			int[] hH = new int[17];
			
			try {
				Statement stmt = conn.createStatement();
				ResultSet rs = null;
			
				for(j=0; j<features.get(i).size(); j++){
					
					name = features.get(i).get(j).getCardno();
					
					sql1 = "select * from userfreq where cardno='"+name+"' and type=1 and rownum<=4500";
					sql2 = "select * from userfreq where cardno='"+name+"' and type=2 and rownum<=4500";
					sql3 = "select * from userfreq where cardno='"+name+"' and type=3 and rownum<=4500";
						
					rs = stmt.executeQuery(sql1);
					if(rs.next()){
						for(k=0; k<17; k++){
							dH[k] += rs.getInt(k+3);
						}
					}
					
					rs = stmt.executeQuery(sql2);
					if(rs.next()){
						for(k=0; k<17; k++){
							wH[k] += rs.getInt(k+3);
						}
					}
					
					rs = stmt.executeQuery(sql3);
					if(rs.next()){
						for(k=0; k<17; k++){
							hH[k] += rs.getInt(k+3);
						}
					}
		
				}
				stmt.close();
				rs.close();
			}catch(Exception e){
				e.printStackTrace();
			}
			
			try {
				for(k=0; k<17; k++){
					dArr.put((double)dH[k]/features.get(i).size());
					wArr.put((double)wH[k]/features.get(i).size());
					hArr.put((double)hH[k]/features.get(i).size());
				}
			}catch(Exception e){
				e.printStackTrace();
			}
			
			kArr.put(dArr);
			kArr.put(wArr);
			kArr.put(hArr);
			
			data.put(kArr);
		}
		
		return data;
	}
	//创建并返回月份日期数组
	private ArrayList<String> getMonth(int month){
		int days = 0;
		int i = 0;
		String dayStr = "2014-";
		ArrayList<String> dates = new ArrayList<String>();
		
		switch(month){
			case 3: 
				days = 31;
				dayStr += "03-";
				break;
			case 4: 
				days = 30;
				dayStr += "04-";
				break;
			case 5: 
				days = 31;
				dayStr += "05-";
				break;
			case 6: 
				days = 30;
				dayStr += "06-";
				break;
			case 7: 
				days = 31;
				dayStr += "07-";
				break;
			default:
				break;
 		}
		
		for(i=1; i<=days; i++){
			if(i<10){
				dates.add(dayStr + "0" + i);
			}else{
				dates.add(dayStr + i);
			}
		}
		
		return dates;
	}
	
	//返回假期数组
	private ArrayList<String> getHoliday(int month){
		ArrayList<String> holidays = new ArrayList<String>();
		
		switch(month){
			case 4:
				holidays.add("2014-04-04");
				holidays.add("2014-04-05");
				holidays.add("2014-04-06");
				break;
			default:
				break;
		}
		
		return holidays;
	}
	
	//返回周末数组
	private ArrayList<String> getWeekend(int month){
		ArrayList<String> weekend = new ArrayList<String>();
		
		switch(month){
			case 4:
				weekend.add("2014-04-12");
				weekend.add("2014-04-13");
				weekend.add("2014-04-19");
				weekend.add("2014-04-20");
				weekend.add("2014-04-26");
				weekend.add("2014-04-27");
				break;
			default:
				break;
		}
		
		return weekend;
	}
	
	//返回小时数组
	private ArrayList<String> getHour(){
		ArrayList<String> hour = new ArrayList<String>();
		int i=6;
		
		for(; i<=22; i++){
			if(i<10){
				hour.add("0" + i);
			}else{
				hour.add("" + i);
			}
		}
		
		return hour;
	}
}
