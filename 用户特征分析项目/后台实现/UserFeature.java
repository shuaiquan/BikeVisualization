package dao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.DecimalFormat;
import java.util.ArrayList;

import bean.Feature;

public class UserFeature {
	
	private Connection link;	//远程数据库连接
	private Connection conn;	//本地数据库连接
	
	public UserFeature(){
		LocalDB ldb = new LocalDB();
		RemoteDB rdb = new RemoteDB();
		
		
		link = rdb.getLink();
		conn = ldb.getLink();
	}
	
	public void setUser(){
		setCardno();
	}
	
	//或取3000名用户
	private void setCardno(){
		
		String sql_g = "select cardno from user_4 where rownum <= 3000";
		
		UserFreq uf = new UserFreq();
		
		try {
			Statement stmt_g = conn.createStatement();
			
			ResultSet rs = stmt_g.executeQuery(sql_g);
			while(rs.next()){
				long start = System.currentTimeMillis();
				setDay(rs.getString(1));
				uf.getHourFreq(rs.getString(1));
				long end = System.currentTimeMillis();
				System.out.println("存入一行数据:"+(end -start)/1000+ "s");
			}
			
			rs.close();
			stmt_g.close();
			
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	//获取3000名用户的按日特征数据
	private void setDay(String cardno){
		ArrayList<String> dates = getMonth(4);
		ArrayList<String> weekends = getWeekend(4);
		ArrayList<String> holidays = getHoliday(4);
		
		double[] hours;
		
		int i=0;
		int absense = 0;	//统计未访问天数
		int sum = 0;	//访问总数
		int d_sum =0, w_sum=0, h_sum=0;
		
		String sql = "";
		
		try {
			Statement stmt = link.createStatement();
			ResultSet rs = null;
			
			for(i=0; i<dates.size(); i++){
				sql = "select count(*) from b_leaseinfohis_brief where cardno='" + cardno + "' and leaseday='" + dates.get(i) + "'";
				rs = stmt.executeQuery(sql);
				if(rs.next()){
					if(rs.getInt(1) == 0){
						absense++;
					}
					sum += rs.getInt(1);
				}
			}
			
			for(i=0; i<weekends.size(); i++){
				sql = "select count(*) from b_leaseinfohis_brief where cardno='" + cardno + "' and leaseday='" + weekends.get(i) + "'";
				rs = stmt.executeQuery(sql);
				if(rs.next()){
					w_sum += rs.getInt(1);
				}
				
			}
			
			for(i=0; i<holidays.size(); i++){
				sql = "select count(*) from b_leaseinfohis_brief where cardno='" + cardno + "' and leaseday='" + holidays.get(i) + "'";
				rs = stmt.executeQuery(sql);
				if(rs.next()){
					h_sum += rs.getInt(1);
				}
				
			}

			d_sum = sum - w_sum - h_sum;
			rs.close();
			stmt.close();
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		double dRatio, wRatio, hRatio, freq;
		String mode;
		
		if(d_sum > w_sum && d_sum > h_sum){
			mode = "1";
		}else if(h_sum > d_sum && h_sum > w_sum){
			mode = "0.5";
		}else{
			mode = "0";
		}
		
		dRatio = d_sum*1.0/sum;
		wRatio = w_sum*1.0/sum;
		hRatio = h_sum*1.0/sum;
		freq = (dates.size()-absense)*1.0/dates.size();
		
		hours = setHour(cardno, dates, sum);
		
		try {
			DecimalFormat df = new DecimalFormat("#0.00");
			
			Statement stmt_s = conn.createStatement();
			
			sql = "insert into b_userfeature values ('" + cardno + "', '" + df.format(dRatio) + "', '" + df.format(wRatio) + "', '" + df.format(hRatio) + "', '" + mode + "', '" + df.format(freq) + "', '";
			
			for(i=0; i<17; i++){
				sql += "" + df.format(hours[i]) + "'";
				if(i != 16){
					sql += ", '";
				}
			}
			sql += ")";

			stmt_s.executeUpdate(sql);
			
			stmt_s.close();
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	//获取3000名用户的小时特征数据
	private double[] setHour(String cardno, ArrayList<String> day, int sum){
		ArrayList<String> hours = getHour();
		double[] hRatio = new double[17];
		
		int i=0;
		
		String sql = "";
		
		String days = "(";
		for(i=0; i<day.size(); i++){
			days += "'" + day.get(i) + "'";
			if(i<day.size()-1){
				days += ",";
			}
		}
		days += ")";
		
		try {
			Statement stmt = link.createStatement();
			ResultSet rs = null;
			
			for(i=0; i<hours.size(); i++){
				sql = "select count(*) from b_leaseinfohis_brief where cardno='" + cardno + "' and leasehour='"+hours.get(i)+"' and leaseday in " + days;
				rs = stmt.executeQuery(sql);
				if(rs.next()){
					hRatio[i] = rs.getDouble(1)/sum;
				}
			}
			
			rs.close();
			stmt.close();
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return hRatio;
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

	public ArrayList<Feature> getFeatures(){
		ArrayList<Feature> features = new ArrayList<Feature>();
		
		String sql = "select * from b_userfeature where rownum < 500";
		
		try {
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			
			while(rs.next()){
				Feature f = new Feature();
				
				f.setCardno(rs.getString(1));
				
				f.setWorkdayratio(rs.getDouble(2));
				f.setWeekendratio(rs.getDouble(3));
				f.setHolidayratio(rs.getDouble(4));
				f.setVisitedmode(rs.getDouble(5));
				f.setVisitedfreq(rs.getDouble(6));
				
				f.setH6(rs.getDouble(7));
				f.setH7(rs.getDouble(8));
				f.setH8(rs.getDouble(8));
				f.setH9(rs.getDouble(10));
				f.setH10(rs.getDouble(11));
				f.setH11(rs.getDouble(12));
				f.setH12(rs.getDouble(13));
				f.setH13(rs.getDouble(14));
				f.setH14(rs.getDouble(15));
				f.setH15(rs.getDouble(16));
				f.setH16(rs.getDouble(17));
				f.setH17(rs.getDouble(18));
				f.setH18(rs.getDouble(19));
				f.setH19(rs.getDouble(20));
				f.setH20(rs.getDouble(21));
				f.setH21(rs.getDouble(22));
				f.setH22(rs.getDouble(23));
				
				features.add(f);
			}
			
			rs.close();
			stmt.close();
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return features;
	}
}
