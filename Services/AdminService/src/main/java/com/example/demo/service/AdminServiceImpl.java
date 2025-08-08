package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Admin;
import com.example.demo.repos.AdminRepository;

@Service
public class AdminServiceImpl implements AdminService {
	
    @Autowired
    private AdminRepository adminRepository;
    
    @Override
    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
    }

    @Override
    public Admin updateAdmin(Long id, Admin updatedAdmin) {
        Admin existing = getAdminById(id);
        existing.setUsername(updatedAdmin.getUsername());
        existing.setPassword(updatedAdmin.getPassword());
        return adminRepository.save(existing);
    }

    @Override
    public void deleteAdmin(Long id) {
        Admin admin = getAdminById(id);
        adminRepository.delete(admin);
    }

    @Override
    public boolean login(String username, String password) {
        return adminRepository.findByUsernameAndPassword(username, password).isPresent();
    }
}
