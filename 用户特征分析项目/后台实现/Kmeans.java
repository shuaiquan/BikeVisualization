package dao;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.Collections;

import bean.Feature;

public class Kmeans {
	private int k = 30;		//聚类的个数
	private int repeat = 200;	//最大迭代次数
	private double extreme = 0.00000000000001;
	private double[][] center;	//质心
	private ArrayList<ArrayList<Feature>> fClassify = new ArrayList<ArrayList<Feature>>();		//聚类的结果
	private ArrayList<Feature> features;	//原始站点数据
	
	private Connection conn = null;
	
	public Kmeans(int k){
		
		//从数据库中获取原始站点数据
		UserFeature uf = new UserFeature();
		features = uf.getFeatures();
		

		//随机打乱原始数据的顺序，保证初始质心的选择
		Collections.shuffle(features);
		
		this.k = k;
		int i=0;
		center = new double[k][22];
		for(i=0;i<k;i++){
			center[i][0] = features.get(i).getWorkdayratio();
			center[i][1] = features.get(i).getWeekendratio();
			center[i][2] = features.get(i).getHolidayratio();
			center[i][3] = features.get(i).getVisitedmode();
			center[i][4] = features.get(i).getVisitedfreq();
			
			center[i][5] = features.get(i).getH6();
			center[i][6] = features.get(i).getH7();
			center[i][7] = features.get(i).getH8();
			center[i][8] = features.get(i).getH9();
			center[i][9] = features.get(i).getH10();
			center[i][10] = features.get(i).getH11();
			center[i][11] = features.get(i).getH12();
			center[i][12] = features.get(i).getH13();
			center[i][13] = features.get(i).getH14();
			center[i][14] = features.get(i).getH15();
			center[i][15] = features.get(i).getH16();
			center[i][16] = features.get(i).getH17();
			center[i][17] = features.get(i).getH18();
			center[i][18] = features.get(i).getH19();
			center[i][19] = features.get(i).getH20();
			center[i][20] = features.get(i).getH21();
			center[i][21] = features.get(i).getH22();
		}
	}
	
	public void setClassify() {
		cleanFeatures();
		int i,j;
		
		//将所有站点进行一遍聚类
		for(i=0; i<features.size(); i++){
			int num = 0;
			double distance = findCloserClassify(features.get(i), center[0]);
			for(j=1; j<k ;j++){
				if(distance == 0){
					break;
				}
				if(distance > findCloserClassify(features.get(i), center[j])) {
					distance = findCloserClassify(features.get(i), center[j]);
					num = j;
				}
			}
			
			fClassify.get(num).add(features.get(i));
		}
		
		//重新计算新的质心
		double[][] nowCenter = new double[k][22];
		for(i=0; i<k; i++){
			for(j=0; j<fClassify.get(i).size(); j++){
				nowCenter[i][0] += fClassify.get(i).get(j).getWorkdayratio();
				nowCenter[i][1] += fClassify.get(i).get(j).getWeekendratio();
				nowCenter[i][2] += fClassify.get(i).get(j).getHolidayratio();
				nowCenter[i][3] = fClassify.get(i).get(j).getVisitedmode();
				nowCenter[i][4] = fClassify.get(i).get(j).getVisitedfreq();
				
				nowCenter[i][5] = fClassify.get(i).get(j).getH6();
				nowCenter[i][6] = fClassify.get(i).get(j).getH7();
				nowCenter[i][7] = fClassify.get(i).get(j).getH8();
				nowCenter[i][8] = fClassify.get(i).get(j).getH9();
				nowCenter[i][9] = fClassify.get(i).get(j).getH10();
				nowCenter[i][10] = fClassify.get(i).get(j).getH11();
				nowCenter[i][11] = fClassify.get(i).get(j).getH12();
				nowCenter[i][12] = fClassify.get(i).get(j).getH13();
				nowCenter[i][13] = fClassify.get(i).get(j).getH14();
				nowCenter[i][14] = fClassify.get(i).get(j).getH15();
				nowCenter[i][15] = fClassify.get(i).get(j).getH16();
				nowCenter[i][16] = fClassify.get(i).get(j).getH17();
				nowCenter[i][17] = fClassify.get(i).get(j).getH18();
				nowCenter[i][18] = fClassify.get(i).get(j).getH19();
				nowCenter[i][19] = fClassify.get(i).get(j).getH20();
				nowCenter[i][20] = fClassify.get(i).get(j).getH21();
				nowCenter[i][21] = fClassify.get(i).get(j).getH22();
			}
			
			nowCenter[i][0] /= fClassify.get(i).size();
			nowCenter[i][1] /= fClassify.get(i).size();
			nowCenter[i][2] /= fClassify.get(i).size();
			nowCenter[i][3] /= fClassify.get(i).size();
			nowCenter[i][4] /= fClassify.get(i).size();
			nowCenter[i][5] /= fClassify.get(i).size();
			nowCenter[i][6] /= fClassify.get(i).size();
			nowCenter[i][7] /= fClassify.get(i).size();
			nowCenter[i][8] /= fClassify.get(i).size();
			nowCenter[i][9] /= fClassify.get(i).size();
			nowCenter[i][10] /= fClassify.get(i).size();
			nowCenter[i][11] /= fClassify.get(i).size();
			nowCenter[i][12] /= fClassify.get(i).size();
			nowCenter[i][13] /= fClassify.get(i).size();
			nowCenter[i][14] /= fClassify.get(i).size();
			nowCenter[i][15] /= fClassify.get(i).size();
			nowCenter[i][16] /= fClassify.get(i).size();
			nowCenter[i][17] /= fClassify.get(i).size();
			nowCenter[i][18] /= fClassify.get(i).size();
			nowCenter[i][19] /= fClassify.get(i).size();
			nowCenter[i][20] /= fClassify.get(i).size();
			nowCenter[i][21] /= fClassify.get(i).size();
			
		}
		
		this.repeat--;
		if(repeat > 0) {
			if(isChange(nowCenter)) {
				setClassify();
			}
		}
		
	}
	
