package dao;

import java.sql.*;

public class ConnDB {
	private static Connection link = null;
	
	public static Connection getConnect(){
		try{
			Class.forName("oracle.jdbc.driver.OracleDriver");
			String url = "";
			String name = "";
			String pass = "";
			link = DriverManager.getConnection(url,name,pass);
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return link;
	}
}