package file;

import java.util.ArrayList;
import java.util.Collections;

import javabean.Station;
import dao.ConnDB;

public class KmeansClassify {
	private int k = 30;		//聚类的个数
	private int repeat = 200;	//最大迭代次数
	private double extreme = 0.00000000000001;
	private double[][] center;	//质心
	private ArrayList<ArrayList<Station>> staClassify = new ArrayList<ArrayList<Station>>();		//聚类的结果
	private ArrayList<Station> stations;	//原始站点数据
	
	public KmeansClassify(){
		//从数据库中获取原始站点数据
		ConnDB db = new ConnDB();
		stations = db.getStations();
		//随机打乱原始数据的顺序，保证初始质心的选择
		Collections.shuffle(stations);
		
		int i=0;
		center = new double[k][2];
		for(i=0;i<k;i++){
			center[i][0] = stations.get(i).getX();
			center[i][1] = stations.get(i).getY();
		}
	}
	
	public KmeansClassify(int k){
		//从数据库中获取原始站点数据
		ConnDB db = new ConnDB();
		stations = db.getStations();
		//随机打乱原始数据的顺序，保证初始质心的选择
		Collections.shuffle(stations);
		
		this.k = k;
		int i=0;
		center = new double[k][2];
		for(i=0;i<k;i++){
			center[i][0] = stations.get(i).getX();
			center[i][1] = stations.get(i).getY();
		}
	}
	
	public void setClassify() {
		cleanStaClassify();
		int i,j;
		
		//将所有站点进行一遍聚类
		for(i=0; i<stations.size(); i++){
			int num = 0;
			double distance = findCloserClassify(stations.get(i), center[0]);
			for(j=1; j<k ;j++){
				if(distance == 0){
					break;
				}
				if(distance > findCloserClassify(stations.get(i), center[j])) {
					distance = findCloserClassify(stations.get(i), center[j]);
					num = j;
				}
			}
			
			staClassify.get(num).add(stations.get(i));
		}
		
		//重新计算新的质心
		double[][] nowCenter = new double[k][2];
		for(i=0; i<k; i++){
			for(j=0; j<staClassify.get(i).size(); j++){
				nowCenter[i][0] += staClassify.get(i).get(j).getX();
				nowCenter[i][1] += staClassify.get(i).get(j).getY();
			}
			nowCenter[i][0] /= staClassify.get(i).size();
			nowCenter[i][1] /= staClassify.get(i).size();
		}
		
		this.repeat--;
		if(repeat > 0) {
			if(isChange(nowCenter)) {
				setClassify();
			}
		}
		
	}
	
	private void cleanStaClassify(){
		staClassify.clear();
		for(int i=0; i<k; i++){
			ArrayList<Station> eSta = new ArrayList<Station>();
			staClassify.add(eSta);
		}
	}
	
	public ArrayList<ArrayList<Station>> getClassify() {
		return this.staClassify;
	}
	
	private double findCloserClassify(Station sta, double[] center) {
		double x = Math.pow((sta.getX()-center[0]), 2) + Math.pow((sta.getY()-center[1]), 2);
		return x;
	}
	
	private boolean isChange(double[][] nowCenter) {
		int i,j;
		for(i=0; i<k; i++){
			if(!equals(nowCenter[i], center[i])) {
				return true;
			}
		}
		return false;
	}
	
	private boolean equals(double[] s1, double[] s2) {
		double x = Math.pow((s1[0] - s2[0]), 2) + Math.pow((s1[1] - s2[1]), 2);
		if(x <= this.extreme) {
			return true;
		}else {
			return false;
		}
	}
}