	private void cleanFeatures(){
		
		fClassify.clear();
		for(int i=0; i<k; i++){
			ArrayList<Feature> eFeatures = new ArrayList<Feature>();
			fClassify.add(eFeatures);
		}
	}
	
	public ArrayList<ArrayList<Feature>> getClassify() {
		return this.fClassify;
	}
	
	private double findCloserClassify(Feature f, double[] center) {
		
		double x = 0;
		
		x += Math.pow((f.getWorkdayratio() - center[0]), 2);
		x += Math.pow((f.getWeekendratio() - center[1]), 2);
		x += Math.pow((f.getHolidayratio() - center[2]), 2);
		x += Math.pow((f.getVisitedmode() - center[3]), 2);
		x += Math.pow((f.getVisitedfreq() - center[4]), 2);
		
		x += Math.pow((f.getH6() - center[5]), 2);
		x += Math.pow((f.getH7() - center[6]), 2);
		x += Math.pow((f.getH8() - center[7]), 2);
		x += Math.pow((f.getH9() - center[8]), 2);
		x += Math.pow((f.getH10() - center[9]), 2);
		x += Math.pow((f.getH11() - center[10]), 2);
		x += Math.pow((f.getH12() - center[11]), 2);
		x += Math.pow((f.getH13() - center[12]), 2);
		x += Math.pow((f.getH14() - center[13]), 2);
		x += Math.pow((f.getH15() - center[14]), 2);
		x += Math.pow((f.getH16() - center[15]), 2);
		x += Math.pow((f.getH17() - center[16]), 2);
		x += Math.pow((f.getH18() - center[17]), 2);
		x += Math.pow((f.getH19() - center[18]), 2);
		x += Math.pow((f.getH20() - center[19]), 2);
		x += Math.pow((f.getH21() - center[20]), 2);
		x += Math.pow((f.getH22() - center[21]), 2);
		
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
		double x = 0;
		int i=0;
		
		for(; i<s1.length; i++){
			x += Math.pow((s1[i] - s2[1]), 2);
		}

		if(x <= this.extreme) {
			return true;
		}else {
			return false;
		}
	}
}
