package dao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class FilterUser {
	
	private Connection link = null;		//远程数据库连接
	private Connection conn = null;		//本地数据库连接
	
	public FilterUser(){
		LocalDB ldb = new LocalDB();
		RemoteDB rdb = new RemoteDB();
		
		
		link = rdb.getLink();
		conn = ldb.getLink();
	}
	
	//将用户数据按月取回
	public void getUserByMonth(){
		String sql = "select cardno,sum(bikenum) from b_userinfo_brief where leaseday like '2014-04%' group by cardno";
		
		try {
			Statement stmt = link.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			
			while(rs.next()){
				writeUser(rs.getString(1), rs.getString(2));
			}
			
			rs.close();
			stmt.close();
			
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	private void writeUser(String cardno, String bikenum){
		String sql = "insert into user_4 (cardno, bikenum) values (" + cardno + ", " + bikenum + ")";
		
		try {
			Statement stmt = conn.createStatement();
			stmt.executeUpdate(sql);
			stmt.close();
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return;
	}
}
