//package com.oracle.bank.model;
//
//import jakarta.persistence.*;
//
//@Entity
//public class Admin {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long adminId;
//
//    @Column(nullable = false, unique = true, length = 50)
//    private String username;
//
//    @Column(nullable = false, length = 100)
//    private String name;
//
//    @Column(nullable = false, length = 100)
//    private String password;
//    
//    public Admin() {}
//
//    public Admin(Long adminId, String username, String name, String password) {
//        this.adminId = adminId;
//        this.username = username;
//        this.name = name;
//        this.password = password;
//    }
//
//	public Long getAdminId() {
//		return adminId;
//	}
//
//	public void setAdminId(Long adminId) {
//		this.adminId = adminId;
//	}
//
//	public String getUsername() {
//		return username;
//	}
//
//	public void setUsername(String username) {
//		this.username = username;
//	}
//
//	public String getName() {
//		return name;
//	}
//
//	public void setName(String name) {
//		this.name = name;
//	}
//
//	public String getPassword() {
//		return password;
//	}
//
//	public void setPassword(String password) {
//		this.password = password;
//	}
//}
