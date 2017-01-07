package dao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;

import bean.Feature;

public class RawDataDao {
	
	private Connection link = null;		//远程数据库连接
	private Connection conn = null;		//本机数据库连接
	
	public RawDataDao(){
		
		LocalDB ldb = new LocalDB();
		RemoteDB rdb = new RemoteDB();
		
		
		link = rdb.getLink();
		conn = ldb.getLink();	
	}
	
	//创建不同月份用户的行为记录表
	public void createUserTable(int month){
		ArrayList<Feature> userlist = new ArrayList<Feature>();		//保存所有用户的特征
		
		userlist = getUserList(userlist);		//获取所有用户
		setUserList(userlist);		//插入所有用户
		//userlist = getUserDay(month, userlist);		//根据月份，精确到天取数据
		
	}
	
	//先获取所有用户
	private ArrayList<Feature> getUserList(ArrayList<Feature> userlist){
		
		String sql = "select cardno from b_leaseinfohis_brief where rownum<10000 group by cardno";
		
		try {
			Statement stmt = link.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			
			long start = System.currentTimeMillis();
			while(rs.next()){
				Feature user = new Feature();
				user.setCardno(rs.getString(1));
				userlist.add(user);
			}
			long end = System.currentTimeMillis();
			
			System.out.print("获取数据并保存：" + (end-start)/1000);
			rs.close();
			stmt.close();
			
		} catch(Exception e){
			e.printStackTrace();
		}
		
		return userlist;
	}
	
	private void setUserList(ArrayList<Feature> userlist){
		
		String sql = "";
		int i;

		try {
			Statement stmt = conn.createStatement();
			long start = System.currentTimeMillis();
			for(i=0; i<userlist.size(); i++){
				sql = "insert into b_userfeature (cardno) values (" + userlist.get(i).getCardno() + ")";
				
				stmt.executeUpdate(sql);
			}
			long end  = System.currentTimeMillis();
			System.out.print("写入数据:"+(end -start)/1000);
			stmt.close();
		}catch(Exception e){
			e.printStackTrace();
		}

	}
	
	//获取不同月份用户的原始记录
	private ArrayList<Feature> getUserDay(int month, ArrayList<Feature> userlist){
		ArrayList<String> days = getMonth(month);
		ArrayList<String> holiday = getHoliday(month);
		ArrayList<String> weekend = getWeekend(month);
		
		int i=0, j=0;
		
		for(; i<days.size(); ){
			if(holiday.contains(days.get(i)) || weekend.contains(days.get(i))){
				days.remove(i);
			}else{
				i++;
			}
		}
		
		String sql;
		
		try {
			Statement stmt  = link.createStatement();
			ResultSet rs = null;
			
			for(i=0; i<days.size(); i++){
				sql = "select cardno,count(*) from b_leaseinfohis_brief where leaseday='" + days.get(i) + "' group by cardno";
				rs = stmt.executeQuery(sql);
				while(rs.next()){
					for(j=0; j<userlist.size(); j++){
						if(userlist.get(j).getCardno().equals(rs.getString(1))){
							userlist.get(j).setDay(userlist.get(j).getDay() + rs.getInt(2));
						}
					}
				}
			}
			
			for(i=0; i<holiday.size(); i++){
				sql = "select cardno,count(*) from b_leaseinfohis_brief where leaseday='" + holiday.get(i) + "' group by cardno";
				rs = stmt.executeQuery(sql);
				while(rs.next()){
					for(j=0; j<userlist.size(); j++){
						if(userlist.get(j).getCardno().equals(rs.getString(1))){
							userlist.get(j).setHoliday(userlist.get(j).getHoliday() + rs.getInt(2));
						}
					}
				}
			}
			
			for(i=0; i<weekend.size(); i++){
				sql = "select cardno,count(*) from b_leaseinfohis_brief where leaseday='" + weekend.get(i) + "' group by cardno";
				rs = stmt.executeQuery(sql);
				while(rs.next()){
					for(j=0; j<userlist.size(); j++){
						if(userlist.get(j).getCardno().equals(rs.getString(1))){
							userlist.get(j).setDay(userlist.get(j).getWeekend() + rs.getInt(2));
						}
					}
				}
			}
			
			rs.close();
			stmt.close();
			
		} catch(Exception e){
			e.printStackTrace();
		}
		
		return userlist;
	}
	
	private ArrayList<Feature> getUserHour(int month, ArrayList userlist){
		ArrayList<String> days = getMonth(month);
		ArrayList<String> hours = getHour();
		
		int i,j;
		String sql = "";
		
		try {
			Statement stmt = link.createStatement();
			ResultSet rs = null;
			
			for(i=0; i<hours.size(); i++){
				for(j=0; j<days.size(); j++){
					sql = "select count(*) from b_leaseinfohis_brief where ";
				}	
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return userlist;
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
				dayStr += "03";
				break;
			case 4: 
				days = 30;
				dayStr += "04";
				break;
			case 5: 
				days = 31;
				dayStr += "05";
				break;
			case 6: 
				days = 30;
				dayStr += "06";
				break;
			case 7: 
				days = 31;
				dayStr += "07";
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
