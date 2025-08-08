package com.example.demo.service;

import java.util.List;

import com.example.demo.entities.Admin;

public interface AdminService {
	
    Admin createAdmin(Admin admin);

    List<Admin> getAllAdmins();

    Admin getAdminById(Long id);

    Admin updateAdmin(Long id, Admin updatedAdmin);

    void deleteAdmin(Long id);
	
	boolean login(String username, String password);
}
